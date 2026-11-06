#!/usr/bin/env node
/**
 * agent-runs: where a Claude Code run's wall time and tokens went, one block per agent, read from its transcripts.
 * How to read the numbers and what to change in the next brief: references/subagent-runs.md (this hub).
 *
 * Usage: node agent-runs.mjs [target] [--agent <text>] [--min <minutes>] [--stall <minutes>] [--top <n>] [--main] [--json]
 *   target    a session transcript (<project>/<session>.jsonl), a session folder or its subagents/ folder, one
 *             subagent transcript (agent-*.jsonl), a project folder (its newest session), or nothing: the newest
 *             session of the project for the current directory (or the nearest parent folder that has one).
 *   --agent   only agents whose description contains this text (any case)
 *   --min     leave out agents that ran less than this many minutes (default 5)
 *   --stall   a gap longer than this with no tool running and no model output counts as idle (default 5 minutes)
 *   --top     slowest tool calls shown per agent (default 3)
 *   --main    include the main session itself (its idle time is mostly the user)
 *   --json    the numbers as JSON instead of text
 *
 * Read-only, Node 18+, no dependencies. Transcripts live under $CLAUDE_CONFIG_DIR or ~/.claude: projects/<slug>/
 * <session>.jsonl and <session>/subagents/agent-*.jsonl (with agent-*.meta.json naming the agent's task).
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";

// Where a verdict tips. Kept with the reference's table (subagent-runs.md): change both together.
const LIMITS = {
  idleShare: 0.25,        // idle above this share of wall: the run stalled
  verifyShare: 0.35,      // browser + tests + waiting + servers above this share: verification-bound
  modelShare: 0.55,       // model work above this share: model-bound (scope, effort, context)
  bigOutput: 150_000,     // output tokens for one agent: a big unit of work
  bigContext: 300_000,    // peak context: every call re-reads this much
  manyCalls: 150,         // model calls in one run
};

const USAGE = readFileSync(new URL(import.meta.url), "utf8").split("*/")[0].split("\n").slice(2, -1)
  .map((line) => line.replace(/^ \* ?/, "")).join("\n");

const argv = process.argv.slice(2);
const opts = { min: 5, stall: 5, top: 3, agent: "", json: false, main: false };
const positional = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--help" || a === "-h") { console.log(USAGE); process.exit(0); }
  else if (a === "--json" || a === "--main") opts[a.slice(2)] = true;
  else if (a.startsWith("--")) {
    const key = a.slice(2);
    if (!(key in opts)) fail(`unknown option ${a} (see --help)`);
    opts[key] = typeof opts[key] === "number" ? Number(argv[++i]) : String(argv[++i] ?? "");
  } else positional.push(a);
}

function fail(message) {
  console.error(`agent-runs: ${message}`);
  process.exit(1);
}

// ---------- finding the transcripts ----------

const CLAUDE = process.env.CLAUDE_CONFIG_DIR || join(homedir(), ".claude");
const PROJECTS = join(CLAUDE, "projects");
const slug = (folder) => folder.replace(/[^A-Za-z0-9]/g, "-");

function newestSession(projectDir) {
  const files = readdirSync(projectDir).filter((f) => f.endsWith(".jsonl")).map((f) => join(projectDir, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  if (!files.length) fail(`no session transcripts in ${projectDir}`);
  return files[0];
}

function projectFor(dir) {
  for (let d = resolve(dir); ; d = dirname(d)) {
    const candidate = join(PROJECTS, slug(d));
    if (existsSync(candidate)) return candidate;
    if (dirname(d) === d) fail(`no Claude Code project for ${dir} under ${PROJECTS}: pass a transcript or a folder`);
  }
}

function sessionFiles(mainPath, subFolder) {
  const folder = subFolder || join(dirname(mainPath), basename(mainPath, ".jsonl"), "subagents");
  const agents = existsSync(folder)
    ? readdirSync(folder).filter((f) => /^agent-.*\.jsonl$/.test(f)).map((f) => join(folder, f)) : [];
  return { session: basename(mainPath, ".jsonl"), main: existsSync(mainPath) ? mainPath : null, agents };
}

function locate(target) {
  if (!target) return sessionFiles(newestSession(projectFor(process.cwd())));
  const p = resolve(target);
  if (!existsSync(p)) fail(`not found: ${p}`);
  if (statSync(p).isFile()) {
    if (basename(dirname(p)) === "subagents") {
      return { session: basename(dirname(dirname(p))), main: null, agents: [p] };
    }
    return sessionFiles(p);
  }
  if (basename(p) === "subagents") return sessionFiles(`${dirname(p)}.jsonl`, p);
  if (existsSync(join(p, "subagents"))) return sessionFiles(`${p}.jsonl`, join(p, "subagents"));
  return sessionFiles(newestSession(p));
}

function readRecords(file) {
  const records = [];
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try { records.push(JSON.parse(line)); } catch { /* a line cut off mid-write: skip it */ }
  }
  return records;
}

// ---------- one agent ----------

const blocks = (message) => (Array.isArray(message?.content) ? message.content.filter((b) => b && typeof b === "object") : []);

// Matched against the command and the description the agent gave it, in this order: the first match names the kind.
const SHELL_KINDS = [
  ["browser", /playwright|puppeteer|chromium|msedge|headless|screenshot|lighthouse|selenium|\bbrowser\b|\bui check\b/],
  ["waiting", /\bsleep\b|start-sleep|wait-job|\buntil\b|timeout \/t\b/],
  ["tests", /\b(pytest|jest|vitest|mocha|unittest|go test|cargo test|dotnet test|(npm|pnpm|yarn)( run)? test)\b|\btest_[\w$]+\.(py|m?js|ts)\b|\.(test|spec)\.(m?js|ts)\b|\btests?\/\S*test|\b(re)?run\b.*\btests\b|\btest suite\b/],
  ["build", /\b(docker|podman|compose|make|cargo build|go build|tsc|webpack|vite build|msbuild|gradle|mvn)\b|(npm|pnpm|yarn)( run)? build\b/],
  ["install", /\b(pip|uv|poetry|npm|pnpm|yarn) (install|add|sync|ci)\b|\b(python|py) -m venv\b/],
  ["servers", /\b(uvicorn|gunicorn|flask run|http\.server|curl|wget|invoke-webrequest|invoke-restmethod)\b|(npm|pnpm|yarn)( run)? (dev|start|serve)\b/],
  ["checks", /\b(py_compile|eslint|ruff|mypy|flake8|prettier|lint)\b|\bcheck-[\w-]+|--check\b|\b(re)?run\b.*\b(check|repro)\b|\b(debug|verify|repro)\b/],
  ["git", /\bgit\b/],
];
const VERIFY = new Set(["browser", "tests", "waiting", "servers", "checks"]);
const FILE_TOOLS = new Set(["Read", "Edit", "MultiEdit", "Write", "Grep", "Glob", "NotebookEdit", "LS"]);

function kind(name, input) {
  if (FILE_TOOLS.has(name)) return "file tools";
  if (name === "Agent" || name === "Task") return "subagents";
  if (name === "WebFetch" || name === "WebSearch") return "web";
  if (name === "Monitor") return "waiting";
  if (name === "AskUserQuestion") return "the user";
  if (typeof input.command !== "string") return name;
  const command = `${input.command} ${input.description || ""}`.toLowerCase();
  for (const [label, pattern] of SHELL_KINDS) if (pattern.test(command)) return label;
  return "shell other";
}

function endedBy(rows, i) {
  for (let j = i; j < Math.min(rows.length, i + 6) && rows[j].t - rows[i].t < 15; j++) {
    const r = rows[j];
    if (r.type === "attachment" && String(r.attachment?.prompt || "").includes("<task-notification>")) {
      return "its own background task finished";
    }
    if (r.type === "user" && !r.isMeta && !blocks(r.message).some((b) => b.type === "tool_result")) return "a message arrived";
  }
  return "nothing visible: a stalled request, or the machine asleep";
}

function analyze(records, label, meta = {}) {
  const rows = records.filter((r) => r.timestamp).map((r) => ({ ...r, t: Date.parse(r.timestamp) / 1000 }))
    .sort((a, b) => a.t - b.t);
  if (rows.length < 2) return null;
  const start = rows[0].t;
  const end = rows.at(-1).t;
  const output = new Map();
  const context = new Map();
  const thinking = new Map();
  const effort = new Map();
  const open = new Map();
  const calls = [];
  const idle = [];
  let nonTool = 0;
  let prev = start;
  rows.forEach((r, i) => {
    const gap = r.t - prev;
    if (open.size === 0 && gap > 0) {
      nonTool += gap;
      if (gap >= opts.stall * 60) idle.push({ minutes: gap / 60, at: rows[i - 1].timestamp, ended: endedBy(rows, i) });
    }
    prev = r.t;
    const m = r.message || {};
    if (r.type === "assistant") {
      if (m.id) {
        const u = m.usage || {};
        output.set(m.id, Math.max(output.get(m.id) || 0, u.output_tokens || 0));
        const read = (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
        context.set(m.id, Math.max(context.get(m.id) || 0, read));
        if (r.thinkingDurationMs) thinking.set(m.id, Math.max(thinking.get(m.id) || 0, r.thinkingDurationMs));
        if (r.effort) effort.set(m.id, r.effort);
      }
      for (const b of blocks(m)) if (b.type === "tool_use") open.set(b.id, { t0: r.t, name: b.name, input: b.input || {} });
    } else if (r.type === "user") {
      for (const b of blocks(m)) {
        if (b.type !== "tool_result" || !open.has(b.tool_use_id)) continue;
        const call = open.get(b.tool_use_id);
        open.delete(b.tool_use_id);
        calls.push({ ...call, seconds: r.t - call.t0, kind: kind(call.name, call.input) });
      }
    }
  });

  const wall = end - start;
  const idleSeconds = idle.reduce((s, g) => s + g.minutes * 60, 0);
  const modelSeconds = Math.max(0, nonTool - idleSeconds);
  const toolSeconds = Math.max(0, wall - nonTool);
  const byKind = {};
  for (const c of calls) byKind[c.kind] = (byKind[c.kind] || 0) + c.seconds;
  const verifySeconds = Object.entries(byKind).filter(([k]) => VERIFY.has(k)).reduce((s, [, v]) => s + v, 0);
  const outputTokens = [...output.values()].reduce((s, v) => s + v, 0);
  const efforts = {};
  for (const e of effort.values()) efforts[e] = (efforts[e] || 0) + 1;
  const overran = calls.filter((c) => c.input.timeout && c.seconds > (2 * c.input.timeout) / 1000 + 60);

  return {
    label, type: meta.agentType || null, start, end,
    minutes: { wall: wall / 60, model: modelSeconds / 60, tools: toolSeconds / 60, idle: idleSeconds / 60 },
    modelCalls: output.size,
    outputTokens,
    tokensPerSecond: modelSeconds > 0 ? outputTokens / modelSeconds : 0,
    thinkingMinutes: [...thinking.values()].reduce((s, v) => s + v, 0) / 60000,
    peakContext: Math.max(0, ...context.values()),
    reread: [...context.values()].reduce((s, v) => s + v, 0),
    efforts,
    toolMinutes: Object.fromEntries(Object.entries(byKind).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, v / 60])),
    verifyShare: wall > 0 ? verifySeconds / wall : 0,
    slowest: calls.sort((a, b) => b.seconds - a.seconds).slice(0, opts.top)
      .map((c) => ({ minutes: c.seconds / 60, kind: c.kind, what: describe(c) })),
    idle,
    overran: overran.map((c) => ({ minutes: c.seconds / 60, timeout: c.input.timeout / 1000, what: describe(c) })),
    stillOpen: open.size,
  };
}

function describe(call) {
  const raw = call.input.description || call.input.command || call.input.file_path || call.input.pattern || "";
  return String(raw).replace(/\s+/g, " ").slice(0, 90);
}

function verdict(a) {
  const wall = a.minutes.wall || 1;
  const levers = [];
  let kindOf = "mixed";
  if (a.minutes.idle / wall > LIMITS.idleShare) {
    kindOf = "stalled";
    levers.push("check an agent that has gone quiet instead of waiting for its notification; keep the machine awake");
  } else if (a.verifyShare > LIMITS.verifyShare) {
    kindOf = "verification-bound";
    levers.push("one check pass at the end with a time cap; re-run only what failed; reuse a running server");
  } else if (a.minutes.model / wall > LIMITS.modelShare) {
    kindOf = "model-bound";
    levers.push("split the work into agents with disjoint files, or narrow it; lower effort for mechanical parts");
  }
  if (a.outputTokens > LIMITS.bigOutput) levers.push(`${k(a.outputTokens)} output tokens: a big unit, split it if wall time matters`);
  if (a.peakContext > LIMITS.bigContext) levers.push(`context peaked at ${k(a.peakContext)}: point it at files instead of letting it explore; cap tool output`);
  if (a.modelCalls > LIMITS.manyCalls) levers.push(`${a.modelCalls} model calls: batch edits; give file:line pointers in the brief`);
  if (a.overran.length) levers.push(`${a.overran.length} command(s) ran far past their timeout: the machine was asleep or overloaded`);
  if (a.besides) levers.push(`ran beside ${a.besides} other agent(s) on the same machine: their tools share its CPU`);
  if (a.idle.some((g) => g.ended.startsWith("its own"))) levers.push("waited idle on its own background job: run it in the foreground with a timeout, or work meanwhile");
  return { kind: kindOf, levers };
}

// ---------- the session ----------

const where = locate(positional[0]);
const analyses = [];
for (const file of where.agents) {
  const metaFile = file.replace(/\.jsonl$/, ".meta.json");
  const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, "utf8")) : {};
  const label = meta.description || basename(file, ".jsonl");
  const a = analyze(readRecords(file), label, meta);
  if (a) analyses.push(a);
}
if (opts.main && where.main) {
  const a = analyze(readRecords(where.main).filter((r) => !r.isSidechain), "main session", { agentType: "main" });
  if (a) analyses.push(a);
}
for (const a of analyses) {
  a.besides = analyses.filter((b) => b !== a && b.label !== "main session"
    && Math.min(a.end, b.end) - Math.max(a.start, b.start) > 0.1 * (a.end - a.start)).length;
  a.verdict = verdict(a);
}
const shown = analyses.filter((a) => a.minutes.wall >= opts.min)
  .filter((a) => !opts.agent || a.label.toLowerCase().includes(opts.agent.toLowerCase())).sort((a, b) => b.minutes.wall - a.minutes.wall);

if (opts.json) {
  console.log(JSON.stringify({ session: where.session, agents: analyses.length, shown }, null, 2));
  process.exit(0);
}

function k(n) {
  return n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : `${Math.round(n / 1000)}K`;
}
function min(m) {
  if (m < 0.05) return "0";
  return m < 10 ? m.toFixed(1) : String(Math.round(m));
}
function clock(seconds, withDate = false) {
  const d = new Date(seconds * 1000);
  const two = (n) => String(n).padStart(2, "0");
  return `${withDate ? `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())} ` : ""}${two(d.getHours())}:${two(d.getMinutes())}`;
}
function span(a) {
  const days = new Date(a.start * 1000).toDateString() !== new Date(a.end * 1000).toDateString();
  return `${clock(a.start, days)} to ${clock(a.end, days)}`;
}

console.log(`session ${where.session}: ${analyses.length} agent(s), ${shown.length} shown (${opts.min}+ min)`);
for (const a of shown) {
  const effort = Object.entries(a.efforts).sort((x, y) => y[1] - x[1]).map(([e]) => e).join("/") || "?";
  console.log(`\n${a.label}  [${a.type || "agent"} · effort ${effort} · ${span(a)}${a.stillOpen ? " · still running" : ""}]`);
  console.log(`  wall ${min(a.minutes.wall)} min = model ${min(a.minutes.model)} + tools ${min(a.minutes.tools)} + idle ${min(a.minutes.idle)}   verdict: ${a.verdict.kind}`);
  console.log(`  ${a.modelCalls} model calls · ${k(a.outputTokens)} output (${Math.round(a.tokensPerSecond)} tok/s while working) · thinking ${min(a.thinkingMinutes)} min · peak context ${k(a.peakContext)} · ${k(a.reread)} re-read`);
  const tools = Object.entries(a.toolMinutes).filter(([, v]) => v >= 0.1).slice(0, 7).map(([kk, v]) => `${kk} ${min(v)}`);
  if (tools.length) console.log(`  tools: ${tools.join(" · ")}`);
  for (const s of a.slowest.filter((x) => x.minutes >= 1)) console.log(`  slow:  ${min(s.minutes)} min [${s.kind}] ${s.what}`);
  for (const g of a.idle) console.log(`  idle:  ${min(g.minutes)} min from ${clock(Date.parse(g.at) / 1000)}, ended by ${g.ended}`);
  for (const lever of a.verdict.levers) console.log(`  - ${lever}`);
}
if (shown.length > 1) {
  const sum = (f) => shown.reduce((s, a) => s + f(a), 0);
  const share = (f) => Math.round((100 * sum(f)) / Math.max(1, sum((a) => a.minutes.wall)));
  console.log(`\nacross ${shown.length}: wall ${Math.round(sum((a) => a.minutes.wall))} min (model ${share((a) => a.minutes.model)}%, tools ${share((a) => a.minutes.tools)}%, idle ${share((a) => a.minutes.idle)}%) · ${k(sum((a) => a.outputTokens))} output tokens`);
}

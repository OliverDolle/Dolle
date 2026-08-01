#!/usr/bin/env node
/**
 * Guards two regressions that are silent at runtime and expensive in practice.
 *
 * 1. MCP tool names in an agent's `tools:` frontmatter.
 *
 *    `tools` is an exact-match allow-list with no wildcard syntax, and plugin MCP tool names are
 *    NOT stable across hosts. Bare `claude` exposes the bundled server as `mcp__dolle-mcp__<tool>`;
 *    Claude Code desktop and the Agent SDK namespace plugin servers per-plugin, exposing the same
 *    tools as `mcp__plugin_devkit_dolle-mcp__<tool>`. A list written against one host resolves to
 *    ZERO MCP tools on the other — no error, no warning. The agent then substitutes whatever it can
 *    still reach (a local Dolle-MCP checkout, its own memory) and returns work that reads as
 *    verified but never touched the server.
 *
 *    The fix is to omit `tools:` so the agent inherits the session pool, which also means a newly
 *    shipped Dolle-MCP tool is callable with no edit here. Subtract with `disallowedTools:`.
 *
 * 2. A trailing `</content>` line, an artifact of generated writes that leaks verbatim into the
 *    agent's system prompt.
 *
 * Usage: node scripts/check-agent-tools.mjs
 * Exits 1 with a per-file report on any violation.
 */

import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SCAN_ROOT = join(ROOT, 'plugins');
const SKIP_DIRS = new Set(['node_modules', '.git']);

async function markdownFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      out.push(...(await markdownFiles(join(dir, entry.name))));
    } else if (entry.name.endsWith('.md')) {
      out.push(join(dir, entry.name));
    }
  }
  return out;
}

/** Return the raw YAML frontmatter block, or null when the file has none. */
function frontmatter(text) {
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---', 4);
  return end === -1 ? null : text.slice(4, end + 1);
}

/**
 * Read the `tools:` value out of a frontmatter block. Handles the inline-list form
 * (`tools: A, B`), the YAML flow form (`tools: [A, B]`) and the block-sequence form
 * (`tools:` followed by `  - A` lines). Returns null when the key is absent — the good case.
 */
function toolsValue(fm) {
  const lines = fm.split('\n');
  const i = lines.findIndex(l => /^tools:/.test(l));
  if (i === -1) return null;
  const inline = lines[i].slice('tools:'.length).trim();
  if (inline) return inline;
  const seq = [];
  for (let j = i + 1; j < lines.length; j++) {
    const m = /^\s+-\s*(.+)$/.exec(lines[j]);
    if (!m) break;
    seq.push(m[1].trim());
  }
  return seq.join(', ');
}

const problems = [];

for (const file of await markdownFiles(SCAN_ROOT)) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  // Normalize CRLF: these files are authored on Windows, and the parsing below is line-based.
  // Without this, `startsWith('---\n')` fails on every file and the frontmatter check silently
  // never runs — which is exactly how this script shipped broken the first time.
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

  if (text.trimEnd().endsWith('</content>')) {
    problems.push(`${rel}: ends with a stray </content> line — it leaks into the system prompt.`);
  }

  const fm = frontmatter(text);
  if (!fm) continue;
  const tools = toolsValue(fm);
  if (tools && tools.includes('mcp__')) {
    const names = [...tools.matchAll(/mcp__[A-Za-z0-9_-]+/g)].map(m => m[0]);
    problems.push(
      `${rel}: \`tools:\` allow-lists ${names.length} MCP tool name(s), starting with ` +
        `${names[0]}. MCP tool names differ per host, so this resolves to zero MCP tools ` +
        `elsewhere. Omit \`tools:\` to inherit the session pool; subtract with \`disallowedTools:\`.`
    );
  }
}

if (problems.length) {
  console.error(`check-agent-tools: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  - ${p}`);
  console.error('\nSee "Conventions for changes in this repo" in AGENTS.md.');
  process.exit(1);
}

console.log('check-agent-tools: ok');

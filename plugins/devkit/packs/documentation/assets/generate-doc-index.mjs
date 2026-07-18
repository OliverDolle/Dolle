#!/usr/bin/env node
// generate-doc-index.mjs
//
// Scans docs/ for Markdown files, reads the `description` field from each file's YAML
// frontmatter, and rewrites the documentation index in README.md between marker comments —
// linking each doc and pasting its description. This keeps the README index in sync with the
// docs automatically (run by the "Docs Index" GitHub Action).
//
// It also inserts a "Back to README" link at the top of every doc (just after the
// frontmatter), wrapped in BACK-TO-README markers so it stays idempotent and the link target
// is recomputed relative to each doc's location.
//
// Usage:
//   node scripts/generate-doc-index.mjs           # rewrite README.md + doc back-links in place
//   node scripts/generate-doc-index.mjs --check   # exit 1 if anything is out of date (CI)
//
// Doc frontmatter convention (2-3 sentence description):
//   ---
//   title: Installation
//   description: >-
//     What this document covers, in 2-3 sentences. Extracted verbatim into the README index.
//   order: 10        # optional integer; lower sorts first
//   ---
//
// README must contain these markers (the region between them is generated):
//   <!-- DOC-INDEX:START -->
//   <!-- DOC-INDEX:END -->

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep, posix, basename, dirname } from "node:path";

// Repo to operate on: DOC_INDEX_ROOT when set (the reusable CI workflow sets it, since there the
// generator is fetched from another repo), otherwise the current working directory. Run the
// script from your repo root for the default to be correct.
const ROOT = process.env.DOC_INDEX_ROOT ? resolve(process.env.DOC_INDEX_ROOT) : process.cwd();
const DOCS_DIR = join(ROOT, "docs");
const README = join(ROOT, "README.md");
const START = "<!-- DOC-INDEX:START -->";
const END = "<!-- DOC-INDEX:END -->";
const BACK_START = "<!-- BACK-TO-README:START -->";
const BACK_END = "<!-- BACK-TO-README:END -->";
const BACK_LABEL = "← Back to README"; // "← Back to README"
const CHECK = process.argv.includes("--check");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

// Minimal frontmatter parser: key: value pairs, quoted strings, and block scalars (> | with
// optional chomping indicators). Enough for title/description/order without a YAML dependency.
function parseFrontmatter(text) {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---", 3);
  if (end === -1) return {};
  const block = text.slice(3, end).replace(/^\r?\n/, "");
  const lines = block.split(/\r?\n/);
  const data = {};
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    if (/^[>|][+-]?$/.test(val)) {
      const fold = val.startsWith(">");
      const collected = [];
      while (i + 1 < lines.length && (/^\s+/.test(lines[i + 1]) || lines[i + 1].trim() === "")) {
        i++;
        collected.push(lines[i].replace(/^\s+/, ""));
      }
      val = fold ? collected.join(" ") : collected.join("\n");
    } else {
      val = val.replace(/^["']|["']$/g, "");
    }
    data[key] = val.trim();
  }
  return data;
}

function deriveTitle(text, filePath) {
  const h = text.match(/^#\s+(.+)$/m);
  return h ? h[1].trim() : basename(filePath).replace(/\.md$/, "");
}

function toIndexRow(entry) {
  const desc = (entry.description || "_No description yet._")
    .replace(/\s+/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
  return `| [${entry.title}](${entry.rel}) | ${desc} |`;
}

// The README-relative link target for a given doc, in posix form (docs/foo.md -> ../README.md).
function readmeLinkFrom(filePath) {
  const rel = relative(dirname(filePath), README).split(sep).join(posix.sep);
  return rel || "README.md";
}

// Ensure a marker-wrapped "Back to README" block sits at the top of a doc (after any
// frontmatter). Returns the updated text, or null if the file already matches.
function ensureBackLink(filePath, text) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const block = `${BACK_START}${eol}[${BACK_LABEL}](${readmeLinkFrom(filePath)})${eol}${BACK_END}`;

  // Strip any existing block (and the blank line(s) that followed it) so we can re-insert fresh.
  const stripRe = new RegExp(`${BACK_START}[\\s\\S]*?${BACK_END}(?:\\r?\\n)*`);
  const stripped = text.replace(stripRe, "");

  // Find the insertion point: immediately after the frontmatter, else at the very top.
  let insertAt = 0;
  if (stripped.startsWith("---")) {
    const close = stripped.indexOf("\n---", 3);
    if (close !== -1) {
      const nl = stripped.indexOf("\n", close + 4);
      insertAt = nl === -1 ? stripped.length : nl + 1;
    }
  }

  const head = stripped.slice(0, insertAt);
  const body = stripped.slice(insertAt).replace(/^(?:\r?\n)+/, ""); // drop leading blank lines
  const next = head + block + eol + eol + body;
  return next === text ? null : next;
}

function main() {
  const files = walk(DOCS_DIR).sort();
  const entries = files.map((f) => {
    const text = readFileSync(f, "utf8");
    const fm = parseFrontmatter(text);
    const order = fm.order !== undefined && fm.order !== "" && Number.isFinite(+fm.order) ? +fm.order : 1e9;
    return {
      title: fm.title || deriveTitle(text, f),
      description: fm.description || "",
      order,
      rel: relative(ROOT, f).split(sep).join(posix.sep),
      missing: !fm.description,
    };
  });
  entries.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  for (const e of entries.filter((e) => e.missing)) {
    console.error(`warning: ${e.rel} has no 'description' in frontmatter`);
  }

  const table = [
    "| Doc | What it covers |",
    "| --- | --- |",
    ...entries.map(toIndexRow),
  ].join("\n");

  const readme = readFileSync(README, "utf8");
  const si = readme.indexOf(START);
  const ei = readme.indexOf(END);
  if (si === -1 || ei === -1 || ei < si) {
    console.error(`error: README.md must contain the ${START} and ${END} markers.`);
    process.exit(2);
  }
  const nextReadme = readme.slice(0, si + START.length) + "\n\n" + table + "\n\n" + readme.slice(ei);
  const readmeChanged = nextReadme !== readme;

  // Back-to-README link at the top of each doc.
  const docUpdates = [];
  for (const f of files) {
    const updated = ensureBackLink(f, readFileSync(f, "utf8"));
    if (updated !== null) docUpdates.push([f, updated]);
  }

  if (CHECK) {
    if (readmeChanged || docUpdates.length) {
      console.error("Docs are OUT OF DATE. Run: node scripts/generate-doc-index.mjs");
      process.exit(1);
    }
    console.log(`Docs up to date (${entries.length} docs).`);
    return;
  }

  if (readmeChanged) writeFileSync(README, nextReadme);
  for (const [f, updated] of docUpdates) writeFileSync(f, updated);

  const idx = readmeChanged ? "index updated" : "index up to date";
  const links = docUpdates.length ? `back-links updated in ${docUpdates.length} doc(s)` : "back-links up to date";
  console.log(`Doc ${idx}; ${links} (${entries.length} docs).`);
}

main();

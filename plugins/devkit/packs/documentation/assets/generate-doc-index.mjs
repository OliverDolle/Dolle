#!/usr/bin/env node
// generate-doc-index.mjs
//
// Scans docs/ for Markdown files, reads the `description` field from each file's YAML
// frontmatter, and rewrites the documentation index in README.md between marker comments —
// linking each doc and pasting its description. This keeps the README index in sync with the
// docs automatically (run by the "Docs Index" GitHub Action).
//
// Usage:
//   node scripts/generate-doc-index.mjs           # rewrite README.md in place
//   node scripts/generate-doc-index.mjs --check   # exit 1 if README.md is out of date (CI)
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
import { join, relative, sep, posix, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, ".."); // this script lives in <repo>/scripts/
const DOCS_DIR = join(ROOT, "docs");
const README = join(ROOT, "README.md");
const START = "<!-- DOC-INDEX:START -->";
const END = "<!-- DOC-INDEX:END -->";
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
  const next = readme.slice(0, si + START.length) + "\n\n" + table + "\n\n" + readme.slice(ei);

  if (next === readme) {
    console.log(`Doc index is up to date (${entries.length} docs).`);
    return;
  }
  if (CHECK) {
    console.error("Doc index is OUT OF DATE. Run: node scripts/generate-doc-index.mjs");
    process.exit(1);
  }
  writeFileSync(README, next);
  console.log(`Doc index updated (${entries.length} docs).`);
}

main();

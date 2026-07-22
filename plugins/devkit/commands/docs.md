---
description: "Use when creating or updating project documentation — BEFORE writing docs or a README. A short README hub whose index is auto-generated from each doc's frontmatter, one doc per major section, and a code map of where subsystems live. Triggers: 'write docs', 'document this project', 'update the README', 'the docs are stale', 'add a doc for X'."
argument-hint: "[optional: 'this project' or a subsystem to document]"
---

**A "write / update the docs" request matches this command — load it before writing docs or a
README; do not improvise a structure.** Read the file
`${CLAUDE_PLUGIN_ROOT}/packs/documentation/SKILL.md` in full and follow it as the active method for
this work.

Then:
1. Confirm in one line that the **documentation** pack is loaded.
2. Summarize the method in 3–5 bullets (short README that states what the project is + a
   navigable index linking each per-section doc).
3. If the user asked to document something below, follow the pack's process. For larger jobs,
   consider dispatching the `doc-writer` subagent.

User request (optional): $ARGUMENTS

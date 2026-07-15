---
description: Load the documentation skill pack (short README + linked per-section docs).
argument-hint: "[optional: 'this project' or a subsystem to document]"
---

Read the file `${CLAUDE_PLUGIN_ROOT}/packs/documentation/SKILL.md` in full and adopt it as
active guidance for the rest of this session.

Then:
1. Confirm in one line that the **documentation** pack is loaded.
2. Summarize the method in 3–5 bullets (short README that states what the project is + a
   navigable index linking each per-section doc).
3. If the user asked to document something below, follow the pack's process. For larger jobs,
   consider dispatching the `doc-writer` subagent.

User request (optional): $ARGUMENTS

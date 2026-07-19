---
description: "Use when a task is large enough to split across subagents — decomposing work and orchestrating explore, plan, implement, verify instead of doing it all in one context. Use BEFORE starting a big multi-part build or investigation. Triggers: 'break this down', 'use subagents', 'parallelize this', 'orchestrate agents', 'this is a big task'."
argument-hint: "[optional task to start on]"
---

Read the file `${CLAUDE_PLUGIN_ROOT}/packs/subagent-driven-development/SKILL.md` in full and
adopt it as active guidance for the rest of this session.

Then:
1. Confirm in one line that the **subagent-driven development** pack is loaded.
2. Summarize its core loop in 3–5 bullets.
3. If the user provided a task below, immediately begin applying the methodology to it —
   propose a decomposition and which subagents you would dispatch before doing the work.

User task (optional): $ARGUMENTS

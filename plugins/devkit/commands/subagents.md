---
description: "Use when a task is large enough to split across subagents — decomposing work and orchestrating explore, plan, implement, verify — or when writing the instructions/brief that a subagent runs on. Use BEFORE starting a big multi-part build or investigation, or before dispatching a worker. Triggers: 'break this down', 'use subagents', 'parallelize this', 'orchestrate agents', 'this is a big task', 'write a subagent prompt', 'guide subagents'."
argument-hint: "[optional task, or a skill: orchestration | writing-subagent-instructions]"
---

**A large, multi-part task matches this command — load it before starting; do not attempt the whole
thing in one context.** Read the section index
`${CLAUDE_PLUGIN_ROOT}/packs/subagent-driven-development/INDEX.md`, then read the relevant
skill(s) under that folder and follow them as the active method for this work:

- `orchestration/SKILL.md` — deciding whether/how to split the task and run the fan-out (read this
  for almost any invocation).
- `writing-subagent-instructions/SKILL.md` — the craft of the brief each subagent runs on (read
  this before you actually dispatch, or when the user asks how to guide/instruct subagents).

If the user named a skill in the argument (e.g. `writing-subagent-instructions`), focus on that one.

Then:
1. Confirm in one line which **subagent-driven development** skill(s) you loaded.
2. Summarize the core loop (from `orchestration`) in 3–5 bullets.
3. If the user provided a task below, immediately begin applying the methodology to it —
   propose a decomposition and which subagents you would dispatch (with self-contained briefs)
   before doing the work.

User task (optional): $ARGUMENTS

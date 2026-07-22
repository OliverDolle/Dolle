---
name: subagent-driven-development
description: Section index for building software by delegating to subagents. Two skills — orchestration (decompose → delegate → verify → integrate: when and how to split work across subagents) and writing-subagent-instructions (the craft of the brief each subagent runs on). Read orchestration to plan the fan-out; add writing-subagent-instructions when you write the briefs.
---

# Subagent-driven development — section index

This section is about getting more done by running a *team* of focused subagents instead of doing
everything in one context. It has two skills that stack:

- **`orchestration`** — the methodology: when delegation pays, the decompose → delegate → verify →
  integrate loop, the subagent roles, parallel vs. sequential, and verification patterns.
- **`writing-subagent-instructions`** — the craft of the individual brief: the role/goal/context/
  output/boundaries contract, pinning the decisions you don't want delegated, tool grants, effort
  scaling, stop conditions, requiring a deviations report, and a copy-paste template.

## Skills in this section

| Skill | Read it for | File |
| --- | --- | --- |
| **Orchestration** | Deciding whether to split a task, how to decompose it, which subagent roles to dispatch, running units in parallel vs. sequence, and verifying load-bearing results. | `orchestration/SKILL.md` |
| **Writing subagent instructions** | Authoring the actual brief/system prompt a subagent runs on so a context-free worker produces what you meant — the brief contract, pinning non-delegated decisions, tools, effort scaling, and a deviations report. | `writing-subagent-instructions/SKILL.md` |

Paths are relative to this section folder
(`${CLAUDE_PLUGIN_ROOT}/packs/subagent-driven-development/`).

## How to use this section

- **Planning a big task:** read `orchestration` — it tells you whether and how to split the work.
- **About to dispatch:** read `writing-subagent-instructions` before you write the first brief; a
  weak brief is the most common cause of a bad result, not a weak worker.
- Read both when you're running a real fan-out; they're two halves of the same job.

## How these relate to the rest of devkit

Orchestration is the general method; `devkit:agent-development` builds *programmatic* multi-agent
systems (LangChain/LangGraph) whose worker prompts follow the same brief contract.
`devkit:prompt-enhancement` sharpens the *user's* request before you decompose it.

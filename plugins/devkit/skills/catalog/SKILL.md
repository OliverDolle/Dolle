---
name: catalog
description: Catalog of devkit's development skills — building agents and workflows with LangChain and LangGraph, subagent-driven development, documentation, and scaffolding templates. Consult this on such tasks to find and read the right devkit guidance automatically, instead of the user loading a section by hand.
---

# devkit skill catalog

This is the index of devkit's bundled skills. When a task matches an entry below, **read that
skill file directly** to load focused guidance before doing the work — you do not need the user
to run a loader command.

The skills live under this plugin at `${CLAUDE_PLUGIN_ROOT}/packs/`. Read the specific
`SKILL.md`(s) for the task; read more than one when they apply (e.g. LangChain **and**
LangGraph, which are used together). Reading a catalog entry does not load the others — pull in
only what the task needs.

## Agent development — build agents & workflows (LangChain + LangGraph)

Section index: `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/INDEX.md`

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/langchain-agents/SKILL.md` | Creating a tool-using LangChain agent (models, tools, structured output, memory). |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/langgraph-workflows/SKILL.md` | A stateful/multi-step workflow — routing, loops, persistence, human-in-the-loop. |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/combining-langchain-and-langgraph/SKILL.md` | Deciding which to use, or using both together. |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/workflow-design/SKILL.md` | Structuring a non-trivial workflow before coding. |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/troubleshooting/SKILL.md` | Debugging a LangChain/LangGraph error. |

## Subagent-driven development

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/subagent-driven-development/SKILL.md` | Decomposing a large task and orchestrating subagents (explore → plan → implement → verify). |

## Documentation

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/documentation/SKILL.md` | Creating or updating project documentation (short README + linked per-section docs + code map). |

## Scaffolding templates

Runnable starters live under `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/templates/`
(`langgraph-workflow`, `langchain-agent`), each with a `TEMPLATE.md`. To start a project from
one, follow the `/devkit:scaffold` behavior: copy the template's files (except `TEMPLATE.md`)
into the target, replace placeholders, and adapt it to the task.

## If a path doesn't resolve

If `${CLAUDE_PLUGIN_ROOT}` isn't expanded in your environment, the files are in this plugin's
directory (the same install dir this skill was loaded from) — locate them with Glob
(e.g. `**/dolle/devkit/**/packs/**/SKILL.md`), or invoke the matching loader skill instead:
`devkit:agent-development`, `devkit:subagents`, `devkit:docs`, or `devkit:scaffold`.

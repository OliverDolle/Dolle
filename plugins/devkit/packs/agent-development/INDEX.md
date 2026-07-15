---
name: agent-development
description: Section index for building AI agents and workflows with LangChain and LangGraph — including how to combine them, how to design a workflow, and a log of errors seen during development.
---

# Agent Development — section index

This section covers building AI **agents and workflows**. LangChain and LangGraph are normally
used **together**: LangChain supplies the models, tools, prompts, and output parsers; LangGraph
supplies the stateful control flow (branching, loops, persistence, human-in-the-loop) that
turns those pieces into a robust agent or workflow.

Read the skills relevant to the task rather than all of them. For most agent-building work you
will want the first three together.

## Skills in this section

| Skill | Read it for | File |
| --- | --- | --- |
| **LangChain agents** | Models, tools, tool-calling agents, structured output, memory, streaming | `langchain-agents/SKILL.md` |
| **LangGraph workflows** | `StateGraph`, routing, loops, persistence, human-in-the-loop, prebuilt ReAct agent | `langgraph-workflows/SKILL.md` |
| **Combining LangChain + LangGraph** | How the two fit together, which to reach for when, and a combined end-to-end example | `combining-langchain-and-langgraph/SKILL.md` |
| **Workflow design** | How to *construct* a workflow well: shape choice, state modeling, node granularity, control flow, reliability, observability, testing | `workflow-design/SKILL.md` |
| **Troubleshooting** | Errors encountered during development and their fixes — a living log you append to | `troubleshooting/SKILL.md` |

Paths are relative to this section folder
(`${CLAUDE_PLUGIN_ROOT}/packs/agent-development/`).

## Starter templates

This section ships runnable starter templates under `templates/` — `langgraph-workflow` and
`langchain-agent`. Scaffold one into a project with the `/scaffold` command (it copies the
files and adapts them to the task).

## How to use this section

- **Building an agent/workflow from scratch:** read `langchain-agents` + `langgraph-workflows`
  + `combining-langchain-and-langgraph`. Consider `/scaffold` to start from a template.
- **Structuring a non-trivial workflow:** also read `workflow-design` before coding.
- **Hit an error:** consult `troubleshooting`; if the fix isn't there yet, add an entry so the
  next person (or session) benefits.

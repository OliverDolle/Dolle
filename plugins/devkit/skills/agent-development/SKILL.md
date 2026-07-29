---
name: agent-development
description: >-
  Building or debugging an AI agent or LLM workflow with LangChain and/or LangGraph — BEFORE writing
  agent code. Tool-using agents, stateful graph workflows, how the two compose, designing a workflow
  before coding it, and a troubleshooting log. Triggers: 'build an agent', 'langchain', 'langgraph',
  'stateful workflow', 'tool-calling agent', 'StateGraph', 'create_react_agent', 'add
  memory/checkpointer', 'human-in-the-loop', 'agent error'.
---

# Agent development — router

> Read only the reference(s) below that the task needs. Name which one in a line, then work from it.

LangChain supplies models, tools, prompts, output parsers; LangGraph supplies the stateful control
flow. Real work usually uses both.

| Reference | Read it when |
| --- | --- |
| `langchain-agents` | Building a tool-using assistant without hand-managing the loop. |
| `langgraph-workflows` | Control flow matters — branching, loops with exit conditions, memory across turns, approval steps. |
| `combining-langchain-and-langgraph` | Unsure which does what, or wiring both together. |
| `workflow-design` | **Before** writing a non-trivial graph. Most workflow bugs are control-flow bugs. |
| `troubleshooting` | You hit an error. **Append an entry** when you fix one that isn't listed. |

Paths: `references/<name>.md`. From scratch: `langchain-agents` + `langgraph-workflows`.

**Binds regardless:** fast path first (`create_react_agent` before a custom `StateGraph`); a hard exit
on every loop; verify package names and signatures against what's installed and state your version
assumptions — these libraries break between minor releases.

Starters at `${CLAUDE_PLUGIN_ROOT}/templates/` via `/scaffold`. Dispatch `agent-developer` for larger
builds.

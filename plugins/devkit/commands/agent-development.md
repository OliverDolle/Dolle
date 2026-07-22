---
description: "Use when building or debugging an AI agent or LLM workflow with LangChain and/or LangGraph — BEFORE writing agent code. Loads tool-using agents, stateful LangGraph workflows, how to combine them, workflow design, and a troubleshooting log. Triggers: 'build an agent', 'langchain', 'langgraph', 'stateful workflow', 'tool-calling agent', 'add memory/checkpointer'."
argument-hint: "[optional task, or a skill to focus e.g. 'workflow-design']"
---

**An agent / LLM-workflow build or debug matches this command — load it before writing agent code;
do not hand-roll LangChain/LangGraph from memory.** First read the section index at
`${CLAUDE_PLUGIN_ROOT}/packs/agent-development/INDEX.md` to see the skills available in this section.

Then read the skill files relevant to the task from
`${CLAUDE_PLUGIN_ROOT}/packs/agent-development/<skill>/SKILL.md`. LangChain and LangGraph are
normally used together, so:

- For building an agent or workflow, read **langchain-agents**, **langgraph-workflows**, and
  **combining-langchain-and-langgraph** together.
- When structuring a non-trivial workflow, also read **workflow-design** before coding.
- When you hit an error, consult **troubleshooting** (and add a new entry if the fix isn't
  there yet).

If the user named a specific skill to focus on, prioritize reading that one.

Then:
1. Confirm in one line which skills you loaded.
2. Summarize the section in 3–5 bullets.
3. If the user provided a task, start on it — for anything non-trivial, sketch the workflow
   (state, nodes, edges, exit conditions) before writing code. Consider dispatching the
   `agent-developer` subagent for larger builds.

User task / focus (optional): $ARGUMENTS

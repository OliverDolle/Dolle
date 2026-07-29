---
name: langchain-agent
description: Starter for a LangChain tool-calling agent — a model, example tools, a prompt with the required scratchpad, and an AgentExecutor. Copy it in and adapt the tools and prompt to your task.
---

# Template: LangChain agent

A small, self-contained tool-calling agent. Good when you want a tool-using assistant without
custom control flow. If you need branching, loops, or persistence, use the `langgraph-workflow`
template instead.

## Files (copy all except this TEMPLATE.md)
- `requirements.txt` — dependencies
- `.env.example` — copy to `.env` and set your API key
- `agent.py` — the agent (tools, prompt, executor) and a runnable `main()`
- `README.md` — how to run

## Placeholders to replace
- `{{PROJECT_NAME}}` — the project name (README, docstrings)
- `{{MODEL}}` — the chat model id (default suggestion: `gpt-4o-mini`)

## After copying — adapt to the task
1. Replace the example `add` tool in `agent.py` with your real tools (precise docstrings!).
2. Adjust the system prompt for the assistant's role.
3. Keep the `agent_scratchpad` placeholder — the tool-call loop needs it.

See `devkit:agent-development` → `references/langchain-agents.md` for details.

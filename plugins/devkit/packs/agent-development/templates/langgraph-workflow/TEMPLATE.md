---
name: langgraph-workflow
description: Starter for a custom LangGraph StateGraph workflow — typed state, a model node, a tool node, conditional routing with a loop, and a persistence checkpointer. Copy it in and adapt the state, nodes, and tools to your task.
---

# Template: LangGraph workflow

A minimal but realistic LangGraph app you copy into a project and adapt.

## Files (copy all except this TEMPLATE.md)
- `requirements.txt` — dependencies
- `.env.example` — copy to `.env` and set your API key
- `app/state.py` — the graph `State` (edit the fields for your task)
- `app/tools.py` — example tool(s) (replace with your own)
- `app/graph.py` — builds the `StateGraph` (rename nodes/edges to fit)
- `main.py` — entry point that runs the graph
- `README.md` — how to run

## Placeholders to replace
- `{{PROJECT_NAME}}` — the project/app name (README, module docstrings)
- `{{MODEL}}` — the chat model id (default suggestion: `gpt-4o-mini`)

## After copying — adapt to the task
1. Redefine `State` in `app/state.py` for the data your workflow carries.
2. Replace the example tool(s) in `app/tools.py` (or remove them if the workflow has no tools).
3. Rename/replace the nodes and routing in `app/graph.py`; keep a hard exit condition on any
   loop.
4. Swap `MemorySaver()` for a durable checkpointer (SQLite/Postgres) before production.
5. Update `README.md` and delete anything the task doesn't need.

See the devkit `agent-development` skills (`langgraph-workflows`, `workflow-design`) for the
reasoning behind this structure.

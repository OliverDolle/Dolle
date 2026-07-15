# {{PROJECT_NAME}}

A LangGraph workflow scaffolded from the devkit `langgraph-workflow` template.

## Setup

    python -m venv .venv
    . .venv/bin/activate          # Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    cp .env.example .env          # then set OPENAI_API_KEY

## Run

    python main.py

## Structure

- `app/state.py` — the graph `State`
- `app/tools.py` — tools the workflow can call
- `app/graph.py` — nodes, edges, routing, and the checkpointer
- `main.py` — entry point

See the devkit `agent-development` skills for how to extend this (routing, persistence,
human-in-the-loop, testing).

# {{PROJECT_NAME}}

A LangChain tool-calling agent scaffolded from the devkit `langchain-agent` template.

## Setup

    python -m venv .venv
    . .venv/bin/activate          # Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    cp .env.example .env          # then set OPENAI_API_KEY

## Run

    python agent.py

## Next steps

- Replace the `add` tool with your own (give each a precise docstring).
- Adjust the system prompt for the assistant's role.
- If you need branching, loops, or memory across turns, move to the `langgraph-workflow`
  template.

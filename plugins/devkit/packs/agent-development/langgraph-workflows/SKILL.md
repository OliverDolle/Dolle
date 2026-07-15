---
name: langgraph-workflows
description: Practical guide to building stateful, multi-step workflows and agents with LangGraph (StateGraph, nodes, conditional edges, persistence/checkpointers, human-in-the-loop, streaming, subgraphs, prebuilt ReAct agent). Load when the user needs branching, loops, memory, or approval steps. For a plain tool-using agent, the langchain-agents skill may be enough.
---

# Building Workflows with LangGraph

LangGraph models an application as a **graph of steps over shared state**. You define the
state, write nodes that read and update it, and wire nodes together with edges — including
conditional edges (routing) and cycles (loops). This is the right tool when control flow
matters: branching, retries, loops with exit conditions, persistence, and human approval.

LangGraph builds on LangChain — its models and `@tool`s (see the `langchain-agents` skill) plug
straight in.

> Confirm package names/signatures against the installed version before finalizing.

## Install

```bash
pip install -U langgraph langchain-openai
export OPENAI_API_KEY=sk-...
```

## Core concepts

- **State** — a `TypedDict` (or Pydantic model). Each node returns a partial update that is
  merged in. Fields can define a **reducer** to control how updates combine (e.g. append to a
  list instead of overwriting).
- **Node** — a function `(state) -> partial_state`. The unit of work.
- **Edge** — a transition. Normal edges are unconditional; **conditional edges** pick the next
  node from a routing function. `START` and `END` are the entry/exit sentinels.
- **Compile** — `builder.compile(...)` produces a runnable graph you `invoke`/`stream`.

## 1. Minimal graph

```python
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI

class State(TypedDict):
    # add_messages is a reducer: new messages are appended, not overwritten
    messages: Annotated[list, add_messages]

llm = ChatOpenAI(model="gpt-4o-mini")

def chatbot(state: State) -> dict:
    return {"messages": [llm.invoke(state["messages"])]}

builder = StateGraph(State)
builder.add_node("chatbot", chatbot)
builder.add_edge(START, "chatbot")
builder.add_edge("chatbot", END)
graph = builder.compile()

out = graph.invoke({"messages": [{"role": "user", "content": "Hi!"}]})
print(out["messages"][-1].content)
```

## 2. Conditional edges (routing and loops)

A routing function inspects state and returns the name of the next node (or `END`). Returning a
node you already visited creates a **loop** — the basis of agent/retry patterns.

```python
def route(state: State) -> str:
    last = state["messages"][-1]
    # e.g. if the model asked for a tool, go run tools; otherwise finish
    return "tools" if getattr(last, "tool_calls", None) else END

builder.add_conditional_edges("chatbot", route, {"tools": "tools", END: END})
builder.add_edge("tools", "chatbot")  # loop back after running tools
```

## 3. Prebuilt ReAct agent (the fast path)

For a standard tool-using agent, don't hand-build the loop — use the prebuilt:

```python
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """Return the current weather for a city."""
    return f"Sunny in {city}."

agent = create_react_agent(ChatOpenAI(model="gpt-4o-mini"), tools=[get_weather])
res = agent.invoke({"messages": [{"role": "user", "content": "Weather in Paris?"}]})
print(res["messages"][-1].content)
```

## 4. Persistence (memory across turns)

Attach a **checkpointer** at compile time and pass a `thread_id`. The graph then remembers
state per thread, so a conversation resumes across calls.

```python
from langgraph.checkpoint.memory import MemorySaver  # use a DB saver in production

graph = builder.compile(checkpointer=MemorySaver())
cfg = {"configurable": {"thread_id": "user-42"}}

graph.invoke({"messages": [{"role": "user", "content": "My name is Sam."}]}, cfg)
graph.invoke({"messages": [{"role": "user", "content": "What's my name?"}]}, cfg)  # -> Sam
```

## 5. Human-in-the-loop

Pause the graph for approval, inspect/edit state, then resume:

```python
from langgraph.types import interrupt, Command

def approve(state: State) -> dict:
    decision = interrupt({"question": "Proceed with the write?", "draft": state.get("draft")})
    return {"approved": decision == "yes"}

# ... running ...
graph.invoke(inputs, cfg)                 # runs until the interrupt, then pauses
graph.invoke(Command(resume="yes"), cfg)  # resume with the human's answer
```

Requires a checkpointer so the paused state is saved.

## 6. Streaming

```python
for event in graph.stream({"messages": [{"role": "user", "content": "Hi"}]}, cfg):
    print(event)  # per-node updates as they happen
```

Use `stream_mode="values"` for full state snapshots, `"updates"` for per-node deltas, or
`"messages"` for token-level streaming.

## 7. Subgraphs

A compiled graph can be a node inside another graph. Build and test complex stages in
isolation, then compose them — keep the parent graph readable.

## Best practices

- **Design the graph before coding**: list the state fields, the nodes, and every edge
  (including the routing conditions and exit conditions of any loop).
- Keep state minimal and typed; use reducers (like `add_messages`) instead of manual merging.
- Give every loop a hard exit condition (max iterations / a done flag) so it can't spin.
- Use a persistent checkpointer (SQLite/Postgres) in production, not `MemorySaver`.
- Make nodes pure and idempotent where possible; push side effects into clearly named nodes.
- Visualize the graph (`graph.get_graph().draw_mermaid()`) to sanity-check control flow.

## Choosing between the skills

- Plain tool-using assistant, no branching/persistence → `langchain-agents` may suffice.
- Branching, cycles, retries, memory across turns, approval steps, or multiple cooperating
  agents → LangGraph (this skill). Start from `create_react_agent` and grow into a custom
  `StateGraph` when the prebuilt no longer fits. See also `combining-langchain-and-langgraph`.

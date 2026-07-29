# Combining LangChain + LangGraph

LangChain and LangGraph are complementary, not competing. In real agent development you almost
always use both.

## Mental model

- **LangChain = the components.** Chat models, `@tool`s, prompts, output parsers, retrievers,
  embeddings. These are the reusable building blocks.
- **LangGraph = the orchestration.** A state machine over shared state: nodes, edges,
  conditional routing, loops, persistence, human-in-the-loop. This is the control flow.

You build components with LangChain and wire them into a workflow with LangGraph. A LangGraph
node is usually just "call a LangChain runnable and write the result into state."

## Which do I reach for?

| Need | Use |
| --- | --- |
| A single prompt → model → parse | LangChain LCEL chain (`prompt \| llm \| parser`) |
| A standard tool-using agent | LangGraph `create_react_agent(model, tools)` — with LangChain model + `@tool`s |
| Branching, loops, retries, memory across turns, approval steps, multiple agents | LangGraph custom `StateGraph` |

Rule of thumb: if control flow is trivial, a LangChain chain is enough. The moment you need
*decisions* about what runs next, move the orchestration into LangGraph — but keep building the
work itself from LangChain components.

## Combined end-to-end example

A graph whose node calls a LangChain model bound to LangChain tools, with persistence:

```python
# pip install -U langchain langchain-openai langgraph
from typing import Annotated, TypedDict
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

# --- LangChain components ---
@tool
def search_docs(query: str) -> str:
    """Search internal docs for a query and return the best matching snippet."""
    return f"(pretend result for: {query})"

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
llm_with_tools = llm.bind_tools([search_docs])   # LangChain binds tools to the model

# --- LangGraph orchestration ---
class State(TypedDict):
    messages: Annotated[list, add_messages]

def call_model(state: State) -> dict:
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

def route(state: State) -> str:
    last = state["messages"][-1]
    return "tools" if getattr(last, "tool_calls", None) else END

builder = StateGraph(State)
builder.add_node("model", call_model)
builder.add_node("tools", ToolNode([search_docs]))   # prebuilt node runs the tool calls
builder.add_edge(START, "model")
builder.add_conditional_edges("model", route, {"tools": "tools", END: END})
builder.add_edge("tools", "model")                    # loop back with tool results

graph = builder.compile(checkpointer=MemorySaver())
cfg = {"configurable": {"thread_id": "demo"}}
out = graph.invoke({"messages": [{"role": "user", "content": "Search docs for 'billing'."}]}, cfg)
print(out["messages"][-1].content)
```

Notice the split: every LangChain piece (`@tool`, `ChatOpenAI`, `bind_tools`) is a *component*;
every LangGraph piece (`StateGraph`, `add_conditional_edges`, `ToolNode`, checkpointer) is
*orchestration*.

## Common integration patterns

- **RAG:** a LangChain retriever inside a LangGraph node, feeding retrieved context into the
  model node.
- **Structured output node:** a node that calls `llm.with_structured_output(Schema)` and writes
  the typed object into state for later nodes to branch on.
- **Prebuilt agent as a subgraph:** drop `create_react_agent(...)` in as a node of a larger
  workflow.
- **Tool execution:** use LangGraph's `ToolNode` to run LangChain `@tool` calls rather than
  hand-writing the dispatch.

## Pitfalls

- **Version skew:** keep `langchain*` and `langgraph` versions compatible; mismatches surface as
  import or message-format errors (see `troubleshooting.md`).
- **Message format drift:** stick to LangChain message objects / the `messages` state with
  `add_messages`; don't mix raw dicts and message objects inconsistently.
- **No memory:** a graph only remembers across turns if you compile with a checkpointer and pass
  a `thread_id` — LangChain's own memory helpers won't do this for a graph.
- **Reaching for the wrong tool:** don't hand-build a tool loop as a chain; that's exactly what
  LangGraph exists for.

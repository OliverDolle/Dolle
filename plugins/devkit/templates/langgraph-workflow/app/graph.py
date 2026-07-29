"""Builds the LangGraph workflow for {{PROJECT_NAME}}."""
import os

from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.prebuilt import ToolNode

from .state import State
from .tools import TOOLS

MODEL = os.environ.get("MODEL", "{{MODEL}}")


def build_graph(checkpointer=None):
    """Construct and compile the workflow graph.

    Swap ``MemorySaver()`` for a durable checkpointer (SQLite/Postgres) in production.
    """
    llm = ChatOpenAI(model=MODEL, temperature=0).bind_tools(TOOLS)

    def call_model(state: State) -> dict:
        return {"messages": [llm.invoke(state["messages"])]}

    def route(state: State) -> str:
        last = state["messages"][-1]
        # If the model requested tools, run them; otherwise the workflow is done.
        return "tools" if getattr(last, "tool_calls", None) else END

    builder = StateGraph(State)
    builder.add_node("model", call_model)
    builder.add_node("tools", ToolNode(TOOLS))
    builder.add_edge(START, "model")
    builder.add_conditional_edges("model", route, {"tools": "tools", END: END})
    builder.add_edge("tools", "model")  # loop back with tool results

    return builder.compile(checkpointer=checkpointer or MemorySaver())

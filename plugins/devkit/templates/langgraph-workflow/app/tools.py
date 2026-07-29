"""Tools the workflow can call. Replace these with your own."""
from langchain_core.tools import tool


@tool
def echo(text: str) -> str:
    """Return the input text unchanged. Replace with a real tool."""
    return text


# Register every tool the graph should be able to call.
TOOLS = [echo]

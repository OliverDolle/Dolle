"""Graph state for {{PROJECT_NAME}}.

Edit the fields to carry whatever your workflow needs. `messages` uses the `add_messages`
reducer so new messages are appended rather than overwriting the list.
"""
from typing import Annotated, TypedDict

from langgraph.graph.message import add_messages


class State(TypedDict):
    # Conversation / model I/O. Keep this if the workflow talks to an LLM.
    messages: Annotated[list, add_messages]

    # TODO: add the fields your workflow carries, e.g.
    # query: str
    # result: dict
    # iterations: int

"""A LangChain tool-calling agent for {{PROJECT_NAME}}.

Adapt the tools and prompt to your task. Keep the ``agent_scratchpad`` placeholder — the
tool-call loop writes into it.
"""
import os

from dotenv import load_dotenv
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI


@tool
def add(a: int, b: int) -> int:
    """Add two integers. Replace with a real tool."""
    return a + b


TOOLS = [add]


def build_agent() -> AgentExecutor:
    llm = ChatOpenAI(model=os.environ.get("MODEL", "{{MODEL}}"), temperature=0)
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "You are a helpful assistant. Use tools when they help."),
            MessagesPlaceholder("chat_history", optional=True),
            ("human", "{input}"),
            MessagesPlaceholder("agent_scratchpad"),
        ]
    )
    agent = create_tool_calling_agent(llm, TOOLS, prompt)
    return AgentExecutor(agent=agent, tools=TOOLS, verbose=True)


def main() -> None:
    load_dotenv()
    executor = build_agent()
    result = executor.invoke({"input": "What is 19 + 23?"})
    print(result["output"])


if __name__ == "__main__":
    main()

# Building Agents with LangChain

LangChain gives you the building blocks — models, prompts, tools, output parsers — and a
self-contained agent runner. Use it when you want a tool-using assistant without hand-managing
the loop. When you need branching, cycles, persistence, or human-in-the-loop, graduate to
**LangGraph** (see `langgraph-workflows.md`); the two compose — LangChain models and
tools drop straight into a LangGraph agent.

> Versions move fast. Confirm the current package names and signatures against the installed
> version before finalizing code, and state your assumptions.

## Install

```bash
pip install -U langchain langchain-core langchain-openai
# swap the provider package for your model: langchain-anthropic, langchain-google-genai, ...
export OPENAI_API_KEY=sk-...
```

## The building blocks

- **Chat model** — the LLM (`ChatOpenAI`, `ChatAnthropic`, ...). The unit of I/O is a list of
  messages.
- **Prompt** — a `ChatPromptTemplate` with a system message, history placeholder, and input.
- **Tool** — a Python function the model may call, described by a docstring + typed signature.
- **Chain (LCEL)** — components piped together with `|` into a runnable.
- **Agent** — a model bound to tools that decides which tools to call, in a loop, until done.

## 1. A model call and an LCEL chain

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a concise assistant."),
    ("human", "{question}"),
])

chain = prompt | llm | StrOutputParser()
print(chain.invoke({"question": "What is LangChain in one sentence?"}))
```

## 2. Define tools

```python
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """Return the current weather for a city. Use for any weather question."""
    return f"It's 21C and sunny in {city}."

@tool
def add(a: int, b: int) -> int:
    """Add two integers."""
    return a + b
```

Good tools have a precise docstring (the model reads it to decide *when* to call), typed
arguments, and a narrow, deterministic job. Keep side effects obvious and validated.

## 3. A tool-calling agent

```python
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

tools = [get_weather, add]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Use tools when they help."),
    MessagesPlaceholder("chat_history", optional=True),
    ("human", "{input}"),
    MessagesPlaceholder("agent_scratchpad"),  # required: holds the tool-call loop
])

agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = executor.invoke({"input": "What's the weather in Oslo, and what is 19 + 23?"})
print(result["output"])
```

## 4. Structured output

When you need typed data rather than prose, bind a schema to the model:

```python
from pydantic import BaseModel, Field

class Ticket(BaseModel):
    title: str = Field(description="Short summary")
    priority: str = Field(description="low | medium | high")

structured = llm.with_structured_output(Ticket)
ticket = structured.invoke("The login page 500s for all users right now.")
print(ticket.priority)  # -> "high"
```

## 5. Conversation memory

The portable pattern is `RunnableWithMessageHistory`, keyed by a session id:

```python
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

store = {}
def get_history(session_id: str):
    return store.setdefault(session_id, ChatMessageHistory())

with_memory = RunnableWithMessageHistory(
    chain, get_history, input_messages_key="question", history_messages_key="chat_history"
)
with_memory.invoke({"question": "Hi, I'm Sam."}, config={"configurable": {"session_id": "s1"}})
```

For durable, cross-run memory you usually want LangGraph checkpointers instead.

## 6. Streaming

```python
for chunk in llm.stream("Write a haiku about tools."):
    print(chunk.content, end="", flush=True)
```

Agents also support `.stream(...)` to surface intermediate tool calls as they happen.

## Best practices

- Pin versions; LangChain APIs change between minor releases.
- Set `temperature=0` for tool-routing reliability; raise it only for creative text.
- Keep secrets in env vars, never in code.
- Validate and sandbox tool side effects — the model *will* call tools you expose.
- Log intermediate steps in development (`verbose=True` / callbacks) and turn them off in prod.
- Cache and rate-limit external calls made inside tools.

## When to move to LangGraph

Reach for LangGraph (`langgraph-workflows.md`) once you need: explicit branching, retries,
loops with exit conditions, persistence across turns, human approval steps, or multiple
cooperating agents. LangGraph's `create_react_agent` is the recommended production successor to
`AgentExecutor` and accepts the same LangChain models and `@tool`s.

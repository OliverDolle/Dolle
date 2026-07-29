# Agent Development — Troubleshooting

A **living log** of errors seen during development and how they were fixed. When you hit an
error:

1. Search this file for the symptom.
2. If it's here, apply the fix.
3. If it's not — once you've resolved it — **add an entry** using the template at the bottom.
   Include the library versions, because many of these are version-specific.

> Confirm fixes against the version you actually have installed; APIs shift between releases.

## LangChain

### Import errors after the 0.3 package split
**Symptom:** `ImportError` / `ModuleNotFoundError` for things that used to live in `langchain`
(e.g. chat models, community integrations).
**Cause:** LangChain was split into `langchain-core`, provider packages (`langchain-openai`,
`langchain-anthropic`, …), and `langchain-community`.
**Fix:** Install the provider package and import from it (`from langchain_openai import
ChatOpenAI`). Move community integrations to `langchain_community`. Pin compatible versions.

### Agent errors about `agent_scratchpad`
**Symptom:** `KeyError`/formatting error when running an `AgentExecutor`, or the agent never
uses tools correctly.
**Cause:** The prompt is missing the `agent_scratchpad` slot the tool-call loop writes into.
**Fix:** Include `MessagesPlaceholder("agent_scratchpad")` in the prompt (and
`MessagesPlaceholder("chat_history")` if you use history).

### Model ignores the tools
**Symptom:** The model answers from memory instead of calling a tool.
**Cause:** Vague tool docstrings, `temperature` too high, or a model that doesn't support tool
calling.
**Fix:** Write precise tool docstrings describing *when* to use each; set `temperature=0` for
routing; use a tool-calling-capable model; verify tools are actually bound
(`llm.bind_tools([...])`).

### Structured-output validation failures
**Symptom:** Pydantic validation errors from `with_structured_output`.
**Cause:** Schema too strict, ambiguous field descriptions, or a weak model.
**Fix:** Add clear `Field(description=...)`, loosen/normalize types, and validate + retry on
failure. Prefer a model with strong structured-output support.

## LangGraph

### Memory doesn't persist across turns
**Symptom:** The graph forgets earlier turns.
**Cause:** Compiled without a checkpointer, or no/changing `thread_id`.
**Fix:** `builder.compile(checkpointer=...)` and pass a stable
`{"configurable": {"thread_id": "..."}}` on every call.

### `GraphRecursionError` / hitting the recursion limit
**Symptom:** The graph errors after many steps.
**Cause:** A loop with no exit condition (or a genuinely long run).
**Fix:** Add a hard exit condition (done flag / max-iteration counter) to the routing function.
Only raise `recursion_limit` if the length is legitimately expected.

### State gets overwritten instead of accumulating
**Symptom:** `messages` (or a list field) keeps only the latest value.
**Cause:** No reducer on the field, so each update replaces it.
**Fix:** Annotate with a reducer, e.g. `messages: Annotated[list, add_messages]`, or a custom
reducer for other accumulating fields.

### `interrupt()` doesn't pause
**Symptom:** Human-in-the-loop `interrupt` runs straight through.
**Cause:** No checkpointer — there's nowhere to save the paused state.
**Fix:** Compile with a checkpointer and resume with `Command(resume=...)` and the same
`thread_id`.

### Async vs. sync mismatch
**Symptom:** Coroutine warnings, "event loop" errors, or tools/nodes never awaited.
**Cause:** Mixing `invoke`/`stream` with `ainvoke`/`astream`, or sync tools in an async graph.
**Fix:** Pick one mode end-to-end. Use the async variants throughout if any node is async.

## Cross-cutting

### Auth / API key errors
**Symptom:** 401/403 or "api key not found".
**Fix:** Set the provider env var (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, …) in the actual run
environment; don't hardcode keys.

### Rate limits / timeouts
**Symptom:** 429s, slow or hanging calls.
**Fix:** Add retries with backoff, set request timeouts, cache repeated calls, and batch where
possible.

### Version incompatibility between langchain and langgraph
**Symptom:** Import errors or message-format errors when combining the two.
**Fix:** Upgrade them together to compatible versions; check each package's release notes.

---

## Entry template (copy this to add a new one)

```markdown
### <short symptom>
**Symptom:** <what you saw>
**Cause:** <root cause>
**Fix:** <the fix that worked>
**Versions:** <langchain / langgraph / provider versions>  ·  **Date:** <YYYY-MM-DD>
```

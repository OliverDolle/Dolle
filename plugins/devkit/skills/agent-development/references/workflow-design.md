# Workflow Design

How to *construct* a workflow, not just how to call the API. Design the graph on paper before
writing code — most workflow bugs are control-flow bugs that a five-minute sketch prevents.

## 1. Choose the shape

Match the structure to the actual control flow — don't over-build:

| The task is… | Build… |
| --- | --- |
| One prompt, deterministic | A LangChain LCEL chain (no graph) |
| A tool-using assistant, standard loop | LangGraph `create_react_agent` |
| Branching / retries / loops / memory / approvals / multiple agents | A custom LangGraph `StateGraph` |

Start at the simplest row that works and move down only when a requirement forces it.

## 2. Model the state

- **Keep it minimal and typed.** State is the contract between nodes; only put in it what a
  later node actually reads.
- **Use reducers** for accumulating fields (`Annotated[list, add_messages]` for messages, or a
  custom reducer) instead of manually merging.
- **Separate durable from scratch.** Distinguish values that must persist (conversation,
  decisions) from transient scratch a node computes and discards.

## 3. Decide node granularity

- **One responsibility per node.** A node either calls a model, runs tools, transforms data, or
  makes a decision — not all four.
- **Pure where possible.** Given the same state, a node should produce the same update. Push
  side effects (writes, external calls) into clearly named nodes so they're easy to find, mock,
  and retry.
- **Name nodes for what they do** (`classify`, `retrieve`, `draft`, `review`), not how
  (`node1`).

## 4. Design the control flow explicitly

- Draw every edge, including conditional ones and their routing conditions.
- **Every loop needs a hard exit condition** — a max-iteration counter or an explicit done
  flag — so it cannot spin. LangGraph's recursion limit is a backstop, not a design.
- Prefer a small number of well-named routes over deeply nested conditions inside one node.

## 5. Build in reliability

- **Retries with backoff** on flaky external calls; cap the attempts.
- **Timeouts** on model/tool/network calls so a stuck call can't hang the graph.
- **Fallbacks:** a cheaper/simpler path when the primary fails (fallback model, cached answer,
  graceful degradation).
- **Idempotency** for side-effecting nodes, so a retry doesn't double-charge / double-write.
- **Error routing:** on failure, route to an error-handling node that records the failure and
  decides retry vs. abort vs. escalate — don't let exceptions bubble uncontrolled.

## 6. Human-in-the-loop

Add an approval step (`interrupt`) before irreversible or high-stakes actions (sending money,
emailing customers, deleting data). Requires a checkpointer. Keep the pause point close to the
risky action so the human reviews the actual thing being approved.

## 7. Persistence

- Dev: `MemorySaver`. Production: a durable checkpointer (SQLite/Postgres).
- Thread the conversation/session through a stable `thread_id`.
- Decide what belongs in checkpointed state vs. an external store (large blobs, PII).

## 8. Observability

- Enable tracing (e.g. LangSmith) in development to see each node's inputs/outputs and latency.
- Log node I/O at boundaries; stream intermediate updates to the UI so long runs feel alive.
- Emit the node path taken — invaluable when debugging a routing decision after the fact.

## 9. Testing

- **Unit-test nodes as functions:** feed a state, assert the partial update. Pure nodes make
  this trivial.
- **Test routing logic** directly: given a state, does the router return the expected next
  node?
- **Test the compiled graph** with fixtures/mocked models for representative paths (happy path,
  each branch, the loop's exit).
- **Evaluate end-to-end** on a small dataset for quality regressions, separately from
  correctness tests.

## 10. Deployment

- Keep the app stateless between requests; all memory lives in the checkpointer.
- Mind concurrency: shared clients, connection pools, and per-thread isolation.
- Secrets from the environment; never in code or state.
- Respect provider rate limits (queue/backoff) and cache where safe.

## Checklist

- [ ] Shape matches the control flow (didn't over-build).
- [ ] State is minimal, typed, and uses reducers for accumulation.
- [ ] Each node has one responsibility; side effects are isolated and idempotent.
- [ ] Every loop has a hard exit condition.
- [ ] Retries, timeouts, and a failure route exist for external calls.
- [ ] Human approval guards irreversible actions (if any).
- [ ] Durable checkpointer + stable thread id in production.
- [ ] Tracing/logging on; node path observable.
- [ ] Nodes, routing, and the compiled graph are tested.

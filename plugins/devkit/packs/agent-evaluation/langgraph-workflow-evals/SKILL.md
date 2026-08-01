---
name: langgraph-workflow-evals
description: >-
  Use when evaluating a LangChain/LangGraph agent or workflow specifically — turning a
  StateGraph into an eval harness: datasets from traces, final-response vs. single-step
  (node) vs. trajectory evaluators, LangSmith evaluate/aevaluate, pytest integration,
  reproducible runs via checkpointing, and gating graph changes. Applies the
  agent-evaluation discipline to LangGraph. Triggers: 'evaluate my langgraph', 'langsmith
  eval', 'trajectory evaluation', 'evaluate agent workflow', 'test my agent graph',
  'node-level eval'.
---

# LangGraph Workflow Evals — evaluating a StateGraph

This is the **LangGraph-specific** application of `agent-evaluation`. That section owns the
general discipline — *what* to measure (`eval-foundations`), scoring open-ended output
(`llm-as-judge`), the CI merge gate (`eval-harness-ci`), and tracing (`tracing-observability`).
This skill maps those onto a concrete `StateGraph`: how to turn the graph you built with
`agent-development`'s `langgraph-workflows` into an eval harness. Read the siblings for the
principles; read this for the LangGraph wiring.

> LangSmith / `agentevals` APIs move fast and the env date (2026) is past the model's
> cutoff. Treat signatures below as the shape, and **verify against current docs** before
> pinning versions.

## §0 What's different about evaluating a graph

A graph has *internal structure*, so a right final answer can still hide a broken run.

- **The path matters, not just the answer.** A graph can reach a correct output via the wrong
  node, an extra tool call, a redundant loop, or a skipped guardrail — and that path bites you
  on the next input. Evaluate *how* it got there (trajectory), not only *what* came out.
- **State is the unit, not a string.** Nodes read/merge a typed `State` (`langgraph-workflows`
  §0). Inputs and reference outputs are the state slices in/out, so you can score any node's
  contribution, not just the final message.
- **Control flow is enumerable.** Because nodes and edges are declared, valid transitions are a
  finite set — you can assert the agent only ever took a legal edge and flag any jump to an
  invalid state as a hard failure. This makes LangGraph one of the *easiest* architectures to
  eval rigorously.
- **Loops and interrupts are first-class.** Runaway cycles and never-hit `interrupt`s are
  LangGraph-specific failure modes; capture step count and termination (`eval-foundations` §1).

## §1 Three eval targets

Measure at the level where the failure lives — most graphs need all three (this is
`eval-foundations` §1, instantiated for a graph).

| Target | What you score | LangGraph handle |
| --- | --- | --- |
| **Final response** (task) | The last message / final `State` vs. a reference or rubric | `graph.invoke(...)` output |
| **Single step / node** (component) | One node's output in isolation — router pick, retriever, parser, a specific prompt node | Call the node fn, or read that node's update from `stream(mode="updates")` |
| **Full trajectory** (agent path) | The ordered sequence of nodes + tool calls, arguments, loops, termination | The span tree / thread history from a checkpointed run |

- **Node-level evals are your fast, cheap debuggers.** A router that misclassifies is a
  component failure; testing it directly pinpoints the culprit without running the whole graph.
- **Trajectory evals need the trace.** Capture the span tree via `tracing-observability` §1, or
  extract it from the checkpointer thread (§3). No trace → no trajectory eval.

## §2 Building datasets from traces & runs

The dataset *is* the eval (`eval-foundations` §2). For a graph, harvest it from what the graph
already produced.

- **Seed from LangSmith traces / production threads.** Every logged run is a candidate example:
  its input state, the final output, and the intermediate node/tool steps. Curate real runs
  (especially thumbs-down, escalations, and loops that ran long) into examples rather than
  inventing inputs.
- **An example = inputs (+ reference).** In LangSmith, `client.create_dataset(...)` then
  `client.create_examples(dataset_id=..., examples=[{"inputs": {...}, "outputs": {...}}, ...])`.
  `inputs` is the graph's input state; `outputs` is the reference (final answer *and/or* an
  expected trajectory). Many open-ended cases carry a rubric instead of a gold `outputs`.
- **Store the reference trajectory too** when you care about path — the ordered list of expected
  node names / tool calls, so §3's trajectory match has something to compare against.
- **Version it, keep it out of the prompt.** Same contamination rule as `eval-foundations` §2 —
  eval inputs must never leak into few-shot examples.
- **Grow from failures.** Add a regression example for every bug before shipping the fix
  (`eval-foundations` §3, `eval-harness-ci` §3).

## §3 Evaluators

Layer cheap deterministic checks under model-graded ones (`eval-harness-ci` §1).

**Structured / deterministic assertions (prefer first).** On the final `State`: schema/`is-json`
on structured outputs, must-contain, numeric match, cost/latency, `≤ N` steps, `interrupt`
was hit. On transitions: assert every edge taken was a legal one (§0).

**LangSmith custom evaluators.** A function
`def eval(inputs, outputs, reference_outputs) -> dict` returning `{"key": ..., "score": ...}`;
pass a list to `evaluate`. Off-the-shelf evaluators exist for common criteria — check current
availability. LLM-graded criteria (faithfulness, tone, goal completion) follow the
sibling `llm-as-judge` skill wholesale: binary per criterion, structured output + reason,
`temperature=0`, validated against humans, version-pinned judge.

**Trajectory evaluators via `agentevals`** (verify package + names against current docs):

| Evaluator | Import (approx.) | Use for |
| --- | --- | --- |
| `create_trajectory_match_evaluator(trajectory_match_mode=...)` | `agentevals.trajectory.match` | Compare tool-call trajectory to a reference — modes `strict` / `unordered` / `subset` / `superset`; `tool_args_match_mode` = `exact`/`ignore`/`subset`/`superset` |
| `create_trajectory_llm_as_judge(...)` | `agentevals.trajectory.llm` | Judge the trajectory with an LLM, no reference needed (built-in accuracy prompts) |
| `graph_trajectory_strict_match(...)` | `agentevals.graph_trajectory.strict` | Exact match of the **node-step** sequence for a graph |
| `create_graph_trajectory_llm_as_judge(...)` | `agentevals.graph_trajectory.llm` | LLM judgment over the graph's node trajectory |
| `extract_langgraph_trajectory_from_thread(...)` | `agentevals.graph_trajectory.utils` | Pull the trajectory (turns, interrupts) straight from a checkpointer thread |

Use `strict`/`unordered` matching where the correct tool sequence is known; use the graph
trajectory judge for open-ended paths. Async variants (`create_async_*`) mirror each.

## §4 Running evals

- **`evaluate` / `aevaluate`.** `client.evaluate(target, data="my-dataset", evaluators=[...],
  experiment_prefix="...", max_concurrency=N)`. `target(inputs) -> dict` wraps your compiled
  graph (`graph.invoke(inputs)`), shaping the output the evaluators expect. Use `aevaluate` for
  async targets / parallelism; `num_repetitions` re-runs to measure non-determinism.
- **`pytest` integration** (for evals that live in your test suite): decorate a test with
  `@pytest.mark.langsmith` and log via `t.log_inputs()` / `t.log_outputs()` /
  `t.log_reference_outputs()`; the run creates/updates a dataset and an experiment. Vitest/Jest
  equivalents exist for TS. This is the LangGraph on-ramp to `eval-harness-ci`'s DeepEval-style
  "evals as pytest cases" pattern.
- **Reproducibility — the LangGraph-specific bits:**
  - **Pin the model** and run at `temperature=0` so a red result means *your graph change*, not
    sampling noise (`eval-harness-ci` §0).
  - **Fix the checkpointer.** For deterministic replay use an isolated in-memory checkpointer
    (`MemorySaver`) with a fresh `thread_id` per case so runs don't leak state into each other;
    don't eval against a shared production checkpointer.
  - **Stub non-deterministic tools.** Mock external tool calls (search, DB, APIs) to fixed
    fixtures so the trajectory is stable and the eval doesn't hit live services.
  - **Pin the graph version** you're testing and record it, so results are attributable.

## §5 Gating graph changes

A graph edit — new node, changed edge, swapped prompt, model bump — is a code change; gate it
(`eval-harness-ci`).

- **Gate on a pass-rate threshold**, not all-green (`eval-harness-ci` §2): e.g. `≥ 90%` and
  **zero** failures on `critical`-tagged assertions (safety, valid transition, must-`interrupt`).
- **Regress on trajectory *and* response.** A change can keep the final answer identical while
  quietly rerouting or adding tool calls — assert both, or a path regression ships silently.
- **Freeze a regression case per bug** before merging the fix (§2). Any input that once looped
  or mis-routed can never silently break again.
- **Re-run on model/graph drift.** Bumping the node model or a provider's silent update is still
  a change — re-run the full suite (`eval-harness-ci` §3).
- **Run as a required PR check**, with API keys via CI secrets/OIDC (`cloud-infrastructure`).

## §6 Checklist

- [ ] Evaluating final response, key node outputs, *and* trajectory — not just the final answer.
- [ ] Asserting every edge/transition taken was legal; step count + termination checked.
- [ ] Dataset seeded from real traces/threads, versioned, isolated from prompts (no contamination).
- [ ] Reference trajectory stored for cases where the path matters.
- [ ] Deterministic asserts first (schema, ≤N steps, interrupt hit); judge only for the rest.
- [ ] Trajectory scored with `agentevals` (match mode or graph-trajectory judge), names verified.
- [ ] LLM-graded criteria follow `llm-as-judge` (binary, structured, temp 0, validated, pinned).
- [ ] Runs via `evaluate`/`aevaluate` or `@pytest.mark.langsmith`; target wraps the compiled graph.
- [ ] Reproducible: pinned model, temp 0, isolated `MemorySaver` + fresh `thread_id`, stubbed tools.
- [ ] Gated in CI on a pass-rate threshold; regression on trajectory **and** response.
- [ ] A regression case frozen for every fixed graph bug; suite re-run on model/graph bumps.

## Related

- `agent-evaluation:eval-foundations` — what to measure; task/component/trajectory levels this instantiates.
- `agent-evaluation:llm-as-judge` — how to design/validate the LLM graders used for node + trajectory judging.
- `agent-evaluation:eval-harness-ci` — the pass-rate merge gate this ties graph changes into.
- `agent-evaluation:tracing-observability` — capture the span tree these trajectory evals score.
- `devkit:agent-development` (`langgraph-workflows`) — build the StateGraph, checkpointer, and tools you're evaluating here.

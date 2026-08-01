---
name: tracing-observability
description: >-
  Use when tracing or monitoring an LLM agent in development or production — the
  OpenTelemetry GenAI semantic conventions (invoke_agent → chat → execute_tool span tree,
  gen_ai.* attributes), online evaluation, and production-drift monitoring. Triggers: 'trace
  my agent', 'llm observability', 'opentelemetry genai', 'otel llm', 'monitor agent in
  production', 'production drift'.
---

# Tracing & Observability — seeing inside the agent

An LLM agent is a black box until you trace it. A raw request/response log tells you *what*
came out; a trace tells you *why* — every model call, every tool call, the arguments,
tokens, latency, and where a multi-step run went wrong. Tracing is the substrate for
everything else: trajectory evals (`eval-foundations` §1) need the span tree, online eval
(§3) runs graders over live traces, and drift monitoring (§4) alerts on them. This skill
covers instrumenting and monitoring; scoring is `llm-as-judge` and `eval-harness-ci`.

## §0 Why trace

- **Debugging.** Reproduce a bad run by reading its actual steps instead of guessing —
  which tool, which arguments, what the model saw.
- **Trajectory evals.** Tool-selection/argument/path metrics are computed *from* traces;
  no trace, no trajectory eval.
- **Cost & latency attribution.** Tokens and duration per step show which call is slow or
  expensive — you can't optimize an aggregate.
- **Production truth.** Traces are the raw material for online eval and drift alerts — the
  online half of `eval-foundations` §4.

## §1 OpenTelemetry GenAI conventions

Instrument with **OpenTelemetry (OTel)** and its **GenAI semantic conventions** — a shared
vocabulary for LLM spans so any compatible backend (Phoenix, Langfuse, Jaeger, Grafana,
vendor APMs) understands your data. Prefer this to a proprietary SDK: it's portable and
avoids lock-in. Note the GenAI semconv is at **"Development" stability** — attribute names
still shift, so pin the semconv version you target and expect updates (verify current
before standardizing).

An agent run is a **span tree** keyed by `gen_ai.operation.name`:

```
invoke_agent            (the overall agent run)
├─ chat                 (an LLM call — the model decides to use a tool)
├─ execute_tool         (the tool runs; args + result captured)
├─ chat                 (LLM call with the tool result)
└─ execute_tool         (another tool, if needed)
```

Common operation names: `invoke_agent`, `create_agent`, `chat`, `embeddings`,
`execute_tool`. Key `gen_ai.*` attributes:

| Attribute | On | Meaning |
| --- | --- | --- |
| `gen_ai.operation.name` | all | `chat` / `execute_tool` / `invoke_agent` … |
| `gen_ai.system` (a.k.a. provider) | chat | Which provider/backend served the call |
| `gen_ai.request.model` | chat | Model requested |
| `gen_ai.response.model` | chat | Model that actually served it |
| `gen_ai.usage.input_tokens` / `output_tokens` | chat | Token counts (→ cost) |
| `gen_ai.response.finish_reasons` | chat | Why generation stopped |
| `gen_ai.tool.name` | execute_tool | Tool invoked |
| `gen_ai.input.messages` / `gen_ai.output.messages` | chat | Prompt/response content (opt-in) |
| `gen_ai.system_instructions` | chat | System prompt (opt-in) |

Names above reflect the convention as of early 2026; check the spec for the version you pin.

## §2 What to capture per span

- **Identity:** operation name, model requested + served, provider, and versions (prompt
  template version, agent/graph version) so you can slice metrics by what changed.
- **Tokens & cost:** input/output tokens per `chat` span; derive cost. Aggregate to
  per-run.
- **Latency:** span duration; for agents, total run time *and* per-step so a slow tool is
  visible.
- **Tool detail:** `gen_ai.tool.name`, the arguments, and the result/error — the heart of
  trajectory debugging and tool-call assertions.
- **Outcome:** finish reason, error status, and whether the run completed the goal.
- **Correlation IDs:** session/conversation/user/request id to stitch multi-turn
  conversations and join to product analytics.
- **Content, carefully:** prompts/responses are gold for debugging but hold PII. Make
  content capture **opt-in**, redact/mask sensitive fields, and respect retention/privacy
  policy — don't log raw user data into a trace store by default.

## §3 Online eval on live traffic

Online eval = run graders over sampled production traces, continuously, with no reference
answer (the online half of `eval-foundations` §4).

- **Sample, don't grade everything.** Score a percentage (or all of a targeted slice) —
  judge cost and latency scale with volume.
- **Run graders async, off the response path.** Evaluate from the trace *after* the
  response is sent; a grader must never add latency to the user's request.
- **Reuse the offline graders.** The same `llm-rubric` criteria and deterministic checks
  from `eval-harness-ci` run here — build once, run offline (gate) and online (monitor).
- **Cheap heuristics + user signals too.** Refusal rate, output length/format validity,
  thumbs-down, escalation-to-human, retries — free signals that flag trouble without a judge
  call.
- **Feed failures back.** Low-scoring live traces become new eval cases (`eval-foundations`
  §3) — this is the loop that keeps the offline dataset matching reality.

## §4 Drift monitoring & alerting

Offline green does not mean healthy forever — inputs shift, providers update models, and
retrieval corpora go stale. Watch for it.

- **Track metrics over time**, sliced by prompt/model/agent version and by input slice:
  online quality score, refusal/error rate, tokens/cost per run, p50/p95 latency, tool-error
  rate, retrieval metrics for RAG.
- **Alert on deltas, not absolutes.** Page when a metric moves sharply vs. its recent
  baseline (quality-score drop, cost/latency spike, refusal-rate jump) — a sudden change is
  the signal.
- **Watch input drift.** If the distribution of incoming requests diverges from your eval
  dataset, the offline gate is testing the wrong thing — trigger a dataset refresh
  (`eval-foundations` §3).
- **Correlate with deploys.** Overlay model/prompt version changes on the metric timeline so
  a regression points straight at the change that caused it.
- **Close the loop:** drift alert → inspect traces → add regression cases → the
  `eval-harness-ci` gate now catches that failure before the next release.

## §5 Checklist

- [ ] Instrumented with OpenTelemetry using the GenAI semantic conventions (semconv version pinned).
- [ ] Emitting the `invoke_agent → chat → execute_tool` span tree, not just request/response.
- [ ] Capturing model+version, tokens, latency, finish reason, and tool name+args+result per span.
- [ ] Correlation IDs (session/user/request) to stitch multi-turn runs.
- [ ] Content capture is opt-in, redacted, and retention-limited (PII-aware).
- [ ] Online eval samples live traffic, runs graders async off the response path.
- [ ] Reusing offline graders online; also tracking cheap heuristics + user signals.
- [ ] Dashboards track quality/cost/latency/error over time, sliced by version and input slice.
- [ ] Alerts fire on deltas vs. baseline, correlated with deploys.
- [ ] Low-scoring live traces feed back into the eval dataset and regression suite.

## Related

- `agent-evaluation:eval-foundations` — trajectory metrics + offline/online split these traces feed.
- `agent-evaluation:llm-as-judge` — the graders run online over sampled traffic.
- `agent-evaluation:eval-harness-ci` — offline gate; drift findings become regression cases.
- `devkit:cloud-infrastructure` — its observability guidance; export traces to your backend.
- `devkit:agent-development` — the agents/workflows you're instrumenting.

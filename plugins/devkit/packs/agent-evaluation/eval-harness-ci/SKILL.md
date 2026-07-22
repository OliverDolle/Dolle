---
name: eval-harness-ci
description: >-
  Use when proving an LLM agent/prompt works or stopping it from regressing — BEFORE merging
  a prompt/model/graph change. Covers eval datasets, deterministic vs LLM-as-judge
  assertions, pass-rate thresholds as a CI merge gate, and regression suites with
  promptfoo/DeepEval/Ragas. Triggers: 'eval my agent', 'llm-as-judge', 'regression test
  prompts', 'promptfoo', 'gate deploy on eval', 'is my agent good enough'.
---

# Eval Harness in CI — the merge gate

A prompt, model, or graph change is a code change, and it needs the same protection: an
automated suite that runs on every PR and **blocks the merge** if quality drops. Without a
gate, LLM changes ship on vibes and regress silently. This skill turns the dataset from
`eval-foundations` and the graders from `llm-as-judge` into a required CI check. It ships a
runnable scaffold (§5).

## §0 The gate mental model

Treat evals exactly like tests, adjusted for non-determinism:

- **Dataset = test suite.** Each case is an input plus assertions (from `eval-foundations`).
- **The gate is a *pass-rate threshold*, not all-green.** LLM outputs are noisy; demanding
  100% forces brittle assertions and gets the whole gate disabled. Require, e.g., "≥ 90% of
  cases pass and zero critical-tag failures" (§2).
- **Fast and deterministic enough to trust.** Pin model versions and `temperature=0` for
  gate runs so a red build means *your change* regressed, not sampling noise.
- **Runs on every relevant PR.** Trigger when prompts, agent code, model config, or the
  dataset change. Make it a **required status check** so it can't be merged around.

## §1 Deterministic vs model-graded assertions (mix them)

A good suite layers both — cheap checks catch the obvious, judges catch the subjective.

| Deterministic (prefer these) | Model-graded (`llm-rubric`, when needed) |
| --- | --- |
| `contains` / `not-contains`, `regex` | Faithfulness to sources |
| `is-json` / schema / `is-valid-openai-function-call` | Tone, helpfulness, coherence |
| `equals`, exact/numeric match to reference | Semantic equivalence to a reference answer |
| `cost` / `latency` thresholds | Nuanced instruction-following |
| `similar` (embedding distance) | Anything with no checkable rule |

- **Deterministic first.** They're free, instant, and reproducible; every one you write is
  a judge call you don't pay for. See `llm-as-judge` §0.
- **`llm-rubric` for the rest.** Follow `llm-as-judge` — binary per-criterion, structured
  output, `temperature=0`, validated against humans. Pin the judge model version.
- **Assert tool calls for agents.** Check the tool name and arguments, not just the final
  text (trajectory eval, `eval-foundations` §1). Capture the trace to do this
  (`tracing-observability`).
- **Weight and tag.** Not all assertions are equal; tag safety/format ones **critical** so
  one failure fails the build regardless of overall pass rate (§2).

## §2 Pass-rate thresholds as a merge gate

The threshold is the gate's contract. Make it explicit and layered:

1. **Overall pass rate ≥ X%** (start ~90%, tune per app and per-slice from real pass rates —
   don't invent a number the suite has never hit).
2. **Zero failures on `critical`-tagged assertions** (safety, PII, valid-format,
   must-refuse). A hard fail independent of the aggregate.
3. **No regression vs. baseline** (optional, stronger): fail if the pass rate drops more
   than a small tolerance below `main`'s last score, catching a slow slide that stays above
   the absolute bar.

Report **per-slice** (`eval-foundations` §2) so a 92% aggregate can't hide one persona at
40%. Emit machine-readable output (JSON) and compute the pass rate in the workflow — the
scaffold's `eval.yml` (§5) does exactly this and exits non-zero below the bar.

## §3 Regression suites

The gate's long-term value is *anti-regression*.

- **Every fixed bug becomes a case.** Freeze the failing input + corrected expectation into
  the dataset *before* merging the fix (`eval-foundations` §3). That input can never
  silently break again.
- **Keep goldens under version control** and review changes to them in PRs — a diff that
  loosens an assertion should be as visible as a code change.
- **Watch for prompt/model drift.** Re-run the full suite when you bump the model version or
  a provider ships a silent update; "we changed nothing" plus a new model is still a change.
- **Keep it fast.** Cache/curate (`eval-foundations` §3) so the suite runs in a minute or
  two; a slow suite gets marked "flaky" and bypassed. Split an expensive full suite (nightly)
  from a fast PR subset if needed.

## §4 Tooling landscape (current as of early 2026 — verify current)

Fast-moving space; treat this as principles + a current tool list, and re-check names,
maintenance status, and any vendor/ownership/pricing claims before standardizing.

| Tool | Shape | Good for |
| --- | --- | --- |
| **promptfoo** | Open-source CLI + config-as-YAML, official GitHub Action | Prompt/model eval + CI gating; the scaffold uses it |
| **DeepEval** | Open-source, pytest-style Python assertions + metrics | Teams who want evals as `pytest` cases in an existing test suite |
| **Ragas** | Open-source, RAG-focused metrics library | Faithfulness / context precision+recall (`eval-foundations` §5) |
| **Phoenix (Arize)** | Open-source tracing + eval | Trace-linked eval, bridges to `tracing-observability` |
| **Hosted platforms** | e.g. LangSmith, Braintrust, Langfuse | Dataset management, human review UI, online eval, dashboards |

- **The two-tool pattern:** an **open-source harness in CI** (promptfoo/DeepEval) for the
  merge gate — no vendor lock, runs offline — **plus** a **platform** for dataset curation,
  human labeling, and online/production eval. Most mature setups run both; the CI harness
  gates, the platform observes.
- **Framework-agnostic beats framework-coupled.** Prefer a harness that evals your app via
  its API/CLI over one welded to a specific agent framework — your eval dataset outlives any
  one framework choice.
- **Don't over-adopt.** Start with one harness + your existing CI; add a platform when
  manual dataset/label management becomes the bottleneck.

## §5 The bundled scaffold

This section ships `templates/promptfoo-eval-ci/` — copy it in to get a working gate fast.
It contains:

- `promptfooconfig.yaml` — a `{{PROVIDER}}` provider and a prompt, with **both** a
  deterministic assertion (`is-json` / `contains`) and an `llm-rubric` (model-graded)
  assertion, so §1's mix is wired from the start.
- `tests.yaml` — a small seed dataset (vars + per-case asserts) to grow via
  `eval-foundations` §3.
- `.github/workflows/eval.yml` — runs the eval on PRs, writes JSON, and **fails below a
  pass-rate threshold** (§2), with least-privilege `permissions:`.

See the template's `TEMPLATE.md` for the placeholder list and after-copying steps. Adapt
the provider, prompt, and seed cases to your app, wire the API key as a repo secret
(`cloud-infrastructure` covers secrets), and set the check as required.

## §6 Checklist

- [ ] Eval runs on every PR that touches prompts/agent code/model config/dataset.
- [ ] Set as a **required** status check (can't merge around it).
- [ ] Gate is a pass-rate threshold, not all-green; number derived from real pass rates.
- [ ] `critical`-tagged assertions (safety/format) hard-fail independent of the aggregate.
- [ ] Mixes deterministic asserts (first) with `llm-rubric` (only where needed).
- [ ] Agent suites assert tool name + arguments, not just final text.
- [ ] Model + judge versions pinned; gate runs at `temperature=0`.
- [ ] Every fixed bug added as a versioned regression case before the fix merged.
- [ ] Per-slice reporting so an aggregate can't hide a broken category.
- [ ] Suite runs fast enough (~1–2 min) to actually be run; heavy suite split to nightly.
- [ ] API keys via CI secrets/OIDC, not committed.

## Related

- `agent-evaluation:eval-foundations` — the dataset and levels this gate runs on.
- `agent-evaluation:llm-as-judge` — designing/validating the `llm-rubric` assertions.
- `agent-evaluation:tracing-observability` — capture traces for tool-call assertions; online eval.
- `devkit:cloud-infrastructure` — run the harness as a pipeline stage; OIDC + secrets for API keys.
- Scaffold: `templates/promptfoo-eval-ci/` (`/scaffold` to copy it in).

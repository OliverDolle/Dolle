---
description: "Use when proving an LLM agent/prompt works or stopping it from regressing — BEFORE merging a prompt/model/graph change or shipping an agent. Four skills: eval-foundations (what to measure, datasets), llm-as-judge (model-graded scoring + bias), eval-harness-ci (assertions + pass-rate merge gate), tracing-observability (OpenTelemetry GenAI, drift). Triggers: 'evaluate my agent', 'llm-as-judge', 'regression test prompts', 'promptfoo', 'gate deploy on eval', 'trace my agent'."
argument-hint: "[optional task, or a skill: eval-foundations | llm-as-judge | eval-harness-ci | tracing-observability]"
---

**An LLM-agent evaluation / regression-gating / tracing task matches this command — load it
before wiring evals; do not improvise a metric from memory.** First read the section index at
`${CLAUDE_PLUGIN_ROOT}/packs/agent-evaluation/INDEX.md`, then read the skill(s) the task needs:

- `eval-foundations/SKILL.md` — what to measure (task/component/trajectory), building & growing
  an eval dataset, offline vs. online, RAG metrics. Read this first.
- `llm-as-judge/SKILL.md` — scoring open-ended output with a model: rubrics, pairwise vs.
  pointwise, the bias catalog + mitigations, validating the judge.
- `eval-harness-ci/SKILL.md` — deterministic vs. model-graded assertions, pass-rate thresholds as
  a CI merge gate, regression suites, tooling (promptfoo/DeepEval/Ragas).
- `tracing-observability/SKILL.md` — OpenTelemetry GenAI conventions, online eval, drift.

This is the quality-gate complement to `/agent-development` (which builds agents). A runnable
promptfoo-in-CI starter lives at `${CLAUDE_PLUGIN_ROOT}/packs/agent-evaluation/templates/promptfoo-eval-ci/`
— copy it via `/scaffold`.

Then:
1. Confirm in one line which skill(s) you loaded.
2. Summarize the method in 3–5 bullets.
3. If the user provided a task below, start on it.

User task / focus (optional): $ARGUMENTS

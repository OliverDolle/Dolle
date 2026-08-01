---
name: agent-evaluation
description: Section index for measuring whether an LLM app/agent is good and keeping it from regressing — what to measure, LLM-as-judge scoring, an eval harness wired as a CI merge gate, and tracing/observability. The quality-gate complement to agent-development (which builds agents). Ships a runnable promptfoo eval-in-CI scaffold.
---

# Agent Evaluation — section index

This section is about **measuring** LLM apps and agents: deciding what "good" means,
scoring open-ended output, gating merges on an eval suite, and watching production for
drift. It is the quality-gate **complement** to `agent-development` — that section
**builds** the agent; this one **proves** it works and stops it regressing.

LLM systems are non-deterministic, so "it worked when I tried it" is not evidence. The
discipline here mirrors testing in normal software, adapted for outputs that are not
byte-exact: define a dataset, score it with a mix of deterministic and model-graded
checks, set a threshold, and fail CI below it.

Read the skill relevant to the task rather than all of them. Most teams start with
`eval-foundations`, then `eval-harness-ci`.

## Skills in this section

| Skill | Read it for | File |
| --- | --- | --- |
| **eval-foundations** | Decide *what* to measure — task vs component vs trajectory evals, building/growing an eval dataset, offline vs online, RAG metrics | `eval-foundations/SKILL.md` |
| **llm-as-judge** | Score open-ended output with a model — rubric/assertion design, pairwise vs pointwise, the judge-bias catalog + mitigations, validating the judge | `llm-as-judge/SKILL.md` |
| **eval-harness-ci** | Wire evals as a merge gate — deterministic vs model-graded asserts, pass-rate thresholds, regression suites, tooling landscape | `eval-harness-ci/SKILL.md` |
| **tracing-observability** | Trace and monitor agents — OpenTelemetry GenAI conventions, online eval on live traffic, production-drift monitoring | `tracing-observability/SKILL.md` |
| **langgraph-workflow-evals** | Evaluate a LangChain/LangGraph agent *specifically* — datasets from traces; final-response vs single-step (node) vs trajectory evaluators; LangSmith `evaluate`/`aevaluate` + `pytest`; reproducible runs via checkpointing; gating graph changes | `langgraph-workflow-evals/SKILL.md` |

Paths are relative to this section folder
(`${CLAUDE_PLUGIN_ROOT}/packs/agent-evaluation/`).

## Bundled scaffold

This section ships a runnable starter under `templates/promptfoo-eval-ci/` — a
`promptfooconfig.yaml` with both a deterministic and an `llm-rubric` assertion, a seed
`tests.yaml`, and a GitHub Actions workflow that runs the eval on every PR and fails
below a pass-rate threshold. Copy it in and adapt the placeholders (see the template's
`TEMPLATE.md`); `eval-harness-ci` §5 explains it.

## How to use this section

- **Starting to evaluate an agent:** read `eval-foundations` first (what to measure),
  then `eval-harness-ci` (how to gate on it).
- **Scoring open-ended output:** read `llm-as-judge` before writing a grader.
- **Debugging or monitoring in production:** read `tracing-observability`.
- **Building the agent in the first place:** that's `agent-development` — build there,
  measure here. Design the eval dataset alongside the agent, not after.

## How it relates to other sections

- **`agent-development` (build vs. measure):** that section constructs agents and
  workflows (LangChain/LangGraph); this section measures their quality. Its
  `workflow-design` "observability/testing" guidance hands off directly to here.
- **`cloud-infrastructure` (eval-as-CI-gate):** the harness in `eval-harness-ci` is a
  pipeline stage. Run it as a required check on PRs and, for high-stakes changes, a
  pre-deploy gate — the same OIDC/secrets and stage patterns that section covers apply
  to the model API keys the eval needs.

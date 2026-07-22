---
name: eval-foundations
description: >-
  Use when deciding what to measure for an LLM app/agent — task vs component vs trajectory
  evals, building and growing an eval dataset from real failures, offline vs online
  evaluation, and RAG metrics (faithfulness, context precision/recall). Read first when
  starting to evaluate an agent. Triggers: 'evaluate my agent', 'eval dataset', 'what to
  measure', 'trajectory eval', 'rag metrics', 'offline vs online eval'.
---

# Eval Foundations — deciding what to measure

You cannot improve what you cannot measure, and for an LLM system "I tried it and it
looked fine" is not measurement. This skill is about picking the **right signal** before
you write a single grader: what "good" means for *this* app, at what level to measure it,
and how to assemble a dataset you can trust. Scoring open-ended output is `llm-as-judge`;
wiring the result as a merge gate is `eval-harness-ci`.

## §0 Decide what "good" means

Start from the product, not the model. Write down, per use case, the failure modes that
actually hurt — then each becomes a measurable criterion.

- **Name the failures first.** Wrong answer, hallucinated fact, ignored instruction,
  wrong tool, unsafe output, wrong format, too slow, too expensive. You evaluate *these*,
  not a vague "quality" score.
- **Prefer few sharp criteria over one blurry one.** A single 1–10 "goodness" score hides
  regressions. Score each named failure mode separately (see `llm-as-judge` §1 on
  disaggregation).
- **Separate correctness from cost/latency.** Track them as distinct metrics; a change
  that's 2% more accurate and 3× slower is a business decision, not an eval pass.
- **Make each criterion checkable.** If you can't describe how to tell pass from fail,
  you can't build the grader — sharpen the criterion until you can.

| Criterion type | Example | How you'll grade it |
| --- | --- | --- |
| Deterministic | Output is valid JSON; contains the order ID; ≤ 200 tokens | Code assertion |
| Reference-based | Matches a known-good answer (exact, or semantic similarity) | Code / embedding |
| Subjective | Helpful, on-tone, faithful to sources | LLM-as-judge or human |

## §1 Levels: task vs component vs trajectory

Measure at the level where the failure lives. Most systems need all three.

- **Task (end-to-end):** given an input, is the *final* output correct/acceptable? The
  outermost gate and the one that maps to user value. Necessary but coarse — it tells you
  *that* something broke, not *where*.
- **Component (unit):** score one step in isolation — the retriever, a single prompt, a
  router/classifier, an output parser. Fast, cheap, pinpoints the culprit. Build these for
  every step you'd want to debug independently.
- **Trajectory (agent path):** for multi-step/tool-using agents, judge *how* it got there,
  not just the answer. An agent can reach a right answer via a wrong, expensive, or unsafe
  path — and that path will bite you on the next input.

Trajectory sub-metrics worth capturing:

| Metric | Question it answers |
| --- | --- |
| **Tool-selection correctness** | Did it call the right tool for the step? |
| **Tool-argument correctness** | Were the arguments well-formed and right? |
| **Path efficiency** | Extra/looping/redundant steps vs. an ideal path? |
| **Goal completion** | Did the trajectory actually accomplish the user's goal? |
| **Termination** | Did it stop when done (no runaway loops / early give-up)? |

Trajectory evals need the trace — capture the span tree (`tracing-observability` §1) so
you can score tool calls after the fact.

## §2 Building an eval dataset

The dataset *is* the eval. A mediocre metric on a representative dataset beats a perfect
metric on three cherry-picked examples.

- **Start tiny and real.** 15–50 hand-picked cases that cover the main happy paths and the
  failure modes from §0 beat a synthetic thousand. You'll grow it (§3).
- **Each case = input + criteria.** Some cases have a reference answer; many don't — pair
  those with a rubric instead of a gold string. Don't force a gold answer where the task is
  genuinely open-ended.
- **Cover the distribution, then the edges.** Typical inputs, then empty/malformed input,
  adversarial/prompt-injection, out-of-scope ("I can't help with that" is a correct
  answer), long inputs, and multilingual if relevant.
- **Stratify.** Tag cases by feature/difficulty/persona so a pass rate can't hide a
  category that's fully broken. Report per-slice, not just the aggregate.
- **Version it and keep it out of the prompt.** Store as YAML/JSONL in the repo, reviewed
  like code. Never let eval inputs leak into few-shot examples or fine-tuning data — that's
  train/test contamination and inflates every score.

## §3 Growing it from real failures

Datasets should grow from what actually breaks, not from your imagination. Mine production.

- **Harvest low scores and complaints.** Thumbs-down, escalations to a human, support
  tickets, refunds, and any trace your online eval (§4) or judge flagged as low-quality —
  each is a candidate case.
- **Add a regression case for every bug.** When you fix a bad output, freeze that input
  (and the corrected expectation) into the dataset *before* shipping the fix. That's how the
  regression suite in `eval-harness-ci` §3 stays honest.
- **Cluster, don't just append.** Group similar failures; one representative case per
  cluster keeps the set fast. If a whole cluster is systematic, it's a design fix, not just
  a test case.
- **Curate ruthlessly.** Remove duplicates and stale cases; a dataset you can run in a
  minute gets run every PR, a 30-minute one gets skipped.

## §4 Offline vs online evaluation

Two different jobs — do both.

| | **Offline** | **Online** |
| --- | --- | --- |
| **When** | Pre-merge / pre-deploy, on a fixed dataset | Continuously, on live production traffic |
| **Purpose** | Gate releases; catch regressions before users do | Watch real-world quality and drift |
| **Ground truth** | References + rubrics you curated | Usually no reference — judge/heuristics/user signals |
| **Speed need** | Fast enough to run every PR | Sampled + async so it never blocks the response |
| **Lives in** | `eval-harness-ci` | `tracing-observability` §3 |

Offline proves a change is good *before* it ships; online tells you whether reality still
matches the offline dataset. When online quality drops but offline still passes, your
dataset has drifted from production — feed the new failures back via §3.

## §5 RAG metrics

Retrieval-augmented systems fail in two distinct places — retrieval and generation — so
measure them separately or you'll tune the wrong half.

**Retrieval quality** (did we fetch the right context?):

| Metric | Meaning | Fails when |
| --- | --- | --- |
| **Context recall** | Did retrieval fetch *all* the context needed to answer? | Missing chunks → answer can't be complete |
| **Context precision** | Are the retrieved chunks relevant / ranked high? | Noise/irrelevant chunks crowd the window |

**Generation quality** (given the context, was the answer good?):

| Metric | Meaning | Fails when |
| --- | --- | --- |
| **Faithfulness / groundedness** | Are claims supported by the retrieved context? | Model invents facts not in context (hallucination) |
| **Answer relevance** | Does the answer address the actual question? | On-topic but doesn't answer what was asked |

Diagnostic pattern: low faithfulness with good context → a **generation** problem (prompt,
model, "answer only from context" instruction). Good faithfulness but wrong/incomplete
answers → a **retrieval** problem (chunking, embeddings, top-k, reranking). Tools like
Ragas compute these; see `eval-harness-ci` §4.

## §6 Checklist

- [ ] Named the concrete failure modes for this app — not a single blurry "quality".
- [ ] Chose the level(s): task always; component for debuggable steps; trajectory for agents.
- [ ] For agents, capturing tool-selection/argument/path metrics from traces.
- [ ] Built a small, real, versioned dataset with inputs + criteria (refs *or* rubrics).
- [ ] Covered edges: empty/malformed, adversarial, out-of-scope, long, multilingual.
- [ ] Stratified by slice and report per-slice, not just aggregate.
- [ ] A pipeline exists to grow the set from production failures + a regression case per bug.
- [ ] Eval inputs are isolated from prompts/few-shot/training data (no contamination).
- [ ] Doing both offline (gate) and online (drift) evaluation.
- [ ] For RAG, measuring retrieval and generation metrics separately.

## Related

- `agent-evaluation:llm-as-judge` — how to score the subjective criteria named in §0.
- `agent-evaluation:eval-harness-ci` — turn this dataset into a merge gate.
- `agent-evaluation:tracing-observability` — capture the traces trajectory + online eval need.
- `devkit:agent-development` (`workflow-design`) — build the agent this section measures.

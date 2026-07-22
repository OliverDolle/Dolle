---
name: llm-as-judge
description: >-
  Use when scoring open-ended LLM output with another model — rubric/assertion design,
  pairwise vs pointwise, the judge-bias catalog (position, verbosity, self-preference) and
  mitigations, and validating the judge against human labels. Triggers: 'llm-as-judge',
  'llm as a judge', 'model-graded eval', 'judge bias', 'pairwise comparison', 'grade with a
  model'.
---

# LLM-as-Judge — scoring open-ended output with a model

When output is open-ended (summaries, chat, explanations) there's no gold string to
diff against, so you use a second LLM to grade it against criteria. Powerful, but a judge
is *itself* a non-deterministic model with biases — an unvalidated judge is a random
number generator wearing a lab coat. Treat the judge as a component that must itself be
evaluated (§4). This skill designs and validates the judge; deciding *what* to score is
`eval-foundations`, and wiring the score into CI is `eval-harness-ci`.

## §0 When to use a judge (vs deterministic checks)

Reach for the judge **last**, not first. Every check you can make deterministic is
cheaper, faster, and perfectly reproducible.

| Use a deterministic check when… | Use a judge when… |
| --- | --- |
| Format/schema (JSON, regex, length) | Tone, helpfulness, coherence |
| Must-contain / must-not-contain strings | Faithfulness to a source (no gold answer) |
| Exact or numeric match to a reference | Semantic equivalence to a reference |
| Code compiles / tests pass | Following a nuanced instruction |

Rules of thumb:

- **Layer checks.** Run the cheap deterministic asserts first; only spend judge tokens on
  what genuinely needs judgment. (`eval-harness-ci` §1 covers the mix.)
- **A judge costs money and latency and can be wrong.** Budget for it, and never let an
  unvalidated judge gate a release.
- **Use a capable model as judge.** Grading is often harder than answering; a judge weaker
  than the model under test tends to be noisy.

## §1 Rubric & assertion design

The rubric is a prompt, and prompt quality decides judge quality.

- **Be specific and give a scale definition.** "Rate helpfulness 1–5" is useless — define
  what each level *means*, or prefer a **binary pass/fail per criterion** (far more reliable
  and reproducible than a 1–10 scale).
- **Disaggregate.** One judge call per criterion (faithful? on-tone? answers the question?)
  beats one call for a blended score — you learn *which* thing failed, and each call is an
  easier judgment. This mirrors `eval-foundations` §0.
- **Assertion-style rubrics.** Turn the rubric into a checklist of yes/no assertions the
  judge answers ("Does the answer cite at least one source? Does it avoid claims not in the
  context?"). Easy to grade, easy to audit.
- **Provide the context the judge needs and no more.** For faithfulness, give it the source
  passages; for instruction-following, give it the instruction. Don't leak the "expected"
  answer if you want an independent judgment of an open-ended task.
- **Force structured output + a reason.** Require JSON like
  `{"pass": true, "reason": "..."}`. The reason makes disagreements debuggable and lets you
  spot when the judge misread the task. Ask for the reasoning *before* the verdict.
- **Few-shot the boundaries.** One or two example gradings near the pass/fail line calibrate
  the judge far better than more prose.

## §2 Pairwise vs pointwise

Two grading modes, different jobs.

| | **Pointwise (absolute)** | **Pairwise (comparative)** |
| --- | --- | --- |
| **Asks** | Score/grade this one output | Which of A vs B is better? |
| **Good for** | CI gates, regression thresholds, per-criterion pass/fail | Choosing between two prompts/models; preference data |
| **Reliability** | Absolute scores drift/cluster; stabilize with binary criteria | More reliable — relative judgments are easier for a model |
| **Cost** | 1 call/output | 1 call/pair (grows with candidates) |
| **Main hazard** | Score inflation, vague scale | **Position bias** (§3) — must control order |

Practical split: use **pairwise** when picking between candidates (A/B a prompt change) —
it detects small differences a fixed threshold misses. Use **pointwise binary** for the CI
gate, because a merge gate needs an absolute "is this acceptable" verdict, not "better than
last time". For pairwise, allow an explicit **tie**; forcing a winner manufactures noise.

## §3 Bias catalog + mitigations

Judges have systematic biases. Know them, measure them, mitigate them.

| Bias | The judge tends to… | Mitigation |
| --- | --- | --- |
| **Position/order** | Favor the first (or a fixed) option in pairwise | **Swap order and average** — run A,B and B,A; count a win only if consistent, else tie |
| **Verbosity/length** | Rate longer answers higher regardless of quality | Add "ignore length; penalize padding" to rubric; length-normalize; check score-vs-length correlation |
| **Self-preference** | Prefer text from its own model family | Use a different model family as judge, or an ensemble; validate against humans (§4) |
| **Self-consistency** | Give different scores on re-runs | Judge at `temperature=0`; sample N and take majority for critical gates |
| **Sycophancy / leading** | Agree with hints in the prompt ("this is the correct answer, grade it") | Keep the prompt neutral; don't tell the judge which answer you expect |
| **Formatting/authority** | Reward confident tone, markdown, citations that may be fake | Add explicit "confident tone is not correctness; verify citations against context" |

Two mitigations do most of the work: **order-swap-and-average** for pairwise, and
**calibration** — anchor the judge with few-shot exemplars at the decision boundary and
pin `temperature=0` so the same output grades the same way twice.

## §4 Validate the judge against human labels

An unvalidated judge is an opinion. Validation makes it a measurement.

1. **Human-label a sample.** Have a person (ideally the product owner) grade 30–100 cases
   with the *same* rubric the judge uses. This is your ground truth.
2. **Measure agreement.** Compare judge vs human — accuracy/precision/recall for binary
   criteria, or a rank correlation for scores. Report it; a judge you can't quote an
   agreement number for isn't validated.
3. **Set a bar and iterate the rubric, not the outcome.** If agreement is low, inspect the
   disagreements (the judge's `reason` field earns its keep here), sharpen the rubric, and
   re-measure. Tune the judge to match humans — never tune it to give the answer you wanted.
4. **Re-validate on drift.** Re-check agreement when you change the judge model/version, the
   rubric, or the task. Pin the judge model version so a silent upstream update doesn't move
   your gate.
5. **Keep the human in the loop for high stakes.** For safety/legal/medical criteria, the
   judge triages and a human confirms the flagged cases — don't let a model be the sole
   arbiter of a high-consequence gate.

## §5 Checklist

- [ ] Used deterministic checks for everything that can be deterministic; judge only for the rest.
- [ ] Rubric is specific with binary per-criterion pass/fail (or a defined scale).
- [ ] Disaggregated — one judgment per criterion, not a blended score.
- [ ] Judge returns structured output with a reason, reasoning before verdict, at `temperature=0`.
- [ ] Judge model is capable, a different family from the model under test, and version-pinned.
- [ ] Pairwise runs are order-swapped and averaged; ties allowed.
- [ ] Chose pointwise-binary for the CI gate, pairwise for candidate selection.
- [ ] Checked for length bias (score-vs-length correlation).
- [ ] Validated against a human-labeled sample and can quote an agreement number.
- [ ] Plan to re-validate on judge/model/rubric change; human confirms high-stakes flags.

## Related

- `agent-evaluation:eval-foundations` — decide which criteria need a judge at all.
- `agent-evaluation:eval-harness-ci` — the `llm-rubric` assertion and mixing judge + deterministic checks.
- `agent-evaluation:tracing-observability` — run the judge online over sampled production traffic.

# Decision models vs LLMs — and the gate between them

A **decision model** (also called a System One model: TypeSafe's Jev, the open vLLM Semantic Router
Decision models, vLLM's DiffusionGemma structured reads) takes input plus typed questions and
returns a probability for every allowed answer. It generates no text. A **traditional LLM** (Claude
Opus, Qwen, GPT) generates text: reasons, explanations, plans, open answers.

They are not competitors. A decision model is the fast first pass, and an LLM is the slow second
opinion. A **confidence gate** decides which items need that second opinion. This reference covers
choosing between them, setting the gates, and what to forward when a gate does not pass.

## §0 Which one, in one table

| | Decision model | LLM (Opus, Qwen, ...) |
| --- | --- | --- |
| Output | One of *your* labels, with a probability per label | Free text; JSON only if you constrain it |
| Typical latency | Milliseconds on a GPU, about 1 s per question on a CPU | Seconds |
| Cost | Tiny: open models run locally; hosted Jev bills about $0.04 per 1M input tokens and nothing for output | Input and output billed; thinking tokens count |
| Thresholding | Built in: a confidence on every answer | Self-reported confidence is weak; you build your own |
| Explanation | None, just numbers | Yes |
| Good at | Routing, triage, moderation, yes/no policy checks, picking an agent's next tool | Ambiguity, multi-step reasoning, arithmetic, dates, writing, anything unbounded |
| Weak at | Numbers, dates, adversarial or very long input, anything outside its labels | Throughput, cost at volume, consistent labels without a schema |

**Decision rule:**

- Use a **decision model** when the answer is one of a known, small set *and* any of these hold:
  volume is high, latency matters, you need a threshold, or the data must stay local.
- Use an **LLM** when the answer is open-ended, needs reasons or text, needs several steps or tool
  use, or depends on arithmetic, dates or long context.
- Use **both (the cascade, §2)** when the answer is bounded but the stakes make "unsure" expensive.
  That is most real triage: mail, documents, tickets, moderation, agent tool routing.

Never ask an LLM to "classify into one of these labels" at volume without first asking whether a
decision model would do. Never ask a decision model to explain itself.

## §1 Confidence gates

A gate turns a probability into an action. Use three actions, not two:

| Action | Meaning | Typical threshold |
| --- | --- | --- |
| **ACT** | Proceed automatically | confidence ≥ 0.85-0.9 |
| **REVIEW** | Get a second opinion, or confirm with the user | 0.5 to the ACT threshold |
| **HUMAN** | Stop. A person decides | < 0.5, or any error |

- **Confidence per type.** For a choice, `(p_max - 1/n) / (1 - 1/n)` (1 = all probability on one
  label, 0 = an even spread); hosted Jev and the Decision models return it as `confidence`. For a
  yes/no, `|2p - 1|`, where p near 0.5 means unsure. For a score (ordered levels), the confidence
  is low by design even when the answer is fine, so **do not gate on scores by default**.
- **Gate only the questions that drive an action** (a `gate:` list). An informative question,
  such as priority or language, should not block a confident routing decision.
- **The request takes the worst action** across its gated questions.
- **Thresholds are per action, not per model.** A refund deserves a higher ACT bar than a
  newsletter label. Set them per template or route.
- **Calibrate on labelled data, not intuition.** Measure the error rate *among ACT decisions* and
  the share of traffic that reaches ACT (coverage). Raise the threshold until that error rate is
  acceptable, and accept the coverage you get (§5).

## §2 The cascade: decision model, then gate, then LLM

```text
input -> decision model -> gate -> ACT ----------------------------> do it
                                -> REVIEW -> LLM second opinion -+-> agrees:    one step up (REVIEW -> ACT)
                                                                 +-> disagrees: HUMAN, both opinions attached
                                -> HUMAN -> (optionally an LLM summary for the person) -> person
```

- **Agreement buys one step, never two.** REVIEW with agreement becomes ACT. HUMAN with agreement
  becomes at most REVIEW. Two systems agreeing is evidence, not proof.
- **Disagreement goes to a person** with both answers and the LLM's rationale. Do not let either
  model silently overrule the other.
- **An LLM answer of low confidence does not promote.**
- **Escalation failures fall back to the gate's verdict** (refusal, timeout, rate limit). Record the
  failure; never treat it as agreement.
- **Log everything:** first answers and probabilities, the gate result, what was forwarded, the
  LLM's answer, and the final action. That log is your next eval set.

## §3 What to forward (the forwarded piece)

Forward a **small, self-contained packet**, not the whole conversation or pipeline state:

1. **The task in one line** (the template or route description).
2. **The input**, fenced as data (`<input>...</input>`), and told to ignore instructions inside it.
   Uploaded documents are a prompt-injection surface.
3. **Only the questions whose gate did not pass**, each with its instruction, the **allowed answers
   with their descriptions**, and the decision model's top answers, probabilities and confidence.
   Show the probabilities as context, and state that disagreeing is expected when the input
   supports it. Otherwise the LLM anchors on the first answer.
4. **A constrained answer format.** A JSON schema with an `enum` of the allowed labels per
   question, plus `confidence` (high, medium or low) and a one or two sentence `rationale` citing
   evidence. Constrain with structured outputs, not by asking nicely.

Do **not** forward:

- the questions that already passed (it wastes tokens and invites second-guessing)
- other users' data
- secrets
- any input larger than needed (cut it, and say that it was cut)

**Privacy.** Forwarding to a hosted LLM sends the document out of your network. For sensitive
data, use a local LLM (a vLLM or Ollama server through an OpenAI-compatible API), or forward only
the excerpt that matters.

## §4 Picking the second-opinion model

- **Claude (hosted).** Use `claude-opus-5-5` by default. Thinking is always on, so set `effort`
  explicitly: `medium` suits triage, and you should raise it only if measurement shows a gain.
  Constrain the answer with `output_config.format` (JSON schema), check `stop_reason` for
  `refusal` before reading the answer, and opt into server-side `fallbacks: "default"`. Model IDs,
  prices and SDK shapes change between releases, so **load the `claude-api` skill before writing
  this code**.
- **Local (private, free per call).** Use an instruction model served by vLLM or Ollama, with
  `response_format: json_schema`. On a 24 GB GPU, a 27B model at 4-bit (about 15 GB) or a 9B model
  at BF16 (about 18 GB) fits, but not next to a large GPU decision model. Run the decision model on
  the CPU or keep the two on separate machines.
- **The second opinion should be stronger than the first, and different.** The value of agreement
  comes from independence. A second small classifier adds little.
- **Cost.** At a 10-20% escalation rate, the LLM bill is a fraction of what an LLM-only pipeline
  would cost. Measure the real escalation rate before choosing the model.

## §5 Measure it

Build a labelled set (`eval-foundations.md`) with real items and the right answer per question. Then
track:

| Metric | Why |
| --- | --- |
| Accuracy per question | Which questions the decision model can own |
| Coverage | Share of items that end in ACT; the automation you actually get |
| Error rate among ACT | The number that must stay under your risk limit |
| Escalation rate and LLM agreement rate | Cost, and whether the LLM adds information |
| Disagreements resolved by a person | Which side was right; feed the result back into thresholds and wording |

**Question wording moves accuracy more than model size.** Use one judgment per question and
describe options the way your team uses them ("reports an outage, error or bug", not "technical").
For yes/no questions, give explicit `true` and `false` descriptions. One rewording of a phishing
question in practice flipped three wrong answers out of five to right. Version the questions with
the code.

## Anti-patterns

- An LLM classifying at volume with "answer with one word" parsing.
- One threshold for every action.
- Gating on score questions.
- Letting the LLM overrule a confident decision model, or the decision model silence a disagreeing
  LLM.
- Forwarding the whole pipeline state, including questions that already passed.
- Treating an escalation error as approval.
- Shipping thresholds that were never measured against labelled data.

## Checklist

- [ ] The answer is bounded. A decision model is used first, and an LLM only for what it alone can do.
- [ ] Three actions (ACT, REVIEW, HUMAN), thresholds per action, gating only the questions that drive actions.
- [ ] Cascade: agreement promotes one step; disagreement goes to a person; errors keep the gate's verdict.
- [ ] Forwarded piece: task, fenced input, only the failed questions with allowed answers and first-model probabilities, and a schema-constrained answer.
- [ ] Data leaving the network is a deliberate choice (hosted vs local second opinion).
- [ ] Labelled eval set; coverage, error rate among ACT, and escalation and agreement rates measured.

## Related

- `eval-foundations.md`: building the labelled set behind every threshold.
- `llm-as-judge.md`: the same model-grading caveats apply to a second-opinion LLM.
- `prompt-engineering.md`: structured output and instruction hygiene for the forwarded prompt.
- `workflow-design.md`: where the gate and cascade sit in a larger workflow.
- Built-in `claude-api` skill: current Claude model IDs, effort, structured outputs, refusals.

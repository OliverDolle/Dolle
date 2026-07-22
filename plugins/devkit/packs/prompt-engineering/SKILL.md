---
name: prompt-engineering
description: >-
  Use when writing or improving a prompt/system prompt for an LLM — the craft of reliable output,
  not sharpening a user request. Covers prompt structure & XML/delimiters, few-shot/multishot,
  chain-of-thought vs. reasoning models, output control & structured output, prompt patterns
  (chaining/routing/parallel/evaluator), eval-driven iteration, and Claude/OpenAI model-specific
  tips. Triggers: 'write a prompt', 'improve this prompt', 'system prompt', 'few-shot',
  'structured output', 'prompt template', 'prompt patterns'.
---

# Prompt engineering (write prompts that produce reliable output)

This is the craft of writing a **prompt or system prompt that makes an LLM produce correct,
consistent output** — the instruction you hand the model, not the request a user hands you. (For
turning a vague user request into a sharp task, that's `prompt-enhancement`; the two compose —
clarify the task first, then engineer the prompt that executes it.)

The governing idea: **a model is a literal, forgetful contractor with no context but the prompt.**
Everything it needs — role, task, data, rules, output shape, how "done" is judged — must be *in the
prompt*, unambiguous, and ordered so the model reads instructions after the data they act on. Write
against a test set, not against one lucky example.

## 1 — Structure & delimiters

Give a prompt a fixed skeleton so nothing is left implicit. A strong prompt names, in order:

1. **Role / lens** — who the model is acting as, when it changes behavior ("You are a senior SRE reviewing an incident").
2. **Task** — one clear imperative: the verb and the object.
3. **Context** — the facts, domain, and prior state the task depends on.
4. **Constraints** — must / never, stack, tone, length, boundaries.
5. **Output format** — exact shape and where it goes (schema, headings, file).
6. **Examples** — one or more worked input→output pairs (§2).
7. **Success criteria** — what "correct" means and how it will be checked.

- **Delimit every distinct part** so the model never confuses instructions with data. XML tags
  (`<document>`, `<instructions>`, `<example>`) work well for Claude; markdown headings / triple
  backticks / section titles work across models. Consistency matters more than the syntax.
- **Put long data at the TOP, instructions at the BOTTOM.** For large inputs (documents,
  transcripts, code), lead with the data in tags and end with the ask — long-context models attend
  better to instructions placed *after* the material they operate on, and it keeps the request from
  being buried. Reference the data by its tag name in the instructions.
- **One instruction per line / bullet.** Prose hides requirements; a list makes each checkable.

## 2 — Examples & few-shot (multishot)

Examples are the highest-leverage lever after a clear task — they pin format and edge-case handling
better than any description. This is *few-shot* (or *multishot*) prompting.

- **How many:** ~**3–5** diverse examples is the usual sweet spot; add more for hard or highly
  structured tasks until quality plateaus. One example (§1) fixes format; several fix judgment.
- **Wrap each in tags** — `<example>…</example>`, ideally nested in an `<examples>` block — so the
  model sees where each begins and ends and doesn't treat them as part of the real input.
- **Make them diverse and representative.** Cover the tricky cases, edge cases, and the failure
  you're trying to prevent — not three near-identical happy paths. Skewed examples bias the output.
- **Match the exact target format** in every example; the model imitates their shape precisely,
  including quirks. If you want strict JSON, every example must be strict JSON.
- **Caveat for reasoning models (§3):** many-shot / CoT-heavy examples can *hurt* — prefer 1–2, or
  none. Test with and without.

## 3 — Reasoning & chain-of-thought

Whether to ask for step-by-step reasoning depends on the model class.

- **Instruction (classic) models** — Claude without extended thinking, GPT-4-class: adding
  **chain-of-thought helps** on multi-step math, logic, and analysis. Ask it to reason before it
  answers, and separate the thinking from the answer (e.g. reasoning in `<thinking>` tags, final
  result in `<answer>`) so you can parse the output cleanly. "Let's think step by step" is a real
  lever here.
- **Reasoning models** — Claude extended thinking, OpenAI o-series (o1/o3/o4): they reason
  internally, so **"think step by step" is redundant and can *degrade* output.** Give them a clear
  **high-level goal and constraints, then get out of the way** — don't prescribe the steps, don't
  pile on few-shot CoT examples. Keep the prompt simpler than you would for an instruction model.
- **Portability:** state the *goal* and *what a good answer contains*; let the model choose how much
  to reason. Reserve explicit "show your work" for instruction models, or when you actually need the
  reasoning trace exposed.

## 4 — Output & format control

Loose format asks produce loose output. Constrain the shape.

- **Prefer real structured output / JSON-schema** (Claude tool-use / `response_format`, OpenAI
  Structured Outputs / function calling) when the model supports it — the platform *guarantees*
  valid, schema-conforming JSON. This beats asking for JSON in prose and hoping.
- **Prefill** (seeding the start of the assistant turn) is a *fallback* to force a shape when schema
  output isn't available — e.g. prefill `{` to suppress preamble, or `<answer>` to lock a section.
  Reasoning models generally **don't support prefill**; don't rely on it there.
- **Show the exact skeleton** you want (the empty headings, the field list, a filled example) rather
  than describing it. Name field types and enums; say what to emit when a value is unknown.
- **Suppress chatter** explicitly when you need only the artifact ("Return only the JSON, no prose").

## 5 — Prompt patterns (multi-step systems)

When one prompt can't do the job reliably, compose several. From Anthropic's *Building effective
agents*:

| Pattern | Shape | Use when |
| --- | --- | --- |
| **Chaining** | Output of step N → input of step N+1 (with checks between) | A task splits into fixed, ordered subtasks; each stage is easier and more accurate alone |
| **Routing** | A classifier sends input to one of several specialized prompts | Inputs fall into distinct categories that each need different handling |
| **Parallelization** | Run subtasks (sectioning) or the same task N times (voting) at once, then aggregate | Independent pieces, or you want diverse takes / a confidence vote |
| **Orchestrator-workers** | A lead prompt decomposes the task at runtime and delegates to workers | Subtasks can't be predefined — e.g. edits across many files |
| **Evaluator-optimizer** | One prompt generates, another critiques; loop until it passes | Clear evaluation criteria exist and feedback measurably improves the result |

Start with the **simplest** thing that works — a single well-structured prompt — and add structure
only when evals show a single call can't hit the bar. More steps means more latency, cost, and
failure surface.

## 6 — Instruction hygiene

- **Positive & specific** — say what *to* do, not only what to avoid. Replace "don't be verbose"
  with "answer in ≤3 sentences"; replace "good / fast / nice" with a measurable target.
- **Dial back the ALL-CAPS.** On older/smaller models, `CRITICAL` / `you MUST` / `NEVER` earned
  compliance. Newer, more steerable models (recent Claude, GPT-4.1+) follow plain, precise
  instructions and can *over-fixate* on shouted rules at the expense of the task. Use emphasis
  sparingly, for the few rules that genuinely override everything.
- **Resolve conflicts.** Contradictory instructions ("be thorough" + "be brief") force the model to
  guess. Rank them or drop one.
- **Give escape hatches** — tell the model what to do when it can't comply ("if the context lacks
  the answer, say so") so it doesn't invent one.

## 7 — Eval-driven iteration

- **Write the prompt against a test set, not one example.** Collect ~10–50 representative inputs
  (include the hard and adversarial ones) with expected outputs or a grading rubric *before*
  tuning.
- **Change one thing, re-run the set.** Attribute each gain or regression to a specific edit — same
  discipline as performance work.
- **Grade** with exact-match/schema checks where you can, and an **LLM-as-judge** (with its own
  rubric prompt) for open-ended quality. Watch for the fix that helps one case and breaks three.
- Anthropic's own sequence: define success criteria → build evals → *then* prompt-engineer against
  them. The prompt is only as trustworthy as the eval that proves it.

## 8 — Model-specific tips

**Claude (primary):**
- Leans into **XML tags** — it's trained on them; use them for structure and to mark where output
  goes.
- **System prompt** sets role and durable rules; per-turn content carries the task and data.
- **Extended-thinking** models: high-level goal, minimal hand-holding, no forced CoT, no prefill.
- Structured output via **tool use**; long inputs → data first, question last.

**OpenAI reasoning models (o-series) — where they differ:**
- **Keep prompts simple and direct**; skip "think step by step" and heavy few-shot — both can
  *reduce* quality.
- Instructions go in the **developer message** (not a system message) on current o-series.
- Delimiters (markdown / XML / section titles) still help them parse input — keep those.
- Non-reasoning GPT models behave like the instruction-model column: CoT and few-shot help.

## 9 — Anti-patterns

- **Wall-of-prose prompt** — requirements buried in paragraphs; the model misses half. Use structure.
- **Instructions above a huge document** — they get lost; put the ask after the data.
- **Undelimited data** — pasted content the model can't tell from its instructions (also a prompt-injection risk).
- **Forcing CoT / many-shot on a reasoning model** — slower and often worse.
- **"Return JSON" in prose** when real structured output is available — you'll parse malformed output forever.
- **Shouting everything** — when every rule is CRITICAL, none is.
- **Tuning on one example** — it passes your demo and fails in production. Build the eval set.
- **Over-engineering** — a five-prompt pipeline where one clear prompt would do.

## 10 — Checklist

- [ ] Role, task, context, constraints, output format, examples, success criteria — all present or deliberately omitted.
- [ ] Distinct parts delimited (XML tags / headings); data and instructions can't be confused.
- [ ] Long inputs at the top, the ask at the bottom.
- [ ] 3–5 diverse examples in `<example>` tags (or 0–2 for a reasoning model), matching the exact target format.
- [ ] CoT choice matches the model class — asked for on instruction models, withheld from reasoning models.
- [ ] Output constrained via structured output / schema where possible; prefill only as fallback.
- [ ] Instructions positive, specific, non-conflicting; emphasis reserved for the few rules that matter.
- [ ] Multi-step only where a single prompt provably can't hit the bar; simplest pattern chosen.
- [ ] Validated against a representative test set, one change at a time.

## Related

- `prompt-enhancement` — the upstream half: turn a vague *user request* into a sharp task. Clarify
  there, then engineer the prompt here.
- `app-prompt` — same craft applied to turning an app idea into a build-ready spec.
- `subagents` (see its `writing-subagent-instructions`) — a subagent brief is a prompt; the
  structure and "no ambiguity left" bar here apply directly to worker prompts.
- `agent-development` / agent-evaluation — §7's eval-driven loop is how you validate agent and
  workflow prompts, not just single calls.

---
name: prompt-enhancement
description: >-
  Method for turning a vague or underspecified user request into a precise, high-yield prompt —
  before doing the work. Load when a request is ambiguous, missing context/constraints/success
  criteria, or could be read several ways. Covers diagnosing what's missing, deciding when to ask
  vs. assume, writing sharp AskUserQuestion clarifications, and the anatomy of a strong enhanced
  prompt. Improves both the prompt and the quality of the response it produces.
---

# Prompt enhancement (clarify, then sharpen)

The quality of a response is capped by the quality of the prompt. A vague prompt earns a vague or
wrong answer — often after wasted work. Before executing a non-trivial or ambiguous request, take a
beat to **(1) diagnose** what the prompt is missing, **(2) fill the gaps** — ask the user when the
answer changes what you'd do, assume sensibly and say so when it doesn't — and **(3) restate** the
sharpened prompt so a misread is caught while it's still cheap.

Two levers: **clarify** (get missing information from the user) and **sharpen** (structure what you
already have). Good prompt work uses both. This section is the *method*; the **AskUserQuestion** tool
is the *mechanism* for the clarify half.

## 1 — Diagnose: what is this prompt missing?

Read the request against the anatomy of a complete prompt and note the gaps:

- **Goal / intent** — the outcome the user actually wants. Separate the literal ask from the
  underlying need ("add a button" may really mean "let users export their data").
- **Context** — the codebase, domain, audience, or prior state the task depends on.
- **Scope / boundaries** — how big, what's in and out, how deep to go.
- **Constraints** — stack, style, performance, deadline, must-use / must-avoid.
- **Success criteria** — how we'll know it's right; what "done" looks like.
- **Output format** — code / doc / list / diff / file; length; tone.
- **Examples** — a sample input/output, or a reference to imitate.

Then classify each gap:

- **Inferable** — answerable from the codebase, conventions, docs, or context. Go find it.
- **Assumable** — a sensible default exists. Take it and state it.
- **Blocking** — the answer changes what you'd do and you can't infer it. Ask.

## 2 — Decide: ask vs. assume

Don't reflexively ask, and don't reflexively guess. The test is one question: **would the answer
change what I do next?**

- **Ask** when a wrong guess wastes real work or is hard to reverse, when the options are genuinely
  different paths, or when it's a preference only the user holds (audience, priorities, taste).
- **Assume** when a conventional default exists, when the choice is cheap to change later, or when
  you can verify it yourself. State the assumption in one line and proceed.
- **Never ask what the repo already answers** — read the code, docs, and git history first. One
  good clarifying round beats five timid ones: batch your questions, don't drip them out.

## 3 — Clarify with AskUserQuestion

When you do ask, use the **AskUserQuestion** tool — it gives the user tappable options instead of a
wall of open-ended questions, so answering is fast and the choices stay concrete.

- **1–4 questions per call**, each self-contained, with a short `header` (≤12 chars, e.g. "Auth
  method", "Scope").
- **2–4 options each**, mutually exclusive, each a distinct real choice with a one-line consequence
  in its `description`. If you have a recommendation, make it the **first** option and append
  "(Recommended)".
- An **"Other"** choice is added automatically — don't add your own; users can always free-type.
- **`multiSelect: true`** when the choices aren't exclusive ("Which platforms should this target?").
- Use **`preview`** to show concrete artifacts to compare — an ASCII UI mockup, two code snippets,
  config variants, diagram options — on a single-select question. Reserve it for things you truly
  need to *see* side by side; labels + descriptions suffice for preference questions.
- Ask about **decisions, not confirmations.** Don't ask "should I proceed?"; ask the things you
  genuinely can't resolve. Approval theater wastes a turn.

Example — a bare "add auth to the API":

- **Q "Auth method?"** → Session cookies (Recommended) · JWT · OAuth provider
- **Q "Who logs in?"** → End users · Internal staff · Service-to-service
- **Q (multiSelect) "Include which?"** → Password reset · MFA · Rate limiting

Three tapped answers turn an open-ended request into a buildable spec.

## 4 — Sharpen: the anatomy of a strong prompt

Once the gaps are filled, restate the request as a sharp prompt. A strong prompt names:

1. **Role / lens**, when it helps ("as a security reviewer…").
2. **Task** — one clear imperative verb and object.
3. **Context** — the facts the task depends on.
4. **Constraints** — stack, style, must / never.
5. **Output format** — shape, length, and where it goes.
6. **Success criteria** — what "correct" means and how it'll be checked.
7. **Examples** — a reference or sample when the shape is hard to describe in words.

Techniques that raise the yield:

- **Be specific and positive** — say what to do, not only what to avoid; replace "good / fast /
  nice" with measurable targets.
- **Decompose** a big ask into ordered steps, each building on the last.
- **Show, don't just tell** — one worked example pins the format better than a paragraph about it.
- **Name the audience and tone** when they affect the wording.
- Prefer **structure** (headings, lists, fields) over prose for anything with more than a couple of
  instructions.

## 5 — Restate & confirm cheaply

For anything non-trivial, echo the enhanced prompt back in 1–3 lines before the heavy work:
"Here's what I'll do, with these assumptions — say the word if any are off." This catches a misread
while correcting is free, and turns a vague request into a shared spec. Keep it short and don't
re-litigate points already settled.

## Checklist (run on any ambiguous or high-stakes request)

- [ ] Identified the real goal, not just the literal words.
- [ ] Listed the gaps; classified each **inferable / assumable / blocking**.
- [ ] Read the codebase/context to close the inferable gaps *before* asking.
- [ ] Asked only the blocking questions — via **AskUserQuestion**, batched, recommended option first.
- [ ] Stated the assumptions taken for everything else.
- [ ] Restated the sharpened prompt: task, context, constraints, output, success criteria.
- [ ] Confirmed cheaply before any expensive or hard-to-reverse work.

## Anti-patterns

- **Over-asking** — a barrage of questions for a task with obvious defaults. Ask what matters,
  assume the rest.
- **Under-asking** — charging into a large build on a guess whose wrong turn is costly to undo.
- **Asking the answerable** — questions the repo, docs, or context already answer.
- **Confirmation theater** — "should I proceed?" adds nothing; ask a real decision or just act.
- **Open-ended dumps** — five paragraph-long free-text questions where 2–4 tappable options would do.
- **Silent scope creep** — enhancing the prompt into a *bigger* task than the user asked for.
  Enhance clarity, not scope.

## Related

- **AskUserQuestion** (harness tool) — the mechanism for §3; this section is how to use it well.
- `devkit:subagents` — once a prompt is sharp, a self-contained brief is exactly what a subagent
  needs; the same "no ambiguity left" bar applies to the brief you hand it.
- `devkit:ui-ux-design` — its design brief *is* prompt enhancement applied to a design task (asking
  for unspecified direction before building).
- `deep-research` — same principle at the top of the funnel: narrow an underspecified question
  before the expensive fan-out.

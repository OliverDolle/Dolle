---
name: writing-subagent-instructions
description: "Use when authoring the brief or system prompt for a subagent, worker, or delegated agent — deeper than the brief note in orchestration. Covers the role/goal/context/output/boundaries contract, pinning the decisions you do NOT want delegated, tool grants, effort scaling, stop & failure conditions, requiring a deviations report, verification hooks, and recency/honesty rules. Grounded in Anthropic's orchestrator-worker guidance and field notes from a real fan-out. Triggers: 'write a subagent prompt', 'agent system prompt', 'worker brief', 'subagent instructions', 'delegate to an agent', 'guide subagents'."
---

# Writing subagent instructions

A subagent starts **blind**. It cannot see your conversation, your screen, or your intent — only
the brief you write and the tools you grant. The quality of what comes back is capped by the
quality of the brief. Orchestration (see `orchestration`) decides *what* to delegate; this skill
is about writing the delegation so a competent-but-context-free worker produces exactly what you
meant, not merely something plausible.

The single most common failure is not a bad worker — it's an **under-specified brief**. A vague
brief makes workers "duplicate work, leave gaps, or make choices you'd have made differently"
(Anthropic, *Building a multi-agent research system*). Every open question in your brief becomes a
silent decision the worker makes for you.

## The brief contract

A self-contained brief has these parts. Missing any one is where a worker guesses.

| Part | What it does | Failure if omitted |
| --- | --- | --- |
| **Role** | One line of persona/expertise that frames the task. | Generic, hedged output. |
| **Goal** | One sentence: the single thing to produce. | Worker optimizes the wrong thing. |
| **Context** | The specific files, symbols, constraints, prior conclusions the worker needs — **self-contained, absolute paths**. | Worker re-derives (slow) or invents (wrong) context. |
| **Inputs** | The exact material to work from (paths, IDs, pasted data). | Worker searches for it, or uses the wrong copy. |
| **Output contract** | The exact shape to return — a table, JSON schema, a patch, a word budget. Ask for the *conclusion*, not a narration. | Unparseable, unmergeable results. |
| **Boundaries** | What it must **not** touch; what's out of scope. | Scope creep; collateral edits. |
| **Stop & failure conditions** | When to stop and report a blocker instead of guessing or grinding. | Runaway loops, or a confident wrong answer. |

Prefer **structured output** for anything you will aggregate or process — it removes parsing
ambiguity and lets you fan results back in cleanly.

## Pin the decisions you do not want delegated

This is the lesson most briefs miss. A worker will resolve *every* ambiguity you leave open —
structure, naming, scope, format — and it will resolve them **independently**, so a fan-out of N
workers produces N inconsistent answers. Before dispatching, split the decisions in two:

- **Yours (pin them).** State them as fixed constraints, not suggestions. "Name it `X`." "Return
  ≤ 600 words." "Single file, no new directories."
- **Theirs (delegate them) — but give a decision rule.** If a judgment is genuinely the worker's,
  don't leave it bare: give the heuristic you'd use. Instead of "single- or multi-file, your
  call," write "single-file unless the topic spans ≥3 independent disciplines; match the shape of
  comparable existing work."

A good tell: if you'd be annoyed to get one of two answers, you didn't pin it — you gambled on it.

## Require a deviations report

End every brief with: *"Report any assumption you made, any point in this brief that was
ambiguous, and anything you did differently than asked."* This one line is the cheapest quality
lever available. It converts silent guesses into surfaced ones you can review, and it tells you
where **your brief** was weak so the next one is sharper. Treat the deviations section as feedback
on your instruction-writing, not just on the worker.

## Effort scaling

Match the number and depth of workers to the task; over-provisioning burns tokens, under-provisioning
misses coverage (Anthropic):

- **1 worker** — a fact-find, a single-file edit, a bounded lookup.
- **2–4 workers** — a comparison, a few independent search angles, a small fan-out.
- **10+ workers** — a broad audit, a large migration, exhaustive discovery.

State the effort ceiling in the brief when it matters ("read at most the top 8 sources; say what
you skipped").

## Tool grants

Grant the **minimum** tools the job needs, and say how to use them. A tool description should read
like "a great docstring for a junior developer" (Anthropic, *Building effective agents*).

- Read-only work (explore, review, research) → read/search tools only. Never grant write tools to
  a worker whose job is to *find* or *judge*.
- Name the tools to prefer and when ("use WebSearch/WebFetch for current practice; load them via
  ToolSearch first if they aren't callable").
- Prefer designs that remove error classes: absolute paths, explicit schemas, "if X is missing,
  stop and report" over silent fallbacks.

## Recency & honesty rules

Tell the worker to be explicit about the confidence of what it returns:

- **Flag volatile facts** (vendor names, versions, pricing, ownership) as needing a freshness check
  rather than asserting them.
- If the environment date is later than the worker's knowledge cutoff, treat time-sensitive claims
  as needing verification and say so.
- Distinguish *"URL fetched and verified"* from *"summary-level, from search snippets."* Never let
  "I covered it" stand in for "I read it."

## Verification hooks

Never let a worker grade its own load-bearing work (see `orchestration`). Build the check into the
dispatch:

- For anything that matters, spawn a **separate** verifier prompted to *refute*, defaulting to
  "not proven" when uncertain.
- Give verifiers **diverse lenses** (correctness, security, does-it-actually-reproduce) rather than
  N identical checkers.
- Ask the worker itself for the evidence its claim rests on, so verification is cheap.

## In Claude Code specifically

The brief lands in one of two forms:

- **Ad-hoc dispatch (Task/Agent tool).** The brief *is* the `prompt`. Send independent dispatches
  in a single message so they run in parallel. Long-running ones run in the background — you're
  notified on completion; don't predict results before they land.
- **A reusable subagent (`agents/<name>.md`).** Frontmatter `name`, `description` (when to invoke
  it), and `tools` (the allowlist); the body is the standing system prompt. Same contract, written
  once. Keep `tools` least-privilege and the `description` trigger-rich.

## Copy-paste brief template

```
You are <role>. Your job: <one-sentence goal>. Do NOT <the main scope boundary>.

## Context (you start blind — this is everything you get)
<files with absolute paths, prior conclusions, constraints, conventions to match>

## Fixed decisions (do not change these)
<the calls that are mine, stated as constraints — names, formats, limits, structure>

## Your task
1. <step> ... (delegated judgment + the decision rule to use)

## Output contract
<exact shape: table / JSON schema / patch; word budget; "conclusion not narration">

## Stop conditions
Stop and report a blocker if <condition> instead of guessing.

## Deviations & assumptions
List any assumption you made, anything ambiguous in this brief, and anything you did
differently than asked.
```

## Field notes from a real fan-out

Distilled from a six-worker parallel research fan-out (2026-07) where the briefs were good but not
airtight. Every item below is a decision workers made *because the brief left it open* — turn each
into a pinned constraint next time:

- **Structure was decided by every worker independently.** "Single- vs multi-skill: your call"
  produced a different answer from each. Fix: give the rule up front ("single-file unless the topic
  spans ≥3 disciplines; match comparable existing sections").
- **Naming was assumed, then flagged for confirmation.** Workers invented kebab-case names and
  command names and asked to confirm. Fix: either supply the name or say "propose 2 names, don't
  create files."
- **"Tool-agnostic" + "cover Postgres specifically" read as a contradiction.** Workers resolved it
  well (neutral principles + one worked example) but had to guess the resolution. Fix: state the
  resolution ("principles engine-neutral; use Postgres as the single worked example").
- **Scope edges were filled by judgment.** "Deeper than X" with no length target, and "new section
  vs nested skill" with no default, each became a worker decision that materially changed the
  output. Fix: give a length target and a default placement.
- **The deviations-report requirement paid for itself.** The sharpest feedback on the briefs came
  from the workers' own "here's where your brief was ambiguous" sections — which existed only
  because the brief demanded them. Keep that line in every brief.
- **Workers stayed in scope and cited sources when the output contract was explicit.** Where the
  brief named the format, word budget, and "real URLs you actually fetched," results were clean and
  mergeable. The contract, not the worker, produced that.

A second, larger fan-out (2026-07, seven implementer workers writing real files) added four more:

- **A pinned "fact" can be wrong — good workers override it.** A brief asserted a standard was
  published "since Oct 2023"; the worker verified against the primary source (republished Dec 2024)
  and wrote neutral phrasing instead of the wrong date. Lesson: don't hand workers unverified
  specifics as gospel — and explicitly *instruct* them to verify load-bearing facts rather than
  trust the brief. A pinned decision constrains *choices*, not *facts*.
- **Length quotas produce padding or apologies, not quality.** Several workers landed under a
  line-count target and flagged it rather than dilute dense content; that was the right call. Give a
  *quality bar and a rough range*, and say "do not pad to hit a number" — never a hard quota.
- **When the orchestrator restructures around a worker, the worker can't know final names.** In a
  section being converted from single- to multi-skill, workers wrote cross-links to a slug that
  didn't exist yet and flagged it. Lesson: own all cross-section wiring and final-slug links in the
  orchestrator; tell workers to write their own files only and leave outbound links approximate.
- **Give workers disjoint file ownership and the collisions never happen.** Seven workers wrote in
  parallel with zero conflicts because each owned a distinct `packs/<section>/**` subtree and the
  orchestrator did every shared-file edit (catalog, menu, hook, docs). Never let two parallel writers
  touch the same file; route shared edits to one writer.

## Anti-patterns

- A brief that assumes shared context ("as we discussed") — the worker never saw it.
- Leaving structure/naming/format open across a fan-out, then hand-reconciling N inconsistent
  answers.
- Asking for narration ("walk me through your search") instead of the conclusion.
- One mega-worker doing "everything" — unverifiable, defeats isolation.
- Granting write tools to a read-only role.
- No stop condition — the worker grinds or guesses instead of reporting a blocker.

## Checklist before you dispatch

- [ ] Role, goal, context, inputs, output contract, boundaries, stop conditions — all present.
- [ ] Every decision I care about is **pinned**; every delegated one carries a decision rule.
- [ ] Output contract is a concrete shape (schema/table/patch), with a size budget.
- [ ] Tools are least-privilege and the brief says how to use them.
- [ ] Recency/honesty and (for load-bearing results) a separate verifier are specified.
- [ ] The brief ends with a deviations-report requirement.

## Related

- `orchestration` — the decompose → delegate → verify → integrate loop this brief plugs into.
- `devkit:prompt-enhancement` — sharpening the *user's* request before you even decompose it.
- `devkit:agent-development` — system prompts for LangChain/LangGraph agents follow the same contract.

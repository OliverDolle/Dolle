---
name: orchestration
description: Methodology for building software by decomposing work and orchestrating subagents (explore, plan, implement, verify) instead of doing everything in one context. Load when a task is large, benefits from parallel investigation, or needs independent verification. Pair with writing-subagent-instructions to write the briefs.
---

# Subagent-Driven Development

Build software the way a tech lead runs a team: break the work into well-scoped units,
delegate each to a focused subagent, and keep the main context as a thin orchestrator that
holds conclusions — not raw file dumps. The main agent decides *what* needs doing; subagents
do the reading, searching, drafting, and checking.

## When to use it

Use it when:
- The task spans many files/subsystems, or the answer requires reading widely.
- Independent angles can run in parallel (e.g. several search strategies).
- A claim, plan, or diff should be checked by a fresh perspective before you commit.

Don't bother when the task is a single obvious edit, a quick lookup where you already know the
file, or a short conversational reply. Orchestration has overhead; spend it where it pays.

## The core loop

```
Decompose  ->  Delegate  ->  Verify  ->  Integrate
    ^                                        |
    +----------------------------------------+
```

1. **Decompose** — Turn the goal into a short work-list of independent units. Name the inputs,
   the expected output, and the done-condition for each.
2. **Delegate** — Spawn one subagent per unit. Give it a sharp brief (see below). Run
   independent units in parallel; chain dependent ones.
3. **Verify** — Before trusting a result that matters, have a *separate* subagent try to
   refute it. Verification is a different job from production — never let the author grade
   their own work on anything load-bearing.
4. **Integrate** — Merge results in the main context, resolve conflicts, and decide the next
   round. Repeat until the done-condition holds.

## Roles (dispatch subagents by intent)

- **Explorer** — read-only. Sweeps the codebase/docs and returns a map: where things live,
  key signatures, conventions. Returns conclusions and `file:line` pointers, not file bodies.
- **Planner** — turns a mapped problem into a step-by-step plan with risks and alternatives.
- **Implementer** — makes the change in its own scope. For parallel edits that could collide,
  isolate each in its own worktree.
- **Verifier / adversary** — tries to break a finding, plan, or diff. Prompt it to *look for
  the failure*, defaulting to "not proven" when uncertain.
- **Synthesizer** — collapses many results into one coherent output.

## Writing a good subagent brief

A subagent starts blind. Its brief must be self-contained: **Goal** (one sentence — what to
produce), **Context** (the specific files, symbols, constraints, and prior conclusions it needs),
**Output contract** (the exact shape to return — ask for the *conclusion*, not a narration), and
**Boundaries** (what it must not touch; when to stop and report a blocker instead of guessing).

Prefer structured output for anything you will process programmatically or aggregate — it removes
parsing ambiguity and lets you fan results back in cleanly.

> This is the summary. For the full craft — pinning the decisions you don't want delegated, tool
> grants, effort scaling, stop conditions, requiring a deviations report, and the copy-paste brief
> template — read the **`writing-subagent-instructions`** skill in this section.

## Parallel vs. sequential

- **Parallel (fan-out)** when units are independent — several finders, several candidate
  designs, per-file transforms. Wall-clock is the slowest single unit.
- **Sequential (pipeline)** when a unit consumes the previous one's output. Only force a
  barrier (wait for *all* of a stage) when the next step genuinely needs the whole set at once
  (e.g. dedup/merge before expensive downstream work).

## Verification patterns

- **Adversarial vote** — N independent skeptics per claim; keep it only if a majority fail to
  refute it. Kills plausible-but-wrong results.
- **Diverse lenses** — when a finding can fail in more than one way, give each verifier a
  distinct angle (correctness, security, performance, does-it-actually-reproduce) rather than
  N identical checkers.
- **Loop-until-dry** — for open-ended discovery, keep spawning finders until K consecutive
  rounds surface nothing new; a fixed count misses the tail.

## Anti-patterns

- Piping raw file contents back to the orchestrator — return conclusions and pointers instead.
- One mega-subagent doing "everything" — it can't be verified and defeats isolation.
- Letting the implementer verify itself on anything that matters.
- Silent truncation (top-N, sampling, no-retry) without saying so — always report what was
  dropped, or "covered everything" reads as a lie.
- Spawning subagents for trivial work the orchestrator could do in one step.

## In Claude Code specifically

- Use the **Task/Agent tool** to spawn subagents; send independent dispatches in a single
  message so they run concurrently.
- Use read-only explorer agents for search-heavy questions so file dumps stay out of your
  context.
- Use worktree isolation when multiple implementers edit files in parallel.
- For deterministic multi-stage fan-out (loops, conditionals, verify-every-finding), reach for
  a **workflow** rather than orchestrating by hand.

## Checklist before you call it done

- [ ] Every work unit had a clear done-condition, and each is met.
- [ ] Load-bearing results were verified by a *different* subagent.
- [ ] Conflicts between subagent outputs were reconciled, not averaged.
- [ ] Any coverage limits (skipped areas, sampling) are stated explicitly.
- [ ] The integrated result was re-checked against the original goal.

## Related

- `writing-subagent-instructions` — how to write the brief each delegated unit runs on.

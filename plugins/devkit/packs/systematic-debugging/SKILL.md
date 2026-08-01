---
name: systematic-debugging
description: >-
  Use when debugging a failing program, a flaky test, or a production incident — BEFORE guessing at
  fixes. A systematic method: reproduce reliably, read the actual error, form and test one
  hypothesis at a time, bisect the search space, reach for the right instrument
  (logs/debugger/tracing/profiler), and confirm the root cause before fixing. Triggers: 'debug
  this', 'why is this failing', 'systematic debugging', 'root cause', 'flaky test', 'works on my
  machine', 'stack trace', 'bisect'.
---

# Systematic Debugging

A bug is a **search problem**, not a guessing game. The fastest debuggers are not the ones with the
best hunches — they are the ones who narrow the space of possible causes methodically until only the
real one is left. Guessing at fixes and re-running is the slowest path: it corrupts your evidence,
stacks unrelated changes, and often "fixes" a symptom while the cause survives. This works for any
language or stack; concrete tools (gdb/lldb/pdb, `git bisect`, strace/dtrace, profilers,
sanitizers) are named only as examples.

## §0 Debugging is a search, not a guess (the scientific method)

Debugging *is* the scientific method applied to a program. Andreas Zeller's loop in *Why Programs
Fail*: **observe** a failure → **hypothesize** a cause consistent with it → **predict** what else
must be true if the hypothesis holds → **experiment** to test the prediction → refine, repeat until
the hypothesis fully explains the behavior. David Agans' *Debugging* compresses the same discipline
into rules that map onto the sections below: understand the system, make it fail, quit thinking and
look, divide and conquer, change one thing at a time, keep an audit trail, check the plug, get a
fresh view, and — if you didn't fix it, it ain't fixed.

- **Keep an audit trail.** Write down what you tried, what you expected, what happened. A cheap
  notes file beats memory and stops you re-running the same dead end twice.
- **Quit thinking and look.** Your mental model is a hypothesis, not evidence. Instrument and
  observe the *actual* state before theorizing about it.

## §1 Reproduce reliably

You cannot fix what you cannot trigger on demand, and you cannot confirm a fix without it. Getting a
deterministic repro is usually 50% of the work.

- **Make it fail on command.** Find the smallest input, request, or sequence that triggers it every
  time. Reduce toward a **minimal reproducer** — strip unrelated code, data, and config until only
  the essential trigger remains (this is manual delta debugging; see §4).
- **Control the environment.** "Works on my machine" is an environment delta, not magic. Pin the
  variables: same version/commit, same OS/arch, same dependency lockfile, same env vars, same
  timezone/locale, same data. Reproduce in a clean container to rule out host state.
- **Chase determinism.** Flaky repros come from hidden inputs: time, randomness (seed it), thread
  scheduling, network, uninitialized memory, iteration order of hash maps. Log or fix each until the
  failure is reliable, or at least measure its frequency (e.g. "fails 3 runs in 10").
- If it only fails in production, capture the exact request/payload/state and replay it locally.

## §2 Read the error and stack trace properly

Most "impossible" bugs are explained in an error message the developer skimmed.

- **Read it top to bottom, all of it** — the message, the exception type, *and* the full trace.
  Don't stop at the first familiar-looking line.
- **Find the real cause line, not the framework noise.** In a deep trace, the topmost frame is often
  library code; scan down to the **first frame in your own code**. Read the **innermost / root
  `Caused by:`** in a chained exception — the outer wrapper is a symptom.
- **Take the message literally.** "undefined is not a function", "connection refused", "no such
  column" each name a specific, checkable fact. Verify the fact before theorizing past it.
- Note what the trace *doesn't* show: a swallowed exception, a truncated async stack, or a crash
  with no trace (segfault, OOM kill) all point you to the right instrument in §5.

## §3 Hypothesis-driven: change one variable at a time

- **State one hypothesis** narrow enough to be wrong: "the list is empty because the query filters on
  a stale timestamp" — not "something's off with the data."
- **Predict before you observe.** Say what value you expect at the breakpoint / in the log *before*
  you look. When the prediction is wrong, you've learned exactly where reality diverges — that gap
  is the bug's neighborhood.
- **Change exactly one thing per experiment**, then re-test. Changing several at once means a pass
  tells you nothing about which one mattered, and you may introduce a second bug.
- **Revert failed experiments** immediately. Debugging edits accumulate into noise; keep the tree
  clean so your audit trail stays meaningful.
- Prefer experiments that **halve the space** (§4) over ones that confirm a single guess.

## §4 Bisect the search space

Binary search is the highest-leverage move in debugging: each test halves the suspects, so a
thousand candidates fall in ~10 tests.

- **`git bisect` for regressions.** Mark a known-good and known-bad commit; Git checks out the
  midpoint and you mark each good/bad until it names the culprit commit. Automate it with
  `git bisect run <script>` where the script exits 0 for good, non-zero for bad (`125` = skip an
  untestable commit). For **flaky** failures, run the predicate several times per commit and vote —
  a noisy test makes bisect blame the wrong commit.
- **Bisect in code/data/time too.** Comment out or `return` early to halve the code path; binary-
  search a large input to the failing half; disable half the plugins/config; narrow a time window in
  logs. The principle is identical to `git bisect`.
- **Delta debugging** (Zeller) is this idea automated: systematically remove chunks of the failing
  input, keeping only what still reproduces the failure, down to a 1-minimal case. Do it by hand
  when no tool fits.

## §5 Instruments and when to reach for each

Pick the instrument that answers your current question with the least noise — don't default to
print statements for everything.

| Instrument | Best when | Notes |
| --- | --- | --- |
| **Structured logs + levels** | Production, intermittent, or timing-sensitive bugs you can't pause | Log at boundaries with context (ids, inputs). Use levels (`debug`/`info`/`warn`/`error`); don't `printf`-spam then delete. |
| **Interactive debugger** (gdb/lldb/pdb/browser devtools) | You can reproduce locally and need to inspect live state | Set **breakpoints**; use **conditional** breakpoints for "only when `id==42`"; **watchpoints** to catch *when a value changes*; step in/over/out. |
| **Tracing** (strace/dtrace/eBPF, distributed tracing) | Question is "what is it *doing* to the OS / across services" — syscalls, files, network, spans | Reveals the boundary the bug crosses without editing code. |
| **Profiler** (CPU/alloc/sampling) | "Why is it slow / using all the memory" | Measure, don't guess the hot path; look for the fat frame, not the pretty one. |
| **Sanitizers / valgrind** (ASan/UBSan/TSan/memcheck) | Memory corruption, use-after-free, data races, UB | **TSan** for races, **ASan/valgrind** for memory. Run the test suite under them in CI. |
| **Core dumps / crash reports** | Process died with no live session (segfault, panic, OOM) | Load the dump in the debugger for the post-mortem stack and state. |

Start with the cheapest instrument that can see the failure, and escalate only when it can't.

## §6 Common bug classes and their tells

| Class | Typical tells | First check |
| --- | --- | --- |
| **Off-by-one / boundary** | Fails on first/last element, empty input, or size ±1 | Loop bounds, `<` vs `<=`, inclusive/exclusive ranges. |
| **Race / concurrency (heisenbug)** | Only fails under load, changes when you add logging, non-deterministic | Shared mutable state without a lock; run under a thread sanitizer. |
| **Null / uninitialized** | NPE / "undefined", garbage values that vary per run | Trace the value back to where it should have been set. |
| **Memory** | Corruption far from the cause, crashes that move around | ASan/valgrind; look for buffer overrun / use-after-free / leak. |
| **Env / config drift** | Works locally, fails in CI/prod (or vice versa) | Diff versions, env vars, feature flags, secrets, data between environments. |
| **Dependency / version** | Broke with no code change of yours | Lockfile diff; a transitive dep bumped. `git bisect` the lockfile. |
| **Integration boundary** | Failure at an API/DB/serialization edge | Inspect the actual bytes on the wire; timezone, encoding, null handling, schema mismatch. |

A heisenbug that vanishes when observed almost always points at a race or uninitialized memory —
the added logging shifted timing or zeroed a byte.

## §7 Confirm the root cause before fixing

- **Explain the whole failure.** If your hypothesis doesn't account for every observed symptom,
  you're looking at a symptom, not the cause. Don't fix yet.
- **Prove causation both ways:** the bug is present with the cause and *gone* when you remove it. A
  fix that "seems to help" without a mechanism is a coincidence waiting to regress.
- **Write a regression test that fails first.** Reproduce the bug as an automated test, watch it
  fail (proving it catches this bug), then apply the fix and watch it pass. A test that passes
  before your fix is testing the wrong thing.
- Fix the **cause, not the symptom** — no swallowing the exception, no `try/except: pass`, no
  clamping the bad value. If you must ship a mitigation, file the root-cause follow-up.
- **If you didn't fix it, it ain't fixed.** Verify on the original reliable repro from §1, not a
  slightly different case.

## §8 When stuck

- **Rubber-duck it.** Explain the code line by line, out loud, to a duck/colleague/an empty
  editor. The mismatch between what you *say* it does and what it *does* is usually the bug.
- **Get fresh eyes.** A second person carries none of your assumptions; hand them the audit trail.
- **Revert to known-good.** Check out the last version that worked and walk forward — often faster
  than reasoning backward from the broken state.
- **Question your assumptions explicitly.** List what you "know" is true, then *verify each one*.
  The bug lives in the assumption you refused to check ("the config is loaded", "this can't be
  null", "that library is correct").
- **Read the code, not your mental model of it.** Open the actual function and the actual dependency
  version. Take a break — sleep genuinely resolves bugs the tired brain can't.

## §9 Debugging checklist

- [ ] Reproduced **reliably** (minimal, deterministic; env pinned).
- [ ] Read the **full** error and stack trace; identified the real cause line.
- [ ] Wrote down a **specific, falsifiable hypothesis** and a prediction.
- [ ] Changed **one variable** per experiment; reverted failures; kept an audit trail.
- [ ] **Bisected** the space (commit / code / data / time) instead of guessing.
- [ ] Used the **right instrument** for the question (log/debugger/trace/profiler/sanitizer/dump).
- [ ] Root cause **explains all symptoms** and is proven by removal.
- [ ] Regression test **fails before** the fix, passes after.
- [ ] Verified on the **original repro**; fixed the cause, not the symptom.

## Related

- `devkit:agent-development` — its troubleshooting log applies this method to LLM/agent failures
  (non-determinism, tool-call errors); the reproduce → isolate → confirm loop is the same.
- Systematic debugging is **cross-cutting** — reach for it from any section (containerization,
  kubernetes, web-performance) the moment "why is this failing?" replaces "how do I build this?".
- `devkit:extensible-architecture` — once you've confirmed the root cause, design the fix so the
  same class of bug is structurally harder to reintroduce.

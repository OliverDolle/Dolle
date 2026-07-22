---
description: "Use when debugging a failing program, a flaky test, or a production incident — BEFORE guessing at fixes. A systematic method: reproduce reliably, read the actual error, test one hypothesis at a time, bisect the search space, reach for the right instrument (logs/debugger/tracing/profiler), and confirm the root cause before fixing. Triggers: 'debug this', 'why is this failing', 'systematic debugging', 'root cause', 'flaky test', 'works on my machine', 'stack trace', 'bisect'."
argument-hint: "[optional: the bug, error, or failing test]"
---

**A debugging task matches this command — load it before guessing at a fix; do not shotgun
changes from memory.** Read the file `${CLAUDE_PLUGIN_ROOT}/packs/systematic-debugging/SKILL.md` in
full and follow it as the active method for this work.

Then:
1. Confirm in one line that the **systematic-debugging** section is loaded.
2. Summarize the method in 3–5 bullets: reproduce reliably first; read the real error/stack trace;
   change one variable at a time (hypothesis → predict → observe); bisect the search space; confirm
   the root cause before fixing and add a regression test that fails first.
3. If the user described a bug, error, or failing test below, start there — get to a minimal
   reproduction before proposing a cause.

User task (optional): $ARGUMENTS

# Evaluating a delegated run

Before changing how you delegate, measure where a run's wall time and tokens went. The obvious
guess is often wrong. In the worked example below, the suspect was "the tests". The tests took 0.2
to 4.5 minutes per agent. The hours went to writing, to repeated browser checks and to stalls.

## When

- A delegated run took longer, or cost more, than expected.
- Before briefing a similar run, to set its budget from the last one.
- During a run that has gone quiet.

## Measure: `assets/agent-runs.mjs`

```bash
node <hub>/assets/agent-runs.mjs                      # newest session of the current project
node <hub>/assets/agent-runs.mjs <session>.jsonl --min 20   # one session, agents over 20 min
node <hub>/assets/agent-runs.mjs --agent "phone" --json     # one agent, as JSON
node <hub>/assets/agent-runs.mjs --main               # the main session too (its idle is mostly the user)
```

`<hub>` is this hub's folder: the "Base directory" printed when the hub loads. The script is
read-only and needs Node 18+ with no dependencies. It reads the Claude Code transcripts under
`~/.claude/projects/<slug>/`, where the slug is the project path with every non-alphanumeric
character turned into `-`:

- `<session>.jsonl`, the main session;
- `<session>/subagents/agent-*.jsonl`, one per subagent, with a `.meta.json` naming its task.

Outside Claude Code, take the same numbers from traces: see `devkit:agent-development` →
`references/tracing-observability.md`.

## The breakdown

**wall = model work + tool time + idle**

| Part | What it is | Grows with |
| --- | --- | --- |
| Model work | Thinking and writing, plus each call re-reading the whole context | Output tokens, number of calls, context size |
| Tool time | Commands, browsers, tests and waits, split by kind | Check loops re-run after each fix, a slow or shared machine |
| Idle | More than 5 minutes with no tool running and no model output | A stalled request, a sleeping machine, waiting on its own background job |

For each agent, the script also reports:

- model calls and output tokens;
- peak context and total tokens re-read;
- the effort level;
- how many other agents ran at the same time.

**Rule of thumb:** output tokens ÷ about 100 per second gives the minimum model minutes. 200K output
tokens is about 35 minutes before any tool runs. A unit of work that produces 200K or more is a
45-minute-plus agent however fast its tests are.

## Read it: signal, cause, change

The script's verdict uses these limits (`LIMITS` in the script; change both together).

| Signal | Usually means | Change |
| --- | --- | --- |
| Idle over 25 % of wall, and the gap ended when a message arrived | Stalled until someone nudged it | Look at an agent that has been quiet for about 20 minutes (its output file) instead of waiting for its notification |
| Idle gap with nothing visible after it, or a command that ran far past its timeout | The machine was asleep or overloaded | Keep the machine awake; run fewer agents at once; run heavy checks elsewhere |
| Idle gap that ended when its own background task finished | It waited on itself | Run the command in the foreground with a timeout, or keep working while it runs |
| Browser + tests + checks + waiting over 35 % | A check loop re-run after every fix | One check pass at the end with a time cap; re-run only what failed; reuse a running server; delegate the check pass |
| Model work over 55 %, output over 150K | The unit is big | Split it into agents that own different files, or let the agent delegate (below) |
| Peak context over 300K, more than 150 calls | Every call re-reads a lot | Give `file:line` pointers in the brief; cap tool output; batch edits; delegate exploration |
| Effort `high` or `xhigh` on mechanical work | Thinking spent where none is needed | Lower the effort for that unit |

## Let the agent delegate

Give a large unit of work to one agent, which owns its files and its result. That agent may still
hand off parts. In Claude Code a subagent usually has the Agent tool, but it rarely uses it unless
the brief says so. In the worked example, all 23 agents had the tool and none used it.

Say in the brief:

- **When to delegate:** a part is independent and would take 10 minutes or more. For example:
  - a verification pass (browser or screenshots at several sizes);
  - an exploration where only the conclusion is needed;
  - a change to one area with its own files.
- **How:**
  - brief the helper fully, using the contract in `subagent-briefs.md`;
  - give it different files, or its own worktree for edits;
  - ask for conclusions, not file dumps;
  - use lower effort for mechanical parts;
  - run independent helpers in parallel.
- **When not to:**
  - parts that need the same large files the agent has already read, because re-reading them is the
    cost a large unit saves;
  - small edits;
  - anything load-bearing that the agent would then not check itself.
- **Limits:** a maximum number of helpers, one level deep. The agent stays responsible for the
  result and reports what each helper did.

A section to paste into a brief:

```
## Delegation
You may hand parts of this task to your own subagents (Agent tool) when a part is independent and
would take you 10+ minutes: e.g. the browser check pass, or <area> with its own files. Brief each
one fully (it starts blind), give it disjoint files or its own worktree, and ask for conclusions.
At most 3, no further nesting. You own the result: check what they return and list it in your report.
```

## Budgets in the brief

Set each budget from the last similar run:

- **Size:** "About 45 minutes of work. Past 75 minutes or 250K output tokens, stop and report what is
  left."
- **Verification:** "One browser pass at the end, at most 10 minutes, three widths. Re-run only the
  views that failed."
- **Waiting:** "Don't poll in sleep loops. Run long commands in the foreground with a timeout, or in
  the background while you keep working."
- **Machine:** on one laptop, run at most two or three agents with heavy checks at the same time.

## Worked example

One session ran 13 agents of 30 minutes or more on one laptop, all at effort `xhigh`.

- **Overall:** 694 minutes of wall time, split into model work 56 %, tools 36 % and idle 9 %. 2.4M
  output tokens in total.
- **Tests:** 0.2 to 4.5 minutes per agent, so not the cause.
- **106 minutes, verification-bound:** browser checks took 37 minutes because they re-ran after
  every fix. The agent also wrote 301K output tokens.
- **98 minutes, verification-bound:** 42 minutes were spent waiting on screenshot runs. One wait
  limited to 3 minutes took 18, because the machine stalled.
- **81 minutes, stalled:** 53 minutes idle until a message arrived. The work itself took 28 minutes.

What changed afterwards:

- one check pass at the end, with a time cap;
- a look at any agent quiet for about 20 minutes;
- units that would produce more than about 150K output tokens are split;
- the brief allows delegation.

## Judge the outcome too

Time is half the picture: a fast run that has to be redone is the slowest. For each run, check:

- Was the done-condition met? See the checklist in `subagents.md`.
- Did the deviations report hold up?
- How many minutes did the integrator spend fixing or redoing the work?

Track the cost per accepted change: wall minutes and output tokens per merged unit. To evaluate the
model's behaviour itself (trajectories, judges), see `devkit:agent-development` →
`references/eval-foundations.md`.

## Related

- `subagents.md`: the decompose → delegate → verify → integrate loop.
- `subagent-briefs.md`: the brief, its stop conditions, and where the delegation and budget sections
  go.

---
description: List the devkit skill sections and how to load each one on demand.
argument-hint: "[optional: a section name to load directly, e.g. agent-development]"
---

You are the devkit menu. Your job is to help the user pick and load a skill **section**. A
section is a group of related skills exposed by one command.
**Do not read or load any pack/skill file as part of showing this menu** — sections stay out of
context until the user explicitly loads one.

If the user passed an argument that clearly names a section (`agent-development`, `subagents`,
or `docs`), skip the menu and run that section's loader (follow the behavior in the
corresponding loader command: read the section's `INDEX.md` if it has one, then the relevant
`SKILL.md` files under `${CLAUDE_PLUGIN_ROOT}/packs/`).

Otherwise, present this menu to the user verbatim (adjust formatting only):

---

**devkit skill sections** — each loads only when you call its command:

| Command | Section | What it gives you |
| --- | --- | --- |
| `/agent-development` | Agent development | Building agents & workflows with LangChain + LangGraph together — plus combining them, workflow design, and a troubleshooting log. (5 skills) |
| `/subagents` | Subagent-driven development | A methodology for decomposing work and orchestrating subagents (explore → plan → implement → verify). |
| `/docs` | Documentation | A method for writing a short README that links to per-section docs so the project is easy to navigate. |

Each loader also accepts an optional task, e.g.
`/agent-development build an agent that queries Postgres`. `/agent-development` also accepts a
skill to focus, e.g. `/agent-development workflow-design`.

Other commands: `/scaffold` — start a project/component from a bundled template (e.g. a
LangGraph or LangChain starter) and adapt it to your task.

Related subagents you can dispatch: `agent-developer`, `doc-writer`.

---

Then stop and wait for the user to choose. Do not load a section unless asked.

Argument (optional): $ARGUMENTS

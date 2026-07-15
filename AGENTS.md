# AGENTS.md

This repository is **Dolle devkit** — a Claude Code plugin of command-gated skill *sections*
for AI-assisted development. If you are an agent other than Claude Code (Codex, Cursor, etc.),
you can't use the `/`-commands, but you can use the skills directly: each is a self-contained
Markdown file.

## Skill sections (read the relevant skill before working on that topic)

**Agent development** — `plugins/devkit/packs/agent-development/`. Start with `INDEX.md`, then
read the skills you need. LangChain and LangGraph are used together here.

| Topic | Read this file |
| --- | --- |
| Building a LangChain agent (models, tools, structured output) | `agent-development/langchain-agents/SKILL.md` |
| Building a LangGraph workflow (StateGraph, routing, persistence) | `agent-development/langgraph-workflows/SKILL.md` |
| How LangChain + LangGraph fit together | `agent-development/combining-langchain-and-langgraph/SKILL.md` |
| How to construct/design a workflow | `agent-development/workflow-design/SKILL.md` |
| An error during development (and to log a new one) | `agent-development/troubleshooting/SKILL.md` |

**Subagent-driven development** — `plugins/devkit/packs/subagent-driven-development/SKILL.md`.
Orchestrating subagents / decomposing large tasks.

**Documentation** — `plugins/devkit/packs/documentation/SKILL.md`. Writing or updating docs.

Load a skill only when the current task matches it — don't read everything up front.

## Conventions for changes in this repo

- Documentation follows the method in `plugins/devkit/packs/documentation/SKILL.md`: keep
  `README.md` short and link out to `docs/`; update the README doc index whenever you add or
  remove a doc.
- New skills go in `plugins/devkit/packs/<section>/<skill>/SKILL.md` and get listed in the
  section's `INDEX.md`; new sections also get a loader command and a `/devkit` menu row. See
  `docs/extending.md`.
- Hooks are Node scripts under `plugins/devkit/hooks/scripts/` for cross-platform behavior.

## Human docs

Start at `README.md`, which links every doc in `docs/`.

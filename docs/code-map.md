---
title: Code map
description: >-
  A map of where the major parts of the project live in the repository — commands, skill
  sections, subagents, hooks, and the docs tooling. Points to large entities and their paths,
  not line-level details.
order: 40
---

# Code map

Where the large parts of this project live. This is a directory of neighborhoods, not a
street index — it names subsystems and their locations, not individual functions.

## Plugin manifest & marketplace

- `/.claude-plugin/marketplace.json` — the marketplace listing (name `dolle`) that Claude Code
  installs from; lists the `devkit` plugin and its path.
- `/plugins/devkit/.claude-plugin/plugin.json` — the plugin manifest (name, version, metadata).

## Commands (the public API / loaders)

`/plugins/devkit/commands/` — one Markdown file per slash command.

- `devkit.md` — the menu that lists sections without loading them.
- `agent-development.md`, `subagents.md`, `docs.md`, `ui-ux-design.md` — section loaders that
  read pack content into context on demand.
- `scaffold.md` — copies a bundled template into the workspace and adapts it.

## Index skill (auto-loaded)

`/plugins/devkit/skills/catalog/SKILL.md` — the only skill Claude Code auto-discovers. Its
description loads at startup; its body maps each task to the pack file Claude should read, so
Claude can load the right guidance on its own without a manual loader command.

## Skill sections (the knowledge)

`/plugins/devkit/packs/` — command-gated skill content, **not** auto-loaded at startup.

- `agent-development/` — multi-skill section: `INDEX.md` catalog plus `langchain-agents/`,
  `langgraph-workflows/`, `combining-langchain-and-langgraph/`, `workflow-design/`,
  `troubleshooting/`, each a `SKILL.md`. Its `templates/` holds runnable starters
  (`langgraph-workflow`, `langchain-agent`) that `/scaffold` copies and adapts.
- `subagent-driven-development/SKILL.md` — single-skill section.
- `documentation/SKILL.md` — single-skill section; its `assets/` holds the doc-index templates.
- `ui-ux-design/SKILL.md` — single-skill section; web design driven by the external Dolle-MCP
  server, layered on the `frontend-design` skill.
- `web-performance/SKILL.md` — single-skill section; Core Web Vitals (LCP/CLS/INP), measuring,
  the per-metric fix playbook, and budgets.

## Subagents

`/plugins/devkit/agents/` — dispatchable subagents.

- `agent-developer.md` — builds LangChain + LangGraph agents/workflows.
- `doc-writer.md` — writes/updates docs using the documentation method.
- `web-designer.md` — runs the Dolle-MCP-driven build/verify loop from a settled design spec;
  granted the `mcp__dolle-mcp__*` tools plus the file tools.

## Hooks

`/plugins/devkit/hooks/` — lifecycle automation.

- `hooks.json` — registers the `SessionStart` and `UserPromptSubmit` hooks.
- `scripts/session-start.mjs` — injects the "run /devkit" reminder.
- `scripts/suggest-pack.mjs` — suggests a section when a prompt matches its topics.

## Docs tooling (this documentation system)

- `/scripts/generate-doc-index.mjs` — scans `docs/`, reads each doc's `description`
  frontmatter, and rewrites the README index between the `DOC-INDEX` markers.
- `/.github/workflows/docs-index.yml` — GitHub Action that runs the generator and commits the
  synced README.
- `/.github/workflows/docs-index.reusable.yml` — the same, exposed as a reusable workflow so
  other repos adopt it with a one-line caller (see the documentation skill).
- `/package.json` — exposes the generator as a `bin` so any repo can run it via
  `npx github:OliverDolle/Dolle`.
- `/docs/` — the per-section docs themselves (including this file).

## Related

- [Architecture](architecture.md) — how these parts work together at runtime.
- [Extending](extending.md) — how to add new pieces in the right place.

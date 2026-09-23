---
title: Code map
description: >-
  A map of where the major parts of the project live in the repository — the five skill hubs and
  their references, commands, subagents, templates, hooks, and the docs tooling. Points to large
  entities and their paths, not line-level details.
order: 40
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

# Code map

Where the large parts of this project live. A directory of neighborhoods, not a street index.

## Plugin manifest & marketplace

- `/.claude-plugin/marketplace.json` — the marketplace listing (name `dolle`) Claude Code installs
  from; lists the `devkit` plugin and its path.
- `/plugins/devkit/.claude-plugin/plugin.json` — the plugin manifest (name, version, metadata).

## Skill hubs (the knowledge — and the public API)

`/plugins/devkit/skills/` — **five** directories, the only registered skills. Each holds a `SKILL.md`
router plus a `references/` folder read on demand (40 references in all).

- `agent-development/` — AI agents and LLM features. References: `langchain-agents`,
  `langgraph-workflows`, `combining-langchain-and-langgraph`, `workflow-design`, `prompt-engineering`,
  `speech-to-text`, `text-to-speech`, the evals (`eval-foundations`, `llm-as-judge`, `eval-harness-ci`,
  `langgraph-workflow-evals`, `tracing-observability`), `troubleshooting`.
- `design/` — any UI. References: `ui-fundamentals` (craft of one screen, §0 aesthetic direction),
  `anti-slop`, `structural-variety`, `type-and-color`, `surfaces-and-details`,
  `motion-and-interaction`, `data-visualization`, `design-systems` (tokens, theming, component
  library, handoff), `web-dolle-mcp` (building web UI on the Dolle-MCP server), `desktop-native`
  (Qt/GTK/WinUI platform layer), `web-performance` (Core Web Vitals).
- `shipping/` — packaging and deploying. References: `containerization`, `kubernetes`,
  `kubernetes-gitops`, `cloud-infrastructure`, `github-actions`, `azure-devops`.
- `engineering/` — debugging, architecture, databases, firmware. References: `systematic-debugging`,
  `extensible-architecture`, `data-modeling`, `database-operations`, `esp32`.
- `process/` — how to run the work. References: `prompt-enhancement`, `app-prompt`, `subagents`,
  `subagent-briefs`, `documentation`. Its `assets/` folder holds the doc-index automation other repos
  copy.

Sizes: routers 1.3–2.5 KB, references 4–33 KB, 98.2 % of content deferred to references.

## Commands (behavior, not loading)

`/plugins/devkit/commands/` — one Markdown file per slash command. Guidance is never here.

- `devkit.md` — the menu listing the five hubs and their references without loading one. User-only
  (`disable-model-invocation: true`), so it costs nothing at startup.
- `scaffold.md` — copies a bundled template into the workspace and adapts it. Model-invocable —
  routers point at it.
- `mcp-preview-server.md` — starts the bundled Dolle-MCP preview server and prints its URL. User-only.

## Templates

`/plugins/devkit/templates/` — runnable starters (`langgraph-workflow`, `langchain-agent`,
`promptfoo-eval-ci`, `cicd-starters`), each with a `TEMPLATE.md` manifest, that `/scaffold` copies into a project and adapts.

## Subagents

`/plugins/devkit/agents/` — each granted the **Skill** tool so it loads its own hub instead of
reading files by path.

- `agent-developer.md` — builds LangChain + LangGraph agents/workflows; loads
  `devkit:agent-development`.
- `doc-writer.md` — writes/updates docs; loads `devkit:process` →
  `references/documentation.md`.
- `web-designer.md` — runs the Dolle-MCP build/verify loop from a settled design spec; loads
  `devkit:design` → `references/web-dolle-mcp.md`. Has no `tools:` list, so it inherits the session's
  Dolle-MCP tools under whatever namespace the host uses.
- `app-prompt-engineer.md` — compiles a settled app brief into a build-ready spec (or audits one);
  loads `devkit:process` → `references/app-prompt.md`.

## Hooks

`/plugins/devkit/hooks/` — lifecycle automation.

- `hooks.json` — registers the `SessionStart` and `UserPromptSubmit` hooks.
- `scripts/session-start.mjs` — one ~170 B line: call the matching hub before the work, read one
  reference. Paid every session, so kept tiny.
- `scripts/suggest-pack.mjs` — keyword groups per hub (all 40 references), each carrying the reference
  its keywords point at, so a hint names `devkit:<hub> (references/<file>.md)` rather than just the
  hub. Matches on word boundaries; silent when nothing matches.

## Docs tooling (this documentation system)

- `/scripts/generate-doc-index.mjs` — scans `docs/`, reads each doc's `description` frontmatter, and
  rewrites the README index between the `DOC-INDEX` markers.
- `/.github/workflows/docs-index.yml` — Action that runs the generator and commits the synced README.
- `/.github/workflows/docs-index.reusable.yml` — the same as a reusable workflow so other repos adopt
  it with a one-line caller (see the `documentation` reference).
- `/package.json` — exposes the generator as a `bin` for `npx github:OliverDolle/Dolle`; `npm run
  check` runs `scripts/check-agent-tools.mjs`, which guards agent `tools:` lists and stray
  `</content>` lines.
- `/docs/` — the per-section docs themselves (including this file).

## Related

- [Architecture](architecture.md) — how these parts work together at runtime.
- [Extending](extending.md) — how to add new pieces in the right place.

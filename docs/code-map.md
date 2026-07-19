---
title: Code map
description: >-
  A map of where the major parts of the project live in the repository — commands, skill
  sections, subagents, hooks, and the docs tooling. Points to large entities and their paths,
  not line-level details.
order: 40
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

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
- `agent-development.md`, `subagents.md`, `docs.md`, `ui-ux-design.md`, `web-performance.md`,
  `ui-design.md`, `gui-design.md`, `containerization.md`, `kubernetes.md`,
  `cloud-infrastructure.md`, `prompt-enhancement.md`, `app-prompt.md` — section loaders that read
  pack content into context on demand.
- `scaffold.md` — copies a bundled template into the workspace and adapts it.
- `mcp-preview-server.md` — starts the bundled Dolle-MCP preview server and prints its URL.

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
- `ui-design/` — multi-skill section: `INDEX.md` plus `fundamentals/SKILL.md` (tool-agnostic UI
  craft — hierarchy, spacing/type scales, semantic color + contrast, component/content states,
  forms, accessibility, checklist) and `design-systems/SKILL.md` (tokens, theming, component
  library, dev handoff).
- `gui-design/SKILL.md` — single-skill section; native/desktop GUI design (platform HIG, window/
  menu/toolbar structure, keyboard model, resizable layout, HiDPI, native feel, responsive UI
  thread, desktop accessibility), Qt as the worked example.
- `containerization/SKILL.md` — single-skill section; Docker & Compose (multi-stage builds, small
  non-root images, layer caching, healthchecks, size/security).
- `kubernetes/SKILL.md` — single-skill section; K8s workloads, config/secrets, resources, probes,
  autoscaling, rollouts, and Kustomize/Helm.
- `cloud-infrastructure/SKILL.md` — single-skill section; CI/CD, Terraform/IaC, cloud compute
  targets, OIDC auth, secrets, and observability.
- `prompt-enhancement/SKILL.md` — single-skill section; turning a vague request into a precise
  prompt (diagnose gaps, ask-vs-assume, clarify with AskUserQuestion, sharpen and restate).
- `app-prompt/SKILL.md` — single-skill section; turning a rough app idea into a build-ready spec
  (AskUserQuestion brief across the app's axes, compiled into a fixed sectioned template with a
  phased build order and handoff). Specializes prompt-enhancement for app creation.

## Subagents

`/plugins/devkit/agents/` — dispatchable subagents.

- `agent-developer.md` — builds LangChain + LangGraph agents/workflows.
- `doc-writer.md` — writes/updates docs using the documentation method.
- `web-designer.md` — runs the Dolle-MCP-driven build/verify loop from a settled design spec;
  granted the `mcp__dolle-mcp__*` tools plus the file tools.
- `app-prompt-engineer.md` — compiles a settled app brief into a build-ready spec (or audits an
  existing one) off the main thread, following the app-prompt template; file tools only.

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

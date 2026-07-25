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
- `agent-development.md`, `agent-evaluation.md`, `subagents.md`, `docs.md`, `ui-ux-design.md`,
  `web-performance.md`, `ui-design.md`, `gui-design.md`, `extensible-architecture.md`,
  `database-design.md`, `systematic-debugging.md`, `containerization.md`, `kubernetes.md`,
  `cloud-infrastructure.md`, `deployment-pipelines.md`, `speech-interfaces.md`, `esp32.md`,
  `prompt-enhancement.md`, `prompt-engineering.md`, `app-prompt.md` — section loaders that read
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
- `agent-evaluation/` — multi-skill section: `INDEX.md` plus `eval-foundations/`, `llm-as-judge/`,
  `eval-harness-ci/`, `tracing-observability/`, and `langgraph-workflow-evals/` (LangChain/LangGraph-
  specific), each a `SKILL.md`. Its `templates/promptfoo-eval-ci/` is a runnable eval-in-CI starter.
  The quality-gate complement to `agent-development`.
- `subagent-driven-development/` — multi-skill section: `INDEX.md` plus `orchestration/SKILL.md`
  (the decompose → delegate → verify → integrate methodology) and
  `writing-subagent-instructions/SKILL.md` (the craft of the brief each subagent runs on).
- `documentation/SKILL.md` — single-skill section; its `assets/` holds the doc-index templates.
- `ui-ux-design/SKILL.md` — single-skill section; web design driven by the external Dolle-MCP
  server; design-craft base is `ui-design` §0 (external `frontend-design` optional).
- `web-performance/SKILL.md` — single-skill section; Core Web Vitals (LCP/CLS/INP), measuring,
  the per-metric fix playbook, and budgets.
- `ui-design/` — multi-skill section: `INDEX.md` plus `anti-slop/SKILL.md` (the named AI-default
  tells with fixes, escape moves, audit report format, six-axis pre-emit self-critique, 40-question
  gate sweep), `fundamentals/SKILL.md` (tool-agnostic UI craft — hierarchy, spacing/type scales,
  semantic color + WCAG 2.2 contrast, component/content states, forms, accessibility, checklist),
  `structural-variety/SKILL.md` (page shape: six axes, ~20 named shapes, nav/footer archetypes, hero
  fit + enrichment tiers, section rhythm, stamp-then-differ), `type-and-color/SKILL.md` (type pairing
  rule + free foundry-grade catalog, scales/measure/numerals, OKLCH palette layers, accent ≤5%,
  dark-mode recipe, the contrast pairs that fail, themes as named bundles),
  `surfaces-and-details/SKILL.md` (the containment ladder so cards stop being the reflex, radius as one
  committed language, hairline/elevation discipline, optical padding, a three-surface limit, and the
  1px detail layer — text-wrap, focus-ring geometry, selection/caret/scrollbar, reserved slots, honest
  cursors), `design-systems/SKILL.md` (tokens, theming,
  component library, dev handoff), `data-visualization/SKILL.md` (charts & dashboards), and
  `motion-and-interaction/SKILL.md` (animation & micro-interactions + the named motion tells).
- `gui-design/SKILL.md` — single-skill section; native/desktop GUI design (platform HIG, window/
  menu/toolbar structure, keyboard model, resizable layout, HiDPI, native feel, responsive UI
  thread, desktop accessibility), Qt as the worked example.
- `containerization/SKILL.md` — single-skill section; Docker & Compose (multi-stage builds, small
  non-root images, layer caching, healthchecks, size/security).
- `kubernetes/` — multi-skill section: `INDEX.md` plus `workloads/SKILL.md` (workloads, config/
  secrets, resources, probes, autoscaling, rollouts, Kustomize/Helm, pod debugging) and
  `deployment-and-gitops/SKILL.md` (the deploy/rollout loop, progressive delivery via Argo
  Rollouts/Flagger, and GitOps via Argo CD/Flux).
- `cloud-infrastructure/SKILL.md` — single-skill section; CI/CD, Terraform/IaC, cloud compute
  targets, OIDC auth, secrets, and observability.
- `deployment-pipelines/` — multi-skill section: `INDEX.md` plus `github-actions/SKILL.md` and
  `azure-devops/SKILL.md` (platform mechanics), and `templates/cicd-starters/` (starter workflow
  YAML). The concrete-YAML companion to `cloud-infrastructure`'s vendor-neutral concepts.
- `database-design/` — multi-skill section: `INDEX.md` plus `data-modeling/SKILL.md` (schema,
  normalization, SQL-vs-NoSQL, ORM patterns) and `operations-and-tuning/SKILL.md` (indexing,
  migrations, pooling, transactions, security, backups).
- `extensible-architecture/SKILL.md` — single-skill section; writing code that extends without
  rewrites (boundaries, dependency inversion, open-closed, ports-and-adapters, extension points,
  SemVer contracts, seams, feature flags).
- `systematic-debugging/SKILL.md` — single-skill section; a method for debugging any failing
  program/flaky test/incident (reproduce, read the error, hypothesis-per-change, bisect, the right
  instrument, confirm root cause before fixing).
- `speech-interfaces/` — multi-skill section: `INDEX.md` plus `speech-to-text/SKILL.md` and
  `text-to-speech/SKILL.md` (engine option matrices, streaming vs. batch, SSML/prosody, latency &
  cost, integration patterns).
- `esp32/SKILL.md` — single-skill section; ESP32/embedded-board tips (toolchains, flashing &
  upload-failure fixes, dual-core FreeRTOS task pinning, GPIO/strapping gotchas, brownout, deep
  sleep, serial/JTAG debugging).
- `prompt-engineering/SKILL.md` — single-skill section; the craft of an effective prompt/system
  prompt (structure, few-shot, reasoning models, structured output, prompt patterns, eval-driven
  iteration). Distinct from `prompt-enhancement` (which sharpens the user's request).
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

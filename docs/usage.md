---
title: Usage
description: >-
  Day-to-day use of devkit: the /devkit menu, loading skill sections on demand, dispatching the
  bundled subagents, and what the two hooks do. Explains why loading is command-gated and how it
  works identically in the CLI and the desktop app.
order: 20
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

# Usage

> Day-to-day use of devkit: the menu, loading sections, dispatching subagents, and the hooks —
> in both the CLI and the desktop app.

## Overview

devkit's defining behavior: **skill sections are not loaded until you ask for them.** At startup
you only get lightweight command names. When you run a loader command, that section's guidance
is read into the current session and applied. This keeps context small and relevant.

## The menu

```
/devkit
```

Shows every section and the command that loads it. Showing the menu loads *no* section content.
You can also jump straight in: `/devkit agent-development`.

## Loading a section

Each section has a loader command. Run it alone to load the guidance, or pass a task to load and
start immediately:

| Command | Loads |
| --- | --- |
| `/agent-development` | Agent development — LangChain + LangGraph, combining them, workflow design, troubleshooting |
| `/subagents` | Subagent-driven development methodology |
| `/docs` | The documentation method |
| `/ui-ux-design` | UI/UX design via the Dolle-MCP server (templates, palettes, contrast, SVG, screenshots) |
| `/web-performance` | Web performance — Core Web Vitals (LCP, CLS, INP), measuring, fixes, budgets |
| `/ui-design` | UI design craft (2 skills) — *fundamentals* (hierarchy, spacing/type scales, semantic color & contrast, component/content states, forms, a11y, checklist) and *design-systems* (tokens, theming, component library, dev handoff) |
| `/gui-design` | GUI design (native/desktop) — platform HIG, window/menu/toolbar structure, keyboard model, resizable layout, HiDPI, native feel & OS dark mode, responsive UI thread, desktop a11y; Qt as the worked example |
| `/containerization` | Docker & Compose — multi-stage builds, small non-root images, layer caching, healthchecks, size/security checklist |
| `/kubernetes` | Kubernetes — Deployments/Services/Ingress, config/secrets, resources, probes, autoscaling, safe rollouts, Kustomize/Helm |
| `/cloud-infrastructure` | CI/CD, Terraform/IaC, cloud compute targets, OIDC auth, secrets, observability |
| `/prompt-enhancement` | Turn a vague request into a precise prompt — diagnose gaps, clarify with AskUserQuestion, sharpen and restate |

Examples:

```
/agent-development                                   # load the section (index + core skills)
/agent-development build an agent that queries Postgres
/agent-development workflow-design                   # focus one skill in the section
/docs document this project
```

`/agent-development` is deliberately broad: LangChain and LangGraph are used together, so the
loader pulls in both (plus how to combine them) rather than forcing you to pick. It reads the
section index first, then the skills relevant to your task.

If a command name collides with another plugin, use the namespaced form, e.g.
`/devkit:agent-development`.

## Other commands

Beyond the section loaders and `/devkit` menu:

| Command | Does |
| --- | --- |
| `/scaffold` | Start a project/component from a bundled template (e.g. a LangGraph or LangChain starter) and adapt it to your task. |
| `/mcp-preview-server` | Start the bundled Dolle-MCP live preview server (if it isn't running) and print its gallery URL — so you don't have to remember it or ask each time. Optionally pass a template id (e.g. `/mcp-preview-server charts`) to open it in the browser. |

`/mcp-preview-server` relies on the **Dolle-MCP** server, which devkit bundles and registers
automatically (see [Installation](installation.md#bundled-mcp-server-dolle-mcp)).

## Automatic loading (the catalog skill)

You don't have to load a section by hand. devkit ships one lightweight, always-available skill —
`devkit:catalog` — whose description sits in context at startup (the pack content does not). It
is a map of every section and the exact skill file to read for a given task. When your request
matches, Claude consults it and reads the relevant `SKILL.md`(s) on its own — e.g. ask to
"build a LangGraph workflow" and it can pull the agent-development guidance without you running
`/devkit:agent-development`.

The loader commands remain the **manual** override: use them to force a specific section into
context regardless of what Claude infers. Both paths keep heavy content out of startup — only
the catalog's one-line description is ever loaded up front.

## Subagents

Three subagents ship with devkit and can be dispatched for larger jobs:

- **`agent-developer`** — designs and builds LangChain + LangGraph agents/workflows, and
  debugs them against the troubleshooting log.
- **`doc-writer`** — creates/updates documentation following the documentation method.
- **`web-designer`** — takes a settled design spec and runs the Dolle-MCP-driven build/verify
  loop (templates, palettes, screenshots) off the main thread.

Ask naturally ("use the agent-developer subagent to build the ingestion workflow") or let
Claude pick them based on their descriptions. They read their section automatically, so you
don't have to load it first.

## Hooks

Two hooks make the lazy-loading system discoverable without adding noise:

- **SessionStart** — injects a one-line reminder that `/devkit` exists and sections load on
  demand.
- **UserPromptSubmit** — if your prompt mentions a section's topic (e.g. "langgraph"), it adds
  a short hint suggesting the matching loader. It stays silent on unrelated prompts.

Both are Node scripts under `plugins/devkit/hooks/scripts/`, so they behave the same on
Windows, macOS, and Linux. To disable them, remove the entries from
`plugins/devkit/hooks/hooks.json`.

## Desktop vs. CLI

There is no functional difference. Commands, subagents, and hooks work identically; the desktop
app just gives you a graphical command menu instead of typing `/`-commands into a terminal.

## Related

- [Skill sections](skill-packs.md) — what each section teaches.
- [Architecture](architecture.md) — why loading is command-gated.
- [Extending](extending.md) — add your own skills and sections.

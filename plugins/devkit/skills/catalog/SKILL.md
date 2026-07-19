---
name: catalog
description: "Consult BEFORE building UI (web or native/desktop), writing a Dockerfile or Kubernetes manifest, designing a LangChain/LangGraph agent, optimizing web performance, documenting a project, or scaffolding — do not work from memory when a devkit section covers the task. Maps the request to the right section (agent development, subagent-driven dev, documentation, UI/UX web design, UI-craft & design systems, native/desktop GUI design, web performance, containerization, Kubernetes, cloud infra, prompt enhancement, app-creation spec, scaffolding) and names the exact file to read."
---

# devkit skill catalog

This is the index of devkit's bundled skills. When a task matches any entry below, **read that
skill file before doing the work** — do not improvise from memory when a section covers it. You
do not need the user to run a loader command: read the file directly, or invoke the matching
`devkit:` command (its description carries the same trigger).

The skills live under this plugin at `${CLAUDE_PLUGIN_ROOT}/packs/`. Read the specific
`SKILL.md`(s) for the task; read more than one when they apply (e.g. LangChain **and**
LangGraph, which are used together). Reading a catalog entry does not load the others — pull in
only what the task needs.

## Agent development — build agents & workflows (LangChain + LangGraph)

Section index: `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/INDEX.md`

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/langchain-agents/SKILL.md` | Creating a tool-using LangChain agent (models, tools, structured output, memory). |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/langgraph-workflows/SKILL.md` | A stateful/multi-step workflow — routing, loops, persistence, human-in-the-loop. |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/combining-langchain-and-langgraph/SKILL.md` | Deciding which to use, or using both together. |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/workflow-design/SKILL.md` | Structuring a non-trivial workflow before coding. |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/troubleshooting/SKILL.md` | Debugging a LangChain/LangGraph error. |

## Subagent-driven development

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/subagent-driven-development/SKILL.md` | Decomposing a large task and orchestrating subagents (explore → plan → implement → verify). |

## Documentation

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/documentation/SKILL.md` | Creating or updating project documentation (short README + linked per-section docs + code map). |

## UI/UX design

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/ui-ux-design/SKILL.md` | Designing or reshaping a web page/site — drives the `dolle-mcp` MCP tools (templates, curated palettes, WCAG contrast, gradients, SVG segmentation/tracing, screenshots) and runs a design brief first. Layers on the `frontend-design` skill. |

## Web performance

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/web-performance/SKILL.md` | Making a page fast — Core Web Vitals (LCP, CLS, INP), measuring lab + field, the per-metric fix playbook, and JS/image/font/third-party budgets. |

## UI design — craft (fundamentals + design systems)

Section index: `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/INDEX.md`

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/fundamentals/SKILL.md` | Designing or reviewing the *craft* of a single UI (tool-agnostic) — visual hierarchy, spacing/type scales, semantic color + WCAG contrast, the full set of component states, the four content states, forms, feedback, responsive layout, accessibility, and a review checklist. |
| `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/design-systems/SKILL.md` | Making that craft *repeatable* across a product — design tokens (primitive → semantic → component tiers), building the color/type/spacing/elevation/motion scales into tokens, theming (light/dark, multi-brand), a component library (variants × states), governance, and the token-based design-to-dev handoff. Read when the work outlives one screen. |

Complements `ui-ux-design` (Dolle-MCP build workflow), `gui-design` (native/desktop), and
`frontend-design` (aesthetic direction).

## GUI design — native & desktop

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/gui-design/SKILL.md` | Designing/reviewing a native desktop app (Qt, GTK, WinUI, wxWidgets) — the platform HIG (Apple/Windows/GNOME), window & app structure (menu bar, toolbar, status bar, dialogs, SDI/MDI), menus & the command model, the desktop keyboard model (mnemonics, accelerators, default/cancel), resizable layout via layout managers, HiDPI & system fonts, native feel + OS dark mode, keeping the UI thread responsive (undo/redo, unsaved-changes), and desktop accessibility via the platform a11y API. Sits on top of the UI-design craft skills. |

## Containerization

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/containerization/SKILL.md` | Writing/fixing a Dockerfile or Compose stack — multi-stage builds, small non-root images, layer-cache ordering, `.dockerignore`, healthchecks, secrets handling, and image size/security. |

## Kubernetes

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/kubernetes/SKILL.md` | Deploying/configuring on K8s — Deployments/Services/Ingress, ConfigMaps & Secrets, resource requests/limits, liveness/readiness/startup probes, HPA, safe rollouts, security context, and Kustomize/Helm; debugging a pod that won't run. |

## Cloud infrastructure (CI/CD, IaC & platforms)

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/cloud-infrastructure/SKILL.md` | Building a CI/CD pipeline, authoring Terraform/IaC, choosing a cloud compute target (serverless/containers/PaaS/K8s), OIDC cloud auth, managing secrets/config across environments, or adding observability. |

## Prompt enhancement

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/prompt-enhancement/SKILL.md` | Turning a vague or underspecified request into a precise prompt — diagnosing missing goal/context/constraints/success-criteria, deciding when to ask vs. assume, clarifying with **AskUserQuestion**, and restating a sharpened prompt before doing the work. |

## App prompt engineering (idea → build-ready spec)

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/app-prompt/SKILL.md` | Turning a rough application idea into a complete, build-ready spec a receiving agent can execute without guessing — an **AskUserQuestion** interview across the app's axes (type/platform, users/auth, features & MVP scope, data, integrations, stack, non-functional, deployment, success criteria), compiled into a fixed sectioned template with a phased build order and an explicit handoff. Specializes `prompt-enhancement` for app creation; the `app-prompt-engineer` agent compiles/audits the spec off the main thread. |

## Scaffolding templates

Runnable starters live under `${CLAUDE_PLUGIN_ROOT}/packs/agent-development/templates/`
(`langgraph-workflow`, `langchain-agent`), each with a `TEMPLATE.md`. To start a project from
one, follow the `/devkit:scaffold` behavior: copy the template's files (except `TEMPLATE.md`)
into the target, replace placeholders, and adapt it to the task.

## If a path doesn't resolve

If `${CLAUDE_PLUGIN_ROOT}` isn't expanded in your environment, the files are in this plugin's
directory (the same install dir this skill was loaded from) — locate them with Glob
(e.g. `**/dolle/devkit/**/packs/**/SKILL.md`), or invoke the matching loader skill instead:
`devkit:agent-development`, `devkit:subagents`, `devkit:docs`, `devkit:ui-ux-design`,
`devkit:web-performance`, `devkit:ui-design`, `devkit:gui-design`, `devkit:containerization`,
`devkit:kubernetes`, `devkit:cloud-infrastructure`, `devkit:prompt-enhancement`,
`devkit:app-prompt`, or `devkit:scaffold`.

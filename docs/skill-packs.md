---
title: Skill hubs
description: >-
  The four devkit hubs, the references inside each, and what every reference covers. Explains the
  router-plus-references shape that keeps startup context to four descriptions and loads only the
  depth a task needs.
order: 30
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

# Skill hubs

> The four hubs, what each reference covers, and when to reach for it.

## Overview

devkit ships **four registered skills**, called hubs. A hub's `SKILL.md` is a **router**: one row per
`references/*.md` saying when to read it. Invoking a hub loads only that router (1.4–1.8 KB); the
depth is read on demand, one reference at a time.

```
skills/<hub>/
├── SKILL.md        # invoked -> router arrives in context, no file read
└── references/     # read on demand, only when a row matches the task
    └── *.md
```

Only the four descriptions sit in startup context — **2,273 bytes (~568 tokens)** total. **95.7 %** of
the content is behind references. See [Architecture](architecture.md) for why.

**Never read a devkit `SKILL.md` off disk.** Invoke the hub; the router arrives free. References are
the only devkit files meant to be read, and only from inside the hub that owns them.

## `devkit:agent-development`

Building agents and workflows. LangChain and LangGraph are used **together** — LangChain supplies
models, tools, prompts, and output parsers; LangGraph supplies the stateful control flow.

| Reference | Covers |
| --- | --- |
| `langchain-agents` | Chat models, LCEL chains, `@tool`, `create_tool_calling_agent` + `AgentExecutor`, structured output, conversation memory, streaming, and when to graduate to LangGraph. |
| `langgraph-workflows` | `StateGraph`, typed state with reducers, conditional edges/loops, the prebuilt ReAct agent, checkpointer persistence, `interrupt()` for human-in-the-loop, streaming, subgraphs. |
| `combining-langchain-and-langgraph` | The mental model (components vs. orchestration), which to reach for when, a combined end-to-end example, integration patterns, pitfalls. |
| `workflow-design` | Graph shape, state modeling, node granularity, explicit control flow, reliability (retries/timeouts/fallbacks), observability, testing, deployment, design checklist. |
| `troubleshooting` | A living log of LangChain/LangGraph errors and fixes — imports after the 0.3 split, `agent_scratchpad`, ignored tools, `GraphRecursionError`, overwritten state, `interrupt()` not pausing, async/sync mismatch. **Append to it.** |

Standing rules in the router: fast path first (`create_react_agent` before a custom `StateGraph`),
a hard exit on every loop, verify signatures against what's installed.

Usage: `/devkit:agent-development` or `/devkit:agent-development build an agent that queries Postgres`.

## `devkit:design`

Any interface — web, desktop, and the craft underneath both.

| Reference | Covers |
| --- | --- |
| `ui-fundamentals` | The craft of one screen: visual hierarchy, spacing & type scales, semantic color roles + WCAG AA contrast, every component state and all four content states, forms, feedback, responsive layout, microcopy, icons, accessibility, review checklist. The base layer under the web and desktop references. |
| `design-systems` | Three-tier tokens (primitive → semantic → component), the scales as tokens, theming (light/dark, multi-brand, density), a component library (variants × states), governance, token-based dev handoff. For work that outlives one screen. |
| `web-dolle-mcp` | Building web UI on the **Dolle-MCP** server — templates, curated palettes, WCAG contrast, gradients, SVG tracing/segmentation, screenshots — after a design brief that settles menu bar, page count, single-document vs separate entry points, colors, animation, assets, structure. |
| `desktop-native` | Native/desktop conventions the web lacks: platform HIG (Apple/Windows/GNOME), window & app structure, menus and the command model, the desktop keyboard model, layout managers, HiDPI & system fonts, native feel + OS dark mode, a responsive UI thread, undo/redo, desktop a11y APIs. Qt as the worked example. |
| `web-performance` | Core Web Vitals at the 75th percentile (LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms): lab + field measurement, per-metric fix playbook, JS/image/font/third-party budgets. |

Standing rules in the router: WCAG **AA** is a hard gate; if direction is unspecified, **ask before
building**. Aesthetic *direction* stays with the separate `frontend-design` skill.

Usage: `/devkit:design` or `/devkit:design redesign the pricing page`.

## `devkit:shipping`

Packaging and deploying. The three references chain: build the image → run it → provision and ship it.

| Reference | Covers |
| --- | --- |
| `containerization` | Multi-stage Dockerfiles, small pinned non-root images, layer-cache ordering, BuildKit cache/secret mounts, `.dockerignore`, exec-form entrypoints and `HEALTHCHECK`, runtime secrets, Compose for local dev, size/security verification (dive, Trivy/Scout). |
| `kubernetes` | Controller choice, a production-grade Deployment (requests/limits, distinct liveness/readiness/startup probes, non-root security context, digest-pinned image), ConfigMaps & Secrets, Services/Ingress/Gateway API + cert-manager, HPA, PDB & topology spread, safe rollouts, Kustomize vs Helm, pod-failure debug playbook. |
| `cloud-infrastructure` | Twelve-factor baseline, picking the most-managed compute target, Terraform/OpenTofu with remote locked encrypted state, build-once-promote-the-digest pipelines, short-lived OIDC auth, managed secret stores, rolling/blue-green/canary, observability with SLO alerting. |

Standing rules in the router: no secrets in an image, repo, or manifest (and base64 in a K8s Secret
is encoding, not encryption); no long-lived cloud keys in CI — use OIDC.

Usage: `/devkit:shipping` or `/devkit:shipping my pod is crashing`.

## `devkit:process`

How to run the work itself. Front-to-back these compose: sharpen the ask → spec it if it's an app →
split it if it's large → document the result.

| Reference | Covers |
| --- | --- |
| `prompt-enhancement` | Diagnosing what a prompt is missing, classifying each gap as inferable / assumable / blocking, ask-vs-assume by whether the answer changes what you do next, sharp **AskUserQuestion** clarifications, restating cheaply before expensive work. Cross-cutting. |
| `app-prompt` | An **AskUserQuestion** interview across the axes that decide an app (type, platform, features and the MVP cut, users/auth, data, integrations, stack, non-functional, UI, deployment, success criteria & non-goals), compiled into a fixed sectioned spec with testable acceptance criteria, a phased build order, and an explicit handoff. |
| `subagents` | The core loop (decompose → delegate → verify → integrate), roles by intent, self-contained briefs, parallel vs sequential dispatch, adversarial verification, anti-patterns, Claude Code specifics. |
| `documentation` | A README that is a hub not a manual, one doc per major section, the `description` frontmatter contract, a **generated** index between `DOC-INDEX` markers, a code map, plus templates and maintenance rules. This repo's own docs follow it. |

Its `assets/` folder holds the doc-index automation the `documentation` reference tells you to copy.

Standing rule in the router: never bury a decision — ask when the answer changes what you build,
otherwise assume and **write the assumption down**.

Usage: `/devkit:process` or `/devkit:process this request is vague`.

## How the hubs relate

- **process** comes first: it sharpens the ask and, for a whole application, produces the spec that
  routes to the others.
- **design** and **agent-development** are the two build hubs — one for interfaces, one for
  agents/workflows. An app can need both.
- **shipping** comes last, and its `containerization` reference depends on what the build produced
  (non-root user, `HEALTHCHECK`, `SIGTERM` handling are exactly what `kubernetes` probes rely on).
- Inside **design** the references layer: `frontend-design` (external skill, aesthetic direction) →
  `ui-fundamentals` → `design-systems` → `web-dolle-mcp` or `desktop-native`, with
  `web-performance` backstopping the web path.

## Related

- [Usage](usage.md) — how to load these day to day.
- [Architecture](architecture.md) — why hubs and references.
- [Extending](extending.md) — add a reference or a hub.

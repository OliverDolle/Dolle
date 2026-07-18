---
title: Skill sections
description: >-
  Describes each skill section, the individual skills inside it, and the command that loads it.
  Explains the difference between multi-skill sections (with an index) and single-skill
  sections, and how the sections relate.
order: 30
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

# Skill sections

> Each devkit section, the skills inside it, and the command that loads it.

## Overview

devkit groups skills into **sections**. A section is a folder under
`plugins/devkit/packs/` and is exposed by exactly one command. Sections live outside Claude
Code's auto-scanned `skills/` directory on purpose, so nothing is loaded at startup — a loader
command reads the section's content into context on demand. See [Architecture](architecture.md)
for why and how.

- A **multi-skill section** (like agent-development) has an `INDEX.md` catalog plus one folder
  per skill (`<skill>/SKILL.md`). The loader reads the index, then the skills relevant to the
  task.
- A **single-skill section** (like documentation) is just a `SKILL.md` the loader reads
  directly.

## Section: Agent development — `/agent-development`

`packs/agent-development/` · 5 skills

Building AI agents and workflows. LangChain and LangGraph are used **together** here — you're
not forced to pick one. The loader reads the section index, then the skills your task needs.

| Skill | Covers |
| --- | --- |
| `langchain-agents` | Chat models, LCEL chains, `@tool`, tool-calling agents, structured output, memory, streaming. |
| `langgraph-workflows` | `StateGraph`, typed state + reducers, conditional edges/loops, prebuilt ReAct agent, persistence, human-in-the-loop, streaming, subgraphs. |
| `combining-langchain-and-langgraph` | The mental model (components vs. orchestration), which to reach for when, and a combined end-to-end example. |
| `workflow-design` | How to *construct* a workflow: shape choice, state modeling, node granularity, control flow, reliability, observability, testing, deployment. |
| `troubleshooting` | A living log of errors seen during development and their fixes, with a template to append new ones. |

Usage: `/agent-development` (loads the section), `/agent-development <task>` (loads + starts),
or `/agent-development workflow-design` (focus a specific skill).

## Section: Subagent-driven development — `/subagents`

`packs/subagent-driven-development/SKILL.md` · 1 skill

A methodology for building software by decomposing work and orchestrating subagents rather than
doing everything in one context: the core loop (decompose → delegate → verify → integrate),
subagent roles, self-contained briefs, parallel vs. sequential dispatch, adversarial
verification, anti-patterns, and Claude Code specifics.

## Section: Documentation — `/docs`

`packs/documentation/SKILL.md` · 1 skill

A method for documenting a project so it's easy to navigate: a very short README stating what
the project is, one doc per major section, and a README index that links each doc and describes
what it covers. Includes README and per-section templates plus maintenance rules. This repo's
own docs follow it.

## Section: UI/UX design — `/ui-ux-design`

`packs/ui-ux-design/SKILL.md` · 1 skill

A method for designing distinctive web UI/UX on top of the **Dolle-MCP** server (sibling repo,
registered in Claude Code as `dolle-mcp` — **bundled with this plugin**, so it auto-registers on
install; see [Installation](installation.md#bundled-mcp-server-dolle-mcp)). It uses that server's
tools first — `list_templates`
/ `get_template_source` / `screenshot_template` for the 19 offline templates, `find_palettes` /
`color_palettes` / `color_contrast` / `color_gradients` for color, `segment_svg` /
`trace_image_to_svg` for animatable SVG — and runs a **design brief** before building: asking
the user for any unspecified direction (menu bar, page count, single-document vs separate API
entry points, colors/palette, animation, images/SVG, page structure). It builds on the
`frontend-design` skill and steers away from the AI-default looks (no purple/violet by default).

Usage: `/ui-ux-design` (loads the section) or `/ui-ux-design <what you're designing>` (loads +
runs the brief).

## Section: Web performance — `/web-performance`

`packs/web-performance/SKILL.md` · 1 skill

A measure-first method for making pages fast against **Core Web Vitals**: the three metrics and
their 75th-percentile thresholds (LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms), how to measure in the
lab (throttled Lighthouse) and the field (`web-vitals` / CrUX), a per-metric fix playbook
(LCP → images/fonts/TTFB, CLS → reserve space, INP → unblock the main thread), and JS/image/
font/third-party budgets to hold in CI.

Usage: `/web-performance` (loads the section) or `/web-performance <page or metric>` (loads +
starts from a baseline).

## Section: UI design (fundamentals) — `/ui-design`

`packs/ui-design/SKILL.md` · 1 skill

The **tool-agnostic** craft of great UI, applicable in any tool or stack: visual hierarchy (one
primary action per view), a single spacing scale and a small type scale, semantic color roles with
WCAG **AA** contrast (meaning never by color alone), the full set of component states
(hover/focus/active/disabled/loading), the four content states (empty/loading/error/overflow), form
and feedback design, responsive layout, microcopy, accessibility, and a review checklist. It sits
under the other two design pieces: `frontend-design` owns aesthetic *direction*, `ui-ux-design` owns
the Dolle-MCP *build workflow*, and this owns the *interface craft* beneath both.

Usage: `/ui-design` (loads the section) or `/ui-design <screen/component to design or review>`.

## Section: Containerization — `/containerization`

`packs/containerization/SKILL.md` · 1 skill

Docker & Compose done right: multi-stage builds (ship the artifact, not the toolchain), small
pinned non-root base images, layer-cache ordering (deps before source), BuildKit cache/secret
mounts, `.dockerignore`, exec-form entrypoints and healthchecks, secrets at runtime (never in
`ENV`/`ARG`/layers), Compose for local multi-service dev, and a size/security verification checklist
(dive, Trivy/Scout). Feeds directly into the kubernetes section.

Usage: `/containerization` (loads the section) or `/containerization <what you're containerizing>`.

## Section: Kubernetes — `/kubernetes`

`packs/kubernetes/SKILL.md` · 1 skill

Deploying and configuring services on K8s: choosing the controller (Deployment by default), a
production-grade Deployment (resource requests/limits, distinct liveness/readiness/startup probes,
non-root security context, digest-pinned image), config via ConfigMaps and Secrets (and why base64
Secrets aren't encryption), exposing with Services/Ingress/Gateway API + cert-manager, autoscaling
(HPA) and availability (PDB, topology spread), safe rollouts, packaging with Kustomize or Helm, and
a debug playbook for the common pod failures.

Usage: `/kubernetes` (loads the section) or `/kubernetes <what you're deploying or the failure>`.

## Section: Cloud infrastructure — `/cloud-infrastructure`

`packs/cloud-infrastructure/SKILL.md` · 1 skill

CI/CD, Infrastructure-as-Code, and cloud platforms: the twelve-factor deploy baseline, choosing the
most-managed compute target that fits (serverless/containers/PaaS before a cluster), Terraform/
OpenTofu with remote locked encrypted state and per-environment isolation, a pipeline that builds
once and promotes the same digest through gated environments, short-lived OIDC cloud auth (no
long-lived keys), managed secret stores, deployment strategies (rolling/blue-green/canary), and
observability (logs/metrics/OpenTelemetry traces) with SLO-based alerting.

Usage: `/cloud-infrastructure` (loads the section) or `/cloud-infrastructure <platform/pipeline/IaC
task>`.

## Section: Prompt enhancement — `/prompt-enhancement`

`packs/prompt-enhancement/SKILL.md` · 1 skill

A method for turning a vague or underspecified request into a precise, high-yield prompt *before*
doing the work: diagnosing what the prompt is missing (goal, context, scope, constraints, success
criteria, output format, examples), classifying each gap as inferable / assumable / blocking,
deciding ask-vs-assume by whether the answer would change what you do next, clarifying the blocking
gaps with the **AskUserQuestion** tool (2–4 tappable options, recommended first, batched, with
previews for artifacts to compare), then sharpening the request into a structured prompt and
restating it cheaply before expensive work. Cross-cutting — it applies to any task, and pairs with
the AskUserQuestion-driven briefs used by `ui-ux-design`, `subagents`, and `deep-research`.

Usage: `/prompt-enhancement` (loads the section) or `/prompt-enhancement <a rough request to
enhance>`.

## How the sections relate

- Within agent-development, LangChain and LangGraph compose — LangChain components run inside
  LangGraph orchestration; the `combining-langchain-and-langgraph` skill ties them together.
- Subagent-driven development is orthogonal and applies to any task, including building the
  agent-development code or writing docs.
- UI/UX design depends on the external Dolle-MCP server for its tools, and layers on the
  `frontend-design` skill for design craft.
- Web performance pairs with UI/UX design: the motion rules the design section enforces
  (`transform`/`opacity`, reduced-motion) are the same ones that protect the CLS and INP metrics.
  The `web-designer` subagent executes the UI/UX design loop; performance is checked after.
- The three design sections layer: `frontend-design` (aesthetic direction) → **UI design**
  (interface craft: hierarchy, states, forms, accessibility) → **UI/UX design** (build it on the
  Dolle-MCP server). Web performance backstops all three.
- The three platform sections form a delivery chain: **Containerization** builds the image (its
  non-root user, `HEALTHCHECK`, and `SIGTERM` handling are exactly what **Kubernetes** probes and
  graceful termination depend on), and **Cloud infrastructure** provisions the target and ships it
  through CI/CD — with Kubernetes as one compute option among serverless/containers/PaaS.
- **Prompt enhancement** is cross-cutting: it applies before any of the above. The clarify-first
  discipline it teaches (AskUserQuestion, ask-vs-assume, restate before building) is the same one
  the `ui-ux-design` design brief, the `subagents` self-contained brief, and `deep-research` scope
  narrowing already rely on — this section names the method they share.

## Related

- [Usage](usage.md) — the commands that load these.
- [Architecture](architecture.md) — how loading works.
- [Extending](extending.md) — add a skill or a whole section.

---
title: Skill sections
description: >-
  Describes each skill section, the individual skills inside it, and the command that loads it.
  Explains the difference between multi-skill sections (with an index) and single-skill
  sections, and how the sections relate.
order: 30
---

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

## Related

- [Usage](usage.md) — the commands that load these.
- [Architecture](architecture.md) — how loading works.
- [Extending](extending.md) — add a skill or a whole section.

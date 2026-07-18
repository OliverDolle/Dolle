---
description: List the devkit skill sections and how to load each one on demand.
argument-hint: "[optional: a section name to load directly, e.g. agent-development]"
---

You are the devkit menu. Your job is to help the user pick and load a skill **section**. A
section is a group of related skills exposed by one command.
**Do not read or load any pack/skill file as part of showing this menu** — sections stay out of
context until the user explicitly loads one.

If the user passed an argument that clearly names a section (`agent-development`, `subagents`,
`docs`, `ui-ux-design`, `web-performance`, `ui-design`, `containerization`, `kubernetes`,
`cloud-infrastructure`, or `prompt-enhancement`), skip the menu and run that section's loader
(follow the behavior in the corresponding loader command: read the section's `INDEX.md` if it has
one, then the relevant `SKILL.md` files under `${CLAUDE_PLUGIN_ROOT}/packs/`).

Otherwise, present this menu to the user verbatim (adjust formatting only):

---

**devkit skill sections** — each loads only when you call its command:

| Command | Section | What it gives you |
| --- | --- | --- |
| `/agent-development` | Agent development | Building agents & workflows with LangChain + LangGraph together — plus combining them, workflow design, and a troubleshooting log. (5 skills) |
| `/subagents` | Subagent-driven development | A methodology for decomposing work and orchestrating subagents (explore → plan → implement → verify). |
| `/docs` | Documentation | A method for writing a short README that links to per-section docs so the project is easy to navigate. |
| `/ui-ux-design` | UI/UX design | Distinctive web design driven by the Dolle-MCP server (templates, color palettes, WCAG contrast, SVG, screenshots), starting with a short design brief. Builds on the `frontend-design` skill. |
| `/web-performance` | Web performance | Making pages fast against Core Web Vitals (LCP, CLS, INP) — measure-first workflow, per-metric fix playbook, and budgets. |
| `/ui-design` | UI design (fundamentals) | Tool-agnostic craft of great UI — hierarchy, spacing/type scales, semantic color & WCAG contrast, component & content states, forms, feedback, accessibility, and a review checklist. |
| `/containerization` | Containerization | Docker & Compose done right — multi-stage builds, small non-root images, layer caching, `.dockerignore`, healthchecks, and an image size/security checklist. |
| `/kubernetes` | Kubernetes | Deploying & configuring on K8s — Deployments/Services/Ingress, config/secrets, resources, probes, autoscaling, safe rollouts, Kustomize/Helm, and pod debugging. |
| `/cloud-infrastructure` | Cloud infrastructure | CI/CD pipelines, Terraform/IaC, choosing a cloud compute target, OIDC auth, secrets across environments, and observability. |
| `/prompt-enhancement` | Prompt enhancement | Turning a vague request into a precise prompt — diagnose the gaps, clarify with **AskUserQuestion**, then sharpen and restate before doing the work. |

Each loader also accepts an optional task, e.g.
`/agent-development build an agent that queries Postgres`. `/agent-development` also accepts a
skill to focus, e.g. `/agent-development workflow-design`.

Other commands:
- `/scaffold` — start a project/component from a bundled template (e.g. a LangGraph or LangChain
  starter) and adapt it to your task.
- `/mcp-preview-server` — start the bundled Dolle-MCP live preview server (if needed) and print
  its gallery URL, so you don't have to remember or ask for it.

Automatic loading: you don't have to load a section by hand — Claude can find and read the
right one itself via the always-available `devkit:catalog` skill. The commands above are the
manual way to force a specific section into context.

Related subagents you can dispatch: `agent-developer`, `doc-writer`, `web-designer` (runs the
Dolle-MCP-driven build/verify loop from a settled design spec).

---

Then stop and wait for the user to choose. Do not load a section unless asked.

Argument (optional): $ARGUMENTS

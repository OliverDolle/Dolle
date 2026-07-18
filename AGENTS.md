# AGENTS.md

This repository is **Dolle devkit** — a Claude Code plugin of command-gated skill *sections*
for AI-assisted development. If you are an agent other than Claude Code (Codex, Cursor, etc.),
you can't use the `/`-commands, but you can use the skills directly: each is a self-contained
Markdown file.

## Skill sections (read the relevant skill before working on that topic)

**Agent development** — `plugins/devkit/packs/agent-development/`. Start with `INDEX.md`, then
read the skills you need. LangChain and LangGraph are used together here.

| Topic | Read this file |
| --- | --- |
| Building a LangChain agent (models, tools, structured output) | `agent-development/langchain-agents/SKILL.md` |
| Building a LangGraph workflow (StateGraph, routing, persistence) | `agent-development/langgraph-workflows/SKILL.md` |
| How LangChain + LangGraph fit together | `agent-development/combining-langchain-and-langgraph/SKILL.md` |
| How to construct/design a workflow | `agent-development/workflow-design/SKILL.md` |
| An error during development (and to log a new one) | `agent-development/troubleshooting/SKILL.md` |

**Subagent-driven development** — `plugins/devkit/packs/subagent-driven-development/SKILL.md`.
Orchestrating subagents / decomposing large tasks.

**Documentation** — `plugins/devkit/packs/documentation/SKILL.md`. Writing or updating docs.

**UI/UX design** — `plugins/devkit/packs/ui-ux-design/SKILL.md`. Building/reshaping a web page
on the Dolle-MCP server (needs that server; layers on the `frontend-design` skill).

**Web performance** — `plugins/devkit/packs/web-performance/SKILL.md`. Core Web Vitals
(LCP/CLS/INP), measuring, per-metric fixes, budgets.

**UI design (fundamentals)** — `plugins/devkit/packs/ui-design/SKILL.md`. Tool-agnostic UI craft:
hierarchy, spacing/type scales, semantic color + contrast, component/content states, forms,
accessibility, review checklist.

**Containerization** — `plugins/devkit/packs/containerization/SKILL.md`. Docker & Compose:
multi-stage builds, small non-root images, layer caching, healthchecks, size/security.

**Kubernetes** — `plugins/devkit/packs/kubernetes/SKILL.md`. K8s workloads, config/secrets,
resources, probes, autoscaling, rollouts, Kustomize/Helm, pod debugging.

**Cloud infrastructure** — `plugins/devkit/packs/cloud-infrastructure/SKILL.md`. CI/CD,
Terraform/IaC, cloud compute targets, OIDC auth, secrets, observability.

**Prompt enhancement** — `plugins/devkit/packs/prompt-enhancement/SKILL.md`. Turn a vague request
into a precise prompt: diagnose gaps, decide ask-vs-assume, clarify with AskUserQuestion, sharpen
and restate before doing the work.

Load a skill only when the current task matches it — don't read everything up front.

## Conventions for changes in this repo

- Documentation follows the method in `plugins/devkit/packs/documentation/SKILL.md`: keep
  `README.md` short and link out to `docs/`; update the README doc index whenever you add or
  remove a doc.
- New skills go in `plugins/devkit/packs/<section>/<skill>/SKILL.md` and get listed in the
  section's `INDEX.md`; new sections also get a loader command and a `/devkit` menu row. See
  `docs/extending.md`.
- Hooks are Node scripts under `plugins/devkit/hooks/scripts/` for cross-platform behavior.

## Human docs

Start at `README.md`, which links every doc in `docs/`.

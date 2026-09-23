# AGENTS.md

This repository is **Dolle devkit** — a Claude Code plugin whose guidance sits behind **five skill
hubs**. In Claude Code you invoke a hub (`devkit:<hub>`), get a short router listing its references,
and read only the reference the task needs. If you are another agent (Codex, Cursor, etc.) you can't
invoke skills, but every reference is a self-contained plain-Markdown file — read it directly by the
path below.

All references live at `plugins/devkit/skills/<hub>/references/<name>.md`.

## Which reference to read

| Topic | Hub | Reference |
| --- | --- | --- |
| Building a LangChain agent (models, tools, structured output, memory) | `agent-development` | `langchain-agents.md` |
| Building a LangGraph workflow (StateGraph, routing, loops, persistence) | `agent-development` | `langgraph-workflows.md` |
| How LangChain + LangGraph fit together | `agent-development` | `combining-langchain-and-langgraph.md` |
| Designing a workflow before coding it | `agent-development` | `workflow-design.md` |
| Writing or improving a system prompt / LLM prompt (structure, few-shot, structured output) | `agent-development` | `prompt-engineering.md` |
| Adding voice input — speech recognition / STT | `agent-development` | `speech-to-text.md` |
| Adding voice output — speech synthesis / TTS | `agent-development` | `text-to-speech.md` |
| Deciding what to measure for an LLM agent; building an eval dataset | `agent-development` | `eval-foundations.md` |
| Scoring open-ended output with a model (LLM-as-judge, bias) | `agent-development` | `llm-as-judge.md` |
| Gating merges on an eval pass rate (promptfoo in CI) | `agent-development` | `eval-harness-ci.md` |
| Evaluating a LangGraph `StateGraph` specifically | `agent-development` | `langgraph-workflow-evals.md` |
| Tracing and monitoring an agent (OpenTelemetry GenAI, drift) | `agent-development` | `tracing-observability.md` |
| An error during agent development (and to log a new one) | `agent-development` | `troubleshooting.md` |
| The craft of one screen — aesthetic direction, hierarchy, spacing/type, semantic color + contrast, states, forms, accessibility | `design` | `ui-fundamentals.md` |
| Whether a UI looks AI-generated — the named tells, escape moves, gate sweep | `design` | `anti-slop.md` |
| Page shape before markup — nav/footer archetypes, hero fit, section rhythm | `design` | `structural-variety.md` |
| Typeface pairings, OKLCH palettes, accent and contrast discipline, themes | `design` | `type-and-color.md` |
| Cards and containers, radius/border/elevation, the 1px detail layer | `design` | `surfaces-and-details.md` |
| Animation, transitions, micro-interactions | `design` | `motion-and-interaction.md` |
| Charts and dashboards | `design` | `data-visualization.md` |
| Design tokens, theming, a component library, dev handoff | `design` | `design-systems.md` |
| Building/restyling a **web** page on the Dolle-MCP server (needs that server) | `design` | `web-dolle-mcp.md` |
| A **native/desktop** app (Qt, GTK, WinUI) — platform HIG, windows, menus, keyboard model, HiDPI, a11y | `design` | `desktop-native.md` |
| Core Web Vitals (LCP/CLS/INP), measuring, per-metric fixes, budgets | `design` | `web-performance.md` |
| Docker & Compose — multi-stage builds, small non-root images, layer caching, healthchecks | `shipping` | `containerization.md` |
| K8s workloads, config/secrets, resources, probes, autoscaling, rollouts, Kustomize/Helm | `shipping` | `kubernetes.md` |
| Safe K8s delivery — canary/blue-green (Argo Rollouts, Flagger), GitOps (Argo CD, Flux), promotion, rollback | `shipping` | `kubernetes-gitops.md` |
| CI/CD, Terraform/IaC, cloud compute targets, OIDC auth, secrets, observability | `shipping` | `cloud-infrastructure.md` |
| GitHub Actions workflows — OIDC, environments, reusable workflows, SHA-pinning | `shipping` | `github-actions.md` |
| Azure DevOps pipelines — templates, deployment jobs, service connections, Key Vault | `shipping` | `azure-devops.md` |
| Debugging a failing program, flaky test, or incident — before guessing at a fix | `engineering` | `systematic-debugging.md` |
| Module boundaries, dependency inversion, plugins/seams, feature flags | `engineering` | `extensible-architecture.md` |
| Designing a schema or choosing a datastore (SQL vs NoSQL, normalization, keys) | `engineering` | `data-modeling.md` |
| Indexing/EXPLAIN, migrations, pooling, transactions, security, backups | `engineering` | `database-operations.md` |
| ESP32 firmware — toolchain, flashing/upload failures, FreeRTOS, GPIO, brownout | `engineering` | `esp32.md` |
| Turning a vague request into a precise prompt (diagnose gaps, ask-vs-assume, clarify, restate) | `process` | `prompt-enhancement.md` |
| Turning a rough app idea into a build-ready spec | `process` | `app-prompt.md` |
| Orchestrating subagents / decomposing large tasks | `process` | `subagents.md` |
| Writing the brief or system prompt a subagent runs on | `process` | `subagent-briefs.md` |
| Writing or updating docs | `process` | `documentation.md` |

Each hub's `SKILL.md` is the router — read it only if you're unsure which reference applies. Read one
reference at a time; don't read everything up front.

## Conventions for changes in this repo

- Documentation follows the method in
  `plugins/devkit/skills/process/references/documentation.md`: keep `README.md` short and link out to
  `docs/`; the README doc index is generated, never hand-edited.
- **New guidance is a reference, not a skill.** Claude Code scans `skills/` once at session start, so
  every registered skill costs its description every session whether used or not — while any amount of
  content behind a reference costs nothing until read. Add
  `skills/<hub>/references/<topic>.md` (plain Markdown, no frontmatter) and a row to that hub's router
  giving what it covers **and when to reach for it**. See `docs/extending.md`.
- **Adding a hub is a real cost** (~120–150 B of startup context, forever). Only when the domain
  doesn't fit any of the five descriptions. Hub dirs sit directly under `skills/` — Claude Code does not
  discover nested skills — with `name:` matching the directory.
- **Keep routers thin.** The reference table plus the two or three rules that bind everywhere.
  Anything longer belongs in a reference; a fat router defeats the design.
- **Don't add a command whose body is "read this file."** Commands are for behavior a skill can't
  provide (`/devkit`, `/scaffold`, `/mcp-preview-server`).
- Cross-reference within a hub by filename; across hubs as ``devkit:<hub>` → `references/<file>.md``.
  Never point at a devkit `SKILL.md` by path.
- Hooks are Node scripts under `plugins/devkit/hooks/scripts/` for cross-platform behavior. When a
  hook points at guidance, name the hub **and** the reference.

## Human docs

Start at `README.md`, which links every doc in `docs/`.

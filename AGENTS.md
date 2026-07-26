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

**AI agent evaluation** — `plugins/devkit/packs/agent-evaluation/INDEX.md`, then the skill you
need: `eval-foundations/SKILL.md` (what to measure, datasets), `llm-as-judge/SKILL.md` (model-graded
scoring + bias), `eval-harness-ci/SKILL.md` (assertions + pass-rate CI merge gate),
`tracing-observability/SKILL.md` (OpenTelemetry GenAI, drift), `langgraph-workflow-evals/SKILL.md`
(evaluating a LangChain/LangGraph agent specifically — trajectory/node/response, LangSmith + pytest).
The quality gate for the agents agent-development builds.

**Subagent-driven development** — `plugins/devkit/packs/subagent-driven-development/INDEX.md`
(then `orchestration/SKILL.md` for decomposing/orchestrating large tasks;
`writing-subagent-instructions/SKILL.md` for the craft of the brief each subagent runs on).

**Documentation** — `plugins/devkit/packs/documentation/SKILL.md`. Writing or updating docs.

**UI/UX design** — `plugins/devkit/packs/ui-ux-design/SKILL.md`. Building/reshaping a web page
on the Dolle-MCP server (needs that server; design-craft base is `ui-design` §0, with the external `frontend-design` skill as an optional complement).

**Web performance** — `plugins/devkit/packs/web-performance/SKILL.md`. Core Web Vitals
(LCP/CLS/INP), measuring, per-metric fixes, budgets.

**UI design (craft)** — `plugins/devkit/packs/ui-design/INDEX.md`, then the skill you need:
`anti-slop/SKILL.md` (the named AI-default tells, escape moves, audit report format, pre-emit
self-critique, gate sweep — read by default on anything visual), `fundamentals/SKILL.md` (hierarchy,
spacing/type scales, semantic color + WCAG 2.2 contrast, component/content states, forms,
accessibility), `structural-variety/SKILL.md` (page shape, nav/footer archetypes, hero fit, section
rhythm), `type-and-color/SKILL.md` (type pairings, OKLCH palettes, accent & contrast discipline,
themes), `surfaces-and-details/SKILL.md` (the containment ladder, radius/border/elevation, the 1px
detail layer — read when a UI is "correct but still looks generated"),
`design-systems/SKILL.md` (tokens, theming, component library, dev handoff),
`data-visualization/SKILL.md` (charts & dashboards), or `motion-and-interaction/SKILL.md`
(animation & micro-interactions).

**Systematic debugging** — `plugins/devkit/packs/systematic-debugging/SKILL.md`. A method for any
failing program/flaky test/incident: reproduce, read the real error, one hypothesis at a time,
bisect, the right instrument (debugger/tracing/profiler/sanitizers), confirm root cause before fixing.

**Containerization** — `plugins/devkit/packs/containerization/SKILL.md`. Docker & Compose:
multi-stage builds, small non-root images, layer caching, healthchecks, size/security.

**Kubernetes** — `plugins/devkit/packs/kubernetes/INDEX.md`, then `workloads/SKILL.md` (workloads,
config/secrets, resources, probes, autoscaling, Kustomize/Helm, pod debugging) or
`deployment-and-gitops/SKILL.md` (rollout loop, Argo Rollouts/Flagger progressive delivery, Argo
CD/Flux GitOps).

**Cloud infrastructure** — `plugins/devkit/packs/cloud-infrastructure/SKILL.md`. CI/CD,
Terraform/IaC, cloud compute targets, OIDC auth, secrets, observability.

**Deployment pipelines** — `plugins/devkit/packs/deployment-pipelines/INDEX.md`, then
`github-actions/SKILL.md` or `azure-devops/SKILL.md`. Platform-specific CI/CD YAML (OIDC/workload
identity, environments & approvals, deployment strategies, reuse, supply-chain hardening) — the
concrete companion to cloud-infrastructure's concepts.

**Database design & configuration** — `plugins/devkit/packs/database-design/INDEX.md`, then
`data-modeling/SKILL.md` (schema, normalization, SQL-vs-NoSQL, ORM patterns) or
`operations-and-tuning/SKILL.md` (indexing, migrations, pooling, transactions, security, backups).

**Extensible code architecture** — `plugins/devkit/packs/extensible-architecture/SKILL.md`. Writing
code that extends without rewrites: boundaries, dependency inversion, open-closed, ports-and-adapters,
extension points, SemVer contracts, seams, feature flags.

**Prompt enhancement** — `plugins/devkit/packs/prompt-enhancement/SKILL.md`. Turn a vague request
into a precise prompt: diagnose gaps, decide ask-vs-assume, clarify with AskUserQuestion, sharpen
and restate before doing the work.

**Prompt engineering** — `plugins/devkit/packs/prompt-engineering/SKILL.md`. The craft of the prompt
handed to a model: structure & delimiters, few-shot, CoT vs. reasoning models, structured output,
prompt patterns, eval-driven iteration. (Distinct from prompt-enhancement.)

**Speech interfaces (STT & TTS)** — `plugins/devkit/packs/speech-interfaces/INDEX.md`, then
`speech-to-text/SKILL.md` or `text-to-speech/SKILL.md`. Engine options (cloud & on-device),
streaming vs. batch, audio format, SSML/prosody, latency & cost, integration patterns.

**Embedded dev boards — ESP32** — `plugins/devkit/packs/esp32/SKILL.md`. Toolchains, flashing &
upload-failure fixes (hold BOOT while resetting/powering), dual-core FreeRTOS task pinning, GPIO/
strapping gotchas, brownout, deep sleep, serial/JTAG debugging.

Load a skill only when the current task matches it — don't read everything up front.

## Conventions for changes in this repo

- Documentation follows the method in `plugins/devkit/packs/documentation/SKILL.md`: keep
  `README.md` short and link out to `docs/`; update the README doc index whenever you add or
  remove a doc.
- New skills go in `plugins/devkit/packs/<section>/<skill>/SKILL.md` and get listed in the
  section's `INDEX.md`; new sections also get a loader command and a `/devkit` menu row. See
  `docs/extending.md`.
- Hooks are Node scripts under `plugins/devkit/hooks/scripts/` for cross-platform behavior.
- **Never allow-list MCP tools in an agent's `tools:` frontmatter.** `tools` is an exact-match
  allow-list with no wildcard syntax, and plugin MCP tool names are not stable across hosts: bare
  `claude` exposes the bundled server as `mcp__dolle-mcp__<tool>`, while Claude Code desktop and
  the Agent SDK namespace plugin servers per-plugin and expose the same tools as
  `mcp__plugin_devkit_dolle-mcp__<tool>`. A list written for one host resolves to **zero** MCP
  tools on the other, with no error — and the agent then quietly substitutes whatever it can
  reach (a local Dolle-MCP checkout, its own memory) and returns work that looks verified but
  isn't. Omit `tools:` instead: the docs specify it "Inherits every tool available to subagents if
  omitted", which also means a tool added to Dolle-MCP is callable the day it ships with no edit
  here. To subtract a capability use `disallowedTools:` (a denylist over the inherited pool).
  `web-designer.md` carries the full rationale as a maintainer comment and enforces a hard stop
  when the tools are missing; `scripts/check-agent-tools.mjs` fails the check if the pattern comes
  back.
- Agent, command and skill Markdown must not end with a stray `</content>` line — an artifact of
  generated writes that otherwise leaks into the agent's system prompt.
  `scripts/check-agent-tools.mjs` also checks this.

## Human docs

Start at `README.md`, which links every doc in `docs/`.

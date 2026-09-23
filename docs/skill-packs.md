---
title: Skill hubs
description: >-
  The five devkit hubs, the references inside each, and what every reference covers. Explains the
  router-plus-references shape that keeps startup context to five short descriptions and loads only
  the depth a task needs.
order: 30
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

# Skill hubs

> The five hubs, what each reference covers, and when to reach for it.

## Overview

devkit ships **five registered skills**, called hubs. A hub's `SKILL.md` is a **router**: one row per
`references/*.md` saying when to read it. Invoking a hub loads only that router (1.3–2.5 KB); the
depth is read on demand, one reference at a time.

```
skills/<hub>/
├── SKILL.md        # invoked -> router arrives in context, no file read
└── references/     # read on demand, only when a row matches the task
    └── *.md
```

Each description is a short imperative — *"Call before building, restyling, or reviewing any UI — …"*
— so Claude knows exactly when to reach for it. The five total **672 bytes (~170 tokens)**; everything
devkit puts in context every session (hub descriptions, three commands, four subagent descriptions, a
one-line hook) is **2,233 bytes (~560 tokens)**. **98.2 %** of the content — 40 references, ~452 KB —
is behind references. See [Architecture](architecture.md) for why.

**Never read a devkit `SKILL.md` off disk.** Invoke the hub; the router arrives free. References are
the only devkit files meant to be read, and only from inside the hub that owns them.

## `devkit:agent-development`

AI agents and LLM features — build them, prompt them, measure them. LangChain and LangGraph are used
**together** — LangChain supplies models, tools, prompts, and output parsers; LangGraph supplies the
stateful control flow. The eval references prove the result works and stop it regressing.

| Reference | Covers |
| --- | --- |
| `langchain-agents` | Chat models, LCEL chains, `@tool`, `create_tool_calling_agent` + `AgentExecutor`, structured output, conversation memory, streaming, and when to graduate to LangGraph. |
| `langgraph-workflows` | `StateGraph`, typed state with reducers, conditional edges/loops, the prebuilt ReAct agent, checkpointer persistence, `interrupt()` for human-in-the-loop, streaming, subgraphs. |
| `combining-langchain-and-langgraph` | The mental model (components vs. orchestration), which to reach for when, a combined end-to-end example, integration patterns, pitfalls. |
| `workflow-design` | Graph shape, state modeling, node granularity, explicit control flow, reliability (retries/timeouts/fallbacks), observability, testing, deployment, design checklist. |
| `prompt-engineering` | Writing system prompts that produce reliable output: structure & delimiters, few-shot, chain-of-thought vs. reasoning models, output/structured-output control, multi-step prompt patterns, instruction hygiene, eval-driven iteration, model-specific tips, anti-patterns. |
| `speech-to-text` | Voice input: picking an engine by constraint (cloud vs on-device), the option matrix, streaming vs batch, audio capture & format, accuracy levers (VAD, diarization, vocab), integration patterns, cost pitfalls. |
| `text-to-speech` | Voice output: engine matrix, streaming synthesis and first-byte latency, voice/prosody/SSML, audio formats & playback, integration patterns, cost pitfalls. Pair with `speech-to-text` for a voice agent. |
| `eval-foundations` | Deciding what "good" means: task vs component vs trajectory evals, building an eval dataset and growing it from real failures, offline vs online evaluation, RAG metrics. Start evals here. |
| `llm-as-judge` | Scoring open-ended output with a model: when a judge beats deterministic checks, rubric/assertion design, pairwise vs pointwise, the judge-bias catalog + mitigations, validating against human labels. |
| `eval-harness-ci` | Evals as a merge gate: mixing deterministic and model-graded assertions, pass-rate thresholds, regression suites, the tooling landscape, and the bundled `promptfoo-eval-ci` template. |
| `langgraph-workflow-evals` | Evaluating a `StateGraph` specifically: final-response vs single-step (node) vs trajectory targets, datasets from traces, evaluators, LangSmith `evaluate` + `pytest`, gating graph changes. |
| `tracing-observability` | Seeing inside the agent: OpenTelemetry GenAI conventions, what to capture per span, online eval on live traffic, drift monitoring and alerting. |
| `troubleshooting` | A living log of LangChain/LangGraph errors and fixes — imports after the 0.3 split, `agent_scratchpad`, ignored tools, `GraphRecursionError`, overwritten state, `interrupt()` not pausing, async/sync mismatch. **Append to it.** |

Standing rules in the router: fast path first (`create_react_agent` before a custom `StateGraph`),
a hard exit on every loop, verify package names, signatures, model names, and prices against what's
installed or current, and design the eval dataset alongside the agent.

Usage: `/devkit:agent-development` or `/devkit:agent-development build an agent that queries Postgres`.

## `devkit:design`

Any interface — web, desktop, and the craft underneath both.

| Reference | Covers |
| --- | --- |
| `ui-fundamentals` | The craft of one screen: §0 aesthetic direction (distinctive, not templated), visual hierarchy, spacing & type scales, semantic color roles + WCAG 2.2 AA contrast, every component state and all four content states, forms, feedback, responsive layout, microcopy, icons, accessibility, review checklist. The base layer under everything else here. |
| `anti-slop` | The named tells of AI-generated UI (critical, major, motion, copy, implementation), the escape moves, an audit protocol, a six-axis pre-emit self-critique, and a gate sweep to run before shipping. |
| `structural-variety` | Page shape as a stated decision before markup: the six structural axes, whole page shapes, stamp-then-differ diversification, nav and footer archetypes, hero discipline, whether a page needs imagery, section rhythm. |
| `type-and-color` | Display + body pairings and faces to avoid as display, a catalog of free foundry-grade alternatives, scale/weight/measure, four-layer OKLCH palettes, accent discipline (≤5 %), contrast pairs that fail, dark mode as a recipe, theme bundles, token discipline. |
| `surfaces-and-details` | The containment ladder (earn the card), radius as a language, borders & hairlines, elevation recipes for light and dark, density and optics, surface hierarchy, and the 1px detail layer. |
| `motion-and-interaction` | Motion with a job: duration & easing intent, micro-interaction anatomy, choreography, state and route transitions, loading choreography, motion as a token system, the named motion tells. |
| `data-visualization` | Picking the chart from the question, dashboard layout & hierarchy, declarative titles and direct labeling, color for data, reducing ink, chart states & interaction, accessible & responsive charts. |
| `design-systems` | Three-tier tokens (primitive → semantic → component), the scales as tokens, accessibility primitives (focus ring, min target size) as tokens, theming (light/dark, multi-brand, density), a component library (variants × states), governance, token-based dev handoff. For work that outlives one screen. |
| `web-dolle-mcp` | Building web UI on the **Dolle-MCP** server — templates, curated palettes, WCAG contrast, gradients, SVG tracing/segmentation, screenshots — after a design brief that settles menu bar, page count, single-document vs separate entry points, colors, animation, assets, structure. |
| `desktop-native` | Native/desktop conventions the web lacks: platform HIG (Apple/Windows/GNOME), window & app structure, menus and the command model, the desktop keyboard model, layout managers, HiDPI & system fonts, native feel + OS dark mode, a responsive UI thread, undo/redo, desktop a11y APIs and WCAG 2.2 analogues. Qt as the worked example. |
| `web-performance` | Core Web Vitals at the 75th percentile (LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms): lab + field measurement, per-metric fix playbook, JS/image/font/third-party budgets. |

Standing rules in the router: WCAG **AA** is a hard gate; if direction is unspecified, **ask before
building**.

Usage: `/devkit:design` or `/devkit:design redesign the pricing page`.

## `devkit:shipping`

Packaging and deploying. The references chain: build the image → run it on a cluster → provision and
ship it through a pipeline.

| Reference | Covers |
| --- | --- |
| `containerization` | Multi-stage Dockerfiles, small pinned non-root images, layer-cache ordering, BuildKit cache/secret mounts, `.dockerignore`, exec-form entrypoints and `HEALTHCHECK`, runtime secrets, Compose for local dev, size/security verification (dive, Trivy/Scout). |
| `kubernetes` | Controller choice, a production-grade Deployment (requests/limits, distinct liveness/readiness/startup probes, non-root security context, digest-pinned image), ConfigMaps & Secrets, Services/Ingress/Gateway API + cert-manager, HPA, PDB & topology spread, safe rollouts, Kustomize vs Helm, pod-failure debug playbook. |
| `kubernetes-gitops` | Delivery on top of a correct manifest: push vs pull, the deploy loop and rollout control, canary & blue-green (Argo Rollouts, Flagger), GitOps with Argo CD / Flux, multi-environment promotion, rollback & incident response. |
| `cloud-infrastructure` | Twelve-factor baseline, picking the most-managed compute target, Terraform/OpenTofu with remote locked encrypted state, build-once-promote-the-digest pipelines, short-lived OIDC auth, managed secret stores, rolling/blue-green/canary, observability with SLO alerting. The vendor-neutral layer the next two assume. |
| `github-actions` | Production `.github/workflows`: an annotated skeleton, keyless OIDC to a cloud, least-privilege `permissions:`, environments & required reviewers, deployment strategies, reusable workflows vs composite actions, matrix/cache/concurrency, SHA-pinning, attestation/SLSA, Dependabot. |
| `azure-devops` | Production `azure-pipelines.yml`: multi-stage skeleton, workload identity federation (OIDC) service connections, variable groups linked to Key Vault, environments + approvals/checks, deployment-job strategies, templates, speed, supply chain. |

Pipeline starters (GitHub Actions and Azure DevOps, both keyless with a gated prod stage):
`/scaffold cicd-starters`.

Standing rules in the router: no secrets in an image, repo, or manifest (and base64 in a K8s Secret
is encoding, not encryption); no long-lived cloud keys in CI — use OIDC.

Usage: `/devkit:shipping` or `/devkit:shipping my pod is crashing`.

## `devkit:engineering`

The code itself — finding bugs, shaping modules, the database under the app, and firmware.

| Reference | Covers |
| --- | --- |
| `systematic-debugging` | Debugging as a search: reproduce reliably, read the error and stack trace properly, change one variable at a time, bisect, pick the right instrument (logs/debugger/tracing/profiler), common bug classes and their tells, confirm the root cause before fixing. |
| `extensible-architecture` | Adapting without rewrites: module boundaries, dependency inversion & injection, open-closed in practice, ports & adapters, extension points and plugin registries, versioned contracts, refactoring toward seams, feature flags, anti-patterns. |
| `data-modeling` | Modeling to access patterns first, entities & relationships, normalization (1NF–3NF) and when to denormalize, keys/constraints/types/nullability, the SQL-vs-NoSQL selection matrix, ORM & query patterns, naming, schema review. |
| `database-operations` | Keeping a schema fast and safe in production: indexing, reading `EXPLAIN ANALYZE`, expand/contract migrations, connection pooling, transactions & isolation, Postgres config basics, security, backups & PITR with restore drills. |
| `esp32` | ESP32 firmware: picking a toolchain (ESP-IDF / Arduino / PlatformIO), the flash loop and an upload/boot failure table, dual-core FreeRTOS, GPIO & strapping pins, power and brownout, serial/JTAG debugging. |

Principles are engine-neutral; Postgres is the worked example for the two database references.

Standing rules in the router: reproduce before you fix and confirm the root cause with a regression
test that fails first; schema changes are expand/contract — never rename or drop a column in one
deploy.

Usage: `/devkit:engineering` or `/devkit:engineering why is this test flaky`.

## `devkit:process`

How to run the work itself. Front-to-back these compose: sharpen the ask → spec it if it's an app →
split it if it's large → document the result.

| Reference | Covers |
| --- | --- |
| `prompt-enhancement` | Diagnosing what a prompt is missing, classifying each gap as inferable / assumable / blocking, ask-vs-assume by whether the answer changes what you do next, sharp **AskUserQuestion** clarifications, restating cheaply before expensive work. Cross-cutting. |
| `app-prompt` | An **AskUserQuestion** interview across the axes that decide an app (type, platform, features and the MVP cut, users/auth, data, integrations, stack, non-functional, UI, deployment, success criteria & non-goals), compiled into a fixed sectioned spec with testable acceptance criteria, a phased build order, and an explicit handoff. |
| `subagents` | The core loop (decompose → delegate → verify → integrate), roles by intent, self-contained briefs, parallel vs sequential dispatch, adversarial verification, anti-patterns, Claude Code specifics. |
| `subagent-briefs` | Writing the brief a subagent runs on: the role/goal/context/output/boundaries contract, pinning decisions you don't want delegated, a required deviations report, effort scaling, tool grants, recency & honesty rules, verification hooks, and a copy-paste brief template. |
| `documentation` | A README that is a hub not a manual, one doc per major section, the `description` frontmatter contract, a **generated** index between `DOC-INDEX` markers, a code map, plus templates and maintenance rules. This repo's own docs follow it. |

Its `assets/` folder holds the doc-index automation the `documentation` reference tells you to copy.

Standing rule in the router: never bury a decision — ask when the answer changes what you build,
otherwise assume and **write the assumption down**.

Usage: `/devkit:process` or `/devkit:process this request is vague`.

## How the hubs relate

- **process** comes first: it sharpens the ask and, for a whole application, produces the spec that
  routes to the others.
- **design**, **agent-development**, and **engineering** are the build hubs — interfaces, AI
  agents/LLM features, and the code and data underneath. An app can need all three.
- **agent-development** builds *and* measures: the eval references gate the agent the build
  references produce, and `eval-harness-ci` runs as a stage in a **shipping** pipeline.
- **shipping** comes last, and its `containerization` reference depends on what the build produced
  (non-root user, `HEALTHCHECK`, `SIGTERM` handling are exactly what `kubernetes` probes rely on).
  `cloud-infrastructure` is the concept layer; `github-actions` / `azure-devops` are the YAML.
- Inside **design** the references layer: `ui-fundamentals` (§0 direction + craft) → `anti-slop`,
  `structural-variety`, `type-and-color`, `surfaces-and-details` → `design-systems` →
  `web-dolle-mcp` or `desktop-native`, with `web-performance` backstopping the web path.

## Related

- [Usage](usage.md) — how to load these day to day.
- [Architecture](architecture.md) — why hubs and references.
- [Extending](extending.md) — add a reference or a hub.

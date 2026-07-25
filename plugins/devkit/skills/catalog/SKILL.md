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

Section index: `${CLAUDE_PLUGIN_ROOT}/packs/subagent-driven-development/INDEX.md`

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/subagent-driven-development/orchestration/SKILL.md` | Decomposing a large task and orchestrating subagents (explore → plan → implement → verify) — when to split, roles, parallel vs. sequential, verification. |
| `${CLAUDE_PLUGIN_ROOT}/packs/subagent-driven-development/writing-subagent-instructions/SKILL.md` | Writing the brief/system prompt a subagent runs on — the role/goal/context/output/boundaries contract, pinning the decisions you don't want delegated, tool grants, effort scaling, stop conditions, and requiring a deviations report. Read before dispatching, or when asked how to guide/instruct subagents. |

## Documentation

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/documentation/SKILL.md` | Creating or updating project documentation (short README + linked per-section docs + code map). |

## UI/UX design

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/ui-ux-design/SKILL.md` | Designing or reshaping a web page/site — drives the `dolle-mcp` MCP tools (templates, curated palettes, WCAG contrast, gradients, SVG segmentation/tracing, screenshots) and runs a design brief first. Aesthetic-direction craft lives in `ui-design` `fundamentals` §0 (the external `frontend-design` skill is an optional complement). |

## Web performance

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/web-performance/SKILL.md` | Making a page fast — Core Web Vitals (LCP, CLS, INP), measuring lab + field, the per-metric fix playbook, and JS/image/font/third-party budgets. |

## UI design — craft (anti-slop, fundamentals, structure, type & color, surfaces, design systems, data-viz, motion)

Section index: `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/INDEX.md`

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/anti-slop/SKILL.md` | **Anything visual you are about to generate or review** — the named tells of AI-default UI (violet/gradient hero, `100vh` centered hero, three-up icon cards, the AI nav/footer, italic headings, `transition: all`, emoji icons, invented metrics, re-drawn browser chrome) with why each reads as generated and the fix, the escape moves, an audit report format, a six-axis pre-emit self-critique, and a 40-question gate sweep. Read by default with `fundamentals`; also the right read for "does this look AI-generated?" / "make it less generic". |
| `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/fundamentals/SKILL.md` | Designing or reviewing the *craft* of a single UI (tool-agnostic) — visual hierarchy, spacing/type scales, semantic color + WCAG 2.2 contrast, the full set of component states, the four content states, forms, feedback, responsive layout, accessibility, and a review checklist. |
| `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/structural-variety/SKILL.md` | Deciding a page's **shape** before writing markup — the six structural axes, ~20 named whole-page shapes (plus a domain → offer-three table), nav and footer archetypes that escape the two most-recognized AI defaults, hero fit-the-fold + the enrichment hierarchy, section rhythm, and the stamp-then-differ rule so two builds never share a fingerprint. |
| `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/type-and-color/SKILL.md` | Picking a **typeface or a palette** — the display+body(+one outlier) pairing rule, the default faces to avoid and a catalog of foundry-grade free alternatives by voice, ratio scales/display caps/weight/measure/numerals, OKLCH palette construction with tinted neutrals, one accent ≤5%, a dark-mode recipe, and the contrast pairs that fail most often (accent-ink, surface flips, muted-on-tinted). |
| `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/surfaces-and-details/SKILL.md` | **Containers and finish** — when a UI is "correct but still looks generated", or before reaching for a card: the containment ladder (whitespace → hairline → tint → border → elevation) so cards stop being the reflex, radius as one committed language with computed nested corners, hairline/border discipline, elevation recipes for light vs dark (lightness, never glow), density & optical padding, a three-surface limit, and the 1px detail layer (`text-wrap: balance/pretty`, hanging punctuation, focus-ring geometry, selection/caret/accent/tap-highlight colors, `scrollbar-gutter`, `scroll-margin-top`, reserved helper/icon slots, honest cursors). |
| `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/design-systems/SKILL.md` | Making that craft *repeatable* across a product — design tokens (primitive → semantic → component tiers), building the color/type/spacing/elevation/motion scales into tokens, theming (light/dark, multi-brand), a component library (variants × states), governance, and the token-based design-to-dev handoff. Read when the work outlives one screen. |
| `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/data-visualization/SKILL.md` | Building any chart, KPI tile, or dashboard — chart-type selection by the question asked, dashboard layout & hierarchy, categorical/sequential/diverging color, declarative titles & direct labeling, honest scales, chart states, and accessible/responsive charts. |
| `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/motion-and-interaction/SKILL.md` | Designing transitions, micro-interactions, loading choreography, or a motion system — easing/duration intent, choreography & staggered reveals, state & page transitions, gesture feedback, motion tokens, and `prefers-reduced-motion`. |

Complements `ui-ux-design` (Dolle-MCP build workflow) and `gui-design` (native/desktop); aesthetic
direction is built into `fundamentals` §0 and deepened by `anti-slop` (the external `frontend-design`
skill is an optional complement). **Never generate a UI straight from memory when the request is
visual — `anti-slop` exists because the memory default *is* the slop.**

## GUI design — native & desktop

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/gui-design/SKILL.md` | Designing/reviewing a native desktop app (Qt, GTK, WinUI, wxWidgets) — the platform HIG (Apple/Windows/GNOME), window & app structure (menu bar, toolbar, status bar, dialogs, SDI/MDI), menus & the command model, the desktop keyboard model (mnemonics, accelerators, default/cancel), resizable layout via layout managers, HiDPI & system fonts, native feel + OS dark mode, keeping the UI thread responsive (undo/redo, unsaved-changes), and desktop accessibility via the platform a11y API. Sits on top of the UI-design craft skills. |

## Containerization

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/containerization/SKILL.md` | Writing/fixing a Dockerfile or Compose stack — multi-stage builds, small non-root images, layer-cache ordering, `.dockerignore`, healthchecks, secrets handling, and image size/security. |

## Kubernetes

Section index: `${CLAUDE_PLUGIN_ROOT}/packs/kubernetes/INDEX.md`

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/kubernetes/workloads/SKILL.md` | Defining/configuring the workload — Deployments/Services/Ingress, ConfigMaps & Secrets, resource requests/limits, liveness/readiness/startup probes, HPA/PDB, security context, and Kustomize/Helm; debugging a pod that won't run. |
| `${CLAUDE_PLUGIN_ROOT}/packs/kubernetes/deployment-and-gitops/SKILL.md` | Deploying it as a workflow — the rollout loop (`apply`, `kubectl rollout status/undo`, image digests), RollingUpdate vs Recreate, progressive delivery (canary/blue-green via Argo Rollouts or Flagger), GitOps (Argo CD / Flux), and multi-environment promotion. |

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

## Database design & configuration

Section index: `${CLAUDE_PLUGIN_ROOT}/packs/database-design/INDEX.md`

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/database-design/data-modeling/SKILL.md` | Designing a schema or choosing a datastore — entities/relationships, normalization vs. denormalization, keys & constraints, SQL-vs-NoSQL selection by access pattern, and ORM/query patterns (N+1, pagination). |
| `${CLAUDE_PLUGIN_ROOT}/packs/database-design/operations-and-tuning/SKILL.md` | Configuring/operating a database — indexing & EXPLAIN, migrations & versioning, connection pooling, transactions & isolation levels, Postgres tuning, security (least-privilege, encryption, secret rotation), and backups/PITR. |

## AI agent evaluation (eval harness & tracing)

Section index: `${CLAUDE_PLUGIN_ROOT}/packs/agent-evaluation/INDEX.md`

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-evaluation/eval-foundations/SKILL.md` | Deciding what to measure — task/component/trajectory evals, building & growing an eval dataset from failures, offline vs. online, RAG metrics. Read first. |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-evaluation/llm-as-judge/SKILL.md` | Scoring open-ended output with a model — rubrics, pairwise vs. pointwise, the bias catalog + mitigations, validating the judge against human labels. |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-evaluation/eval-harness-ci/SKILL.md` | Gating a prompt/model/graph change — deterministic vs. model-graded assertions, pass-rate thresholds as a CI merge gate, regression suites (promptfoo/DeepEval/Ragas). |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-evaluation/tracing-observability/SKILL.md` | Tracing/monitoring an agent — OpenTelemetry GenAI conventions, online eval, production drift. |
| `${CLAUDE_PLUGIN_ROOT}/packs/agent-evaluation/langgraph-workflow-evals/SKILL.md` | Evaluating a LangChain/**LangGraph** agent specifically — datasets from traces, final-response vs. single-step (node) vs. trajectory evaluators, LangSmith `evaluate`/`aevaluate` + `pytest`, reproducible runs via checkpointing, and gating graph changes. |

The quality-gate complement to `agent-development` (build vs. measure).

## Extensible & modular code architecture

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/extensible-architecture/SKILL.md` | Writing code that is easy to extend/adapt without rewrites — module boundaries & separation of concerns, dependency inversion, open-closed in practice, hexagonal ports-and-adapters, extension points/plugins, stable semantic-versioned contracts, refactoring toward seams, and feature flags. Read BEFORE shaping a module or adding a feature to rigid code. |

## Deployment pipelines (GitHub Actions & Azure DevOps)

Section index: `${CLAUDE_PLUGIN_ROOT}/packs/deployment-pipelines/INDEX.md`

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/deployment-pipelines/github-actions/SKILL.md` | Writing a production GitHub Actions pipeline — `.github/workflows`, reusable workflows/composite actions, OIDC cloud auth, environments & required reviewers, matrix/cache/concurrency, least-privilege `GITHUB_TOKEN`, SHA-pinning, attestation/SLSA, dependabot. |
| `${CLAUDE_PLUGIN_ROOT}/packs/deployment-pipelines/azure-devops/SKILL.md` | Writing a production Azure DevOps pipeline — `azure-pipelines.yml`, multi-stage YAML, templates, deployment jobs & strategies (canary/blue-green/rolling), environments & approvals/checks, variable groups + Key Vault, workload-identity (OIDC) service connections. |

Platform mechanics; read `cloud-infrastructure` first for the vendor-neutral concepts.

## Prompt engineering (the craft of the prompt)

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/prompt-engineering/SKILL.md` | Writing or improving a prompt/system prompt for reliable LLM output (not sharpening a user request — that's `prompt-enhancement`) — prompt structure & XML/delimiters, few-shot, chain-of-thought vs. reasoning models, output/structured-output control, prompt patterns (chaining/routing/parallel/evaluator), eval-driven iteration, and Claude/OpenAI model-specific tips. |

## Systematic debugging

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/systematic-debugging/SKILL.md` | Debugging a failing program, a flaky test, or a production incident — reproduce reliably, read the real error/stack trace, test one hypothesis at a time, bisect the search space (`git bisect`, binary search, delta debugging), pick the right instrument (logs/debugger/tracing/profiler/sanitizers), and confirm the root cause before fixing. Read BEFORE guessing at a fix. |

## Speech interfaces (STT & TTS)

Section index: `${CLAUDE_PLUGIN_ROOT}/packs/speech-interfaces/INDEX.md`

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/speech-interfaces/speech-to-text/SKILL.md` | Adding speech recognition / STT — choosing an engine (cloud vs. open/on-device), streaming vs. batch, audio capture & format, wake words, diarization, and integration patterns. |
| `${CLAUDE_PLUGIN_ROOT}/packs/speech-interfaces/text-to-speech/SKILL.md` | Adding speech synthesis / TTS — choosing an engine, streaming synthesis & first-byte latency, voice/prosody/SSML, audio formats, cost, and integration patterns. |

## Embedded dev boards — ESP32

| Read this file | When the task is… |
| --- | --- |
| `${CLAUDE_PLUGIN_ROOT}/packs/esp32/SKILL.md` | Developing/flashing/debugging ESP32 (and similar boards) — toolchain choice (ESP-IDF/Arduino/PlatformIO), flashing & the upload-failure fixes (hold BOOT while resetting/powering, USB-UART drivers, ports, baud), dual-core FreeRTOS (a task per core via `xTaskCreatePinnedToCore`; WiFi on core 0), GPIO/strapping-pin gotchas, brownout, deep sleep, and serial/JTAG debugging. |

## Scaffolding templates

Runnable starters live under `${CLAUDE_PLUGIN_ROOT}/packs/*/templates/` — `langgraph-workflow` &
`langchain-agent` (`packs/agent-development/`), `promptfoo-eval-ci`
(`packs/agent-evaluation/`), and `cicd-starters` (`packs/deployment-pipelines/`), each with a
`TEMPLATE.md`. To start from one, follow the `/devkit:scaffold` behavior: copy the template's
files (except `TEMPLATE.md`) into the target, replace placeholders, and adapt it to the task.

## If a path doesn't resolve

If `${CLAUDE_PLUGIN_ROOT}` isn't expanded in your environment, the files are in this plugin's
directory (the same install dir this skill was loaded from) — locate them with Glob
(e.g. `**/dolle/devkit/**/packs/**/SKILL.md`), or invoke the matching loader skill instead:
`devkit:agent-development`, `devkit:agent-evaluation`, `devkit:subagents`, `devkit:docs`,
`devkit:ui-ux-design`, `devkit:web-performance`, `devkit:ui-design`, `devkit:gui-design`,
`devkit:extensible-architecture`, `devkit:database-design`, `devkit:systematic-debugging`,
`devkit:containerization`, `devkit:kubernetes`, `devkit:cloud-infrastructure`,
`devkit:deployment-pipelines`, `devkit:speech-interfaces`, `devkit:esp32`,
`devkit:prompt-enhancement`, `devkit:prompt-engineering`, `devkit:app-prompt`, or
`devkit:scaffold`.

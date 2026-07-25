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

`packs/subagent-driven-development/` · 2 skills

Building software by delegating to a team of focused subagents. The loader reads the section
index, then the skill(s) your task needs.

| Skill | Covers |
| --- | --- |
| `orchestration` | The methodology: the core loop (decompose → delegate → verify → integrate), subagent roles, self-contained briefs in summary, parallel vs. sequential dispatch, adversarial verification, anti-patterns, and Claude Code specifics. |
| `writing-subagent-instructions` | The craft of the brief a subagent runs on: the role/goal/context/output/boundaries contract, pinning the decisions you don't want delegated, tool grants, effort scaling, stop & failure conditions, requiring a deviations report, recency/honesty rules, and a copy-paste brief template. |

Usage: `/subagents` (loads the section), `/subagents <task>` (loads + starts), or
`/subagents writing-subagent-instructions` (focus a specific skill).

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
tools first — `golden_rules` (the server's own workflow + the design rules, each wired to the
template that demonstrates it), `list_templates`
/ `get_template_source` / `search_segments` / `screenshot_template` for the ~75 offline templates,
`find_palettes` / `color_palettes` / `color_contrast` / `color_gradients` / `extract_palette` for
color, `generate_theme` / `get_theme` for a contrast-verified OKLCH token set, `design_variation` to
pick a page shape/nav/footer that differs from the last build, `slop_check` to audit the result, and
`segment_svg` / `trace_image_to_svg` for animatable SVG — and runs a **design brief** before building: asking
the user for any unspecified direction (menu bar, page count, single-document vs separate API
entry points, colors/palette, animation, images/SVG, page structure). It builds on the
aesthetic-direction craft in `ui-design` §0 and steers away from the AI-default looks (no purple/violet
by default). Before building it reads three `ui-design` skills — `anti-slop` (tells + the gate sweep it
runs against the finished screenshot), `structural-variety` (state a page shape, nav and footer before
markup) and `type-and-color` (a real pairing and an OKLCH palette instead of a free-handed one).

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

## Section: UI design (craft) — `/ui-design`

`packs/ui-design/` · 8 skills

The **tool-agnostic** craft of great UI, applicable in any tool or stack. A multi-skill section
(`INDEX.md` + eight skills) that the loader reads selectively. Two of them are the defaults:
`fundamentals` makes one screen *work*, and `anti-slop` stops it from being the same screen every
model produces — a UI can satisfy every usability rule and still read as machine-generated.

| Skill | Covers |
| --- | --- |
| `anti-slop` | The **anti-generic pass**, for anything you're about to generate or review visually: the slop signature (what you'll produce if you don't intervene), ~60 named tells across visuals, chrome, motion, copy and implementation — violet/gradient heroes, gradient headlines, the `100vh` all-centered hero, the identical three-up icon-card grid, card-in-card, pure `#000`/`#fff`, a default UI sans as display, italic headings, the AI nav and AI footer, eyebrow-on-every-section, re-drawn browser/phone chrome, emoji-as-icon, invented metrics, `transition: all`, uniform hover-scale, fade-in focus rings, banned marketing openers, off-scale spacing, two-line CTA labels — each with why it reads as generated and the fix. Plus the ten escape moves, an audit report format (severity · why · fix · verdict), a six-axis pre-emit self-critique (philosophy/hierarchy/execution/specificity/restraint/variety, anything <3 triggers a revision), and a 40-question gate sweep where every answer must be "no". |
| `fundamentals` | Getting one screen/component right: visual hierarchy (one primary action per view), a single spacing scale and a small type scale, semantic color roles with WCAG **2.2 AA** contrast (meaning never by color alone), the full set of component states (hover/focus/active/disabled/loading), the four content states (empty/loading/error/overflow), form and feedback design, responsive layout, microcopy, accessibility, and a review checklist. §0 sets aesthetic direction. |
| `structural-variety` | **Page shape** — the fingerprint that survives every palette swap. The six structural axes (section-head placement, body composition, divider language, button voice, image treatment, reveal), ~20 named whole-page shapes to pick from with a domain → offer-three table, nav archetypes and footer archetypes that escape the two most-recognized AI defaults, hero fit-the-fold (1280×800, bottom-weighted padding, headline sized to its length), the enrichment hierarchy (typography-only is always acceptable), section rhythm, and a stamp-then-differ rule so consecutive builds never share a fingerprint. |
| `type-and-color` | The two decisions that give a design away. **Type:** display + body + at most one outlier (three families is the ceiling), the default faces to avoid and a catalog of foundry-grade *free* alternatives by voice with tone pairings, ratio scales, display caps and headline-length buckets, weight contrast ≥300, measure, all-caps leading floors, numerals and real punctuation, roman-headings-only. **Color:** OKLCH four-layer palettes (paper/ink/tinted neutrals/one accent), no zero-chroma greys or pure `#000`/`#fff`, accent ≤5% of a viewport, gradient bans, a dark-mode recipe (paper 12–18%, ink 92–96%, weight −50, elevation by lightness, same hue), and the four contrast pairs that fail most often (surface flips, accent-ink, muted-on-tinted, invisible focus rings). |
| `surfaces-and-details` | **Containers and finish** — the half of "looks generated" that isn't layout or palette. The containment ladder (nothing → whitespace → hairline → tinted surface → bordered card → elevation) so a card needs a card-shaped problem; radius as one committed *language* (square/soft/round/pill) with ≤2 radii and computed nested corners; hairline and border discipline (border *or* tint *or* shadow, never all three); elevation recipes that invert between light and dark (lightness steps, never a glow); density, optical padding, and card ≠ section ≠ page padding; a three-surface limit with every flip stating its own text color. Then the 1px detail layer: `text-wrap: balance/pretty`, hanging punctuation, tabular/oldstyle figures, focus-ring geometry via reserved transparent `outline`, selection/caret/`accent-color`/tap-highlight, `scrollbar-gutter: stable`, `scroll-margin-top` under sticky headers, reserved helper-text and input-icon slots, centered mixed-height rows, honest cursors, and `forced-colors`/zoom/reduced-motion respect. |
| `design-systems` | Making those decisions *repeatable* across a product: the three-tier token architecture (primitive → semantic → component), building the color/type/spacing/elevation/motion scales into tokens, theming (light/dark, multi-brand, density), a component library (variants × states, composition), governance to stop drift, and the token-based design-to-dev handoff. The setup for work that outlives one screen. |
| `data-visualization` | The craft of charts & dashboards: picking the chart from the question asked, dashboard layout & hierarchy, categorical/sequential/diverging color (resolved from tokens, colorblind-safe), declarative titles & direct labeling, honest non-deceptive scales, chart states, and accessible/responsive charts. |
| `motion-and-interaction` | The craft of motion & micro-interactions: what to animate and why, easing/duration intent, choreography & staggered reveals, state & page transitions, gesture feedback, and motion as a tokenized system — every rule paired with `prefers-reduced-motion` and the INP/CLS link. |

It sits under the other design pieces: `fundamentals` §0 + `anti-slop` own aesthetic *direction*,
`structural-variety` / `type-and-color` / `surfaces-and-details` own the shape, surface and finish
decisions, `ui-ux-design` owns the Dolle-MCP *build workflow*, `gui-design` carries the craft onto
native/desktop, and this section owns the *interface craft* beneath them all. `design-systems`,
`data-visualization` and `motion-and-interaction` deepen three specific crafts on top of
`fundamentals`.

Usage: `/ui-design` (loads `anti-slop` + `fundamentals`) or
`/ui-design <screen/component to design or review>`, or a skill name to focus one —
`/ui-design anti-slop`, `/ui-design structural-variety`, `/ui-design type-and-color`,
`/ui-design surfaces-and-details`, `/ui-design design-systems`, `/ui-design data-visualization`,
`/ui-design motion-and-interaction`.

*Credit: the tell taxonomy and gate format in `anti-slop` (and the structural/typographic depth it
draws on) are adapted from the MIT-licensed [Hallmark](https://github.com/Nutlope/hallmark) skill,
reworked to be tool-agnostic and consistent with the rest of devkit.*

## Section: GUI design (native/desktop) — `/gui-design`

`packs/gui-design/SKILL.md` · 1 skill

The desktop/native counterpart to the UI-design and UI/UX sections: the platform layer the web
doesn't have. Following the platform Human Interface Guidelines (Apple/Windows/GNOME) and choosing a
native-vs-consistent stance; window & app structure (menu bar, toolbar, status bar, sidebars,
dialogs, SDI/MDI); menus and the command model (standard menus, mnemonics, platform-standard
accelerators, context menus, enable-vs-hide); the desktop keyboard model (tab order, Enter/Esc
default-and-cancel, label buddies); resizable layout via layout managers and size policies (never
absolute positioning); HiDPI scaling and system fonts; native feel (native widgets/dialogs, OS dark
mode, per-platform dialog button order); a responsive UI thread (long work off-thread, progress +
cancel, undo/redo, unsaved-changes); and desktop accessibility through the platform a11y APIs
(UIA/AT-SPI/NSAccessibility). Uses **Qt** as the worked example and generalizes to GTK/WinUI/wx. It
reads on top of the `ui-design` craft skills.

Usage: `/gui-design` (loads the section) or `/gui-design <desktop app/window to design or review>`.

## Section: Containerization — `/containerization`

`packs/containerization/SKILL.md` · 1 skill

Docker & Compose done right: multi-stage builds (ship the artifact, not the toolchain), small
pinned non-root base images, layer-cache ordering (deps before source), BuildKit cache/secret
mounts, `.dockerignore`, exec-form entrypoints and healthchecks, secrets at runtime (never in
`ENV`/`ARG`/layers), Compose for local multi-service dev, and a size/security verification checklist
(dive, Trivy/Scout). Feeds directly into the kubernetes section.

Usage: `/containerization` (loads the section) or `/containerization <what you're containerizing>`.

## Section: Kubernetes — `/kubernetes`

`packs/kubernetes/` · 2 skills

Running services on K8s, in two stacked skills (`INDEX.md` + two skills):

| Skill | Covers |
| --- | --- |
| `workloads` | Defining/configuring the workload: choosing the controller (Deployment by default), a production-grade Deployment (resource requests/limits, distinct liveness/readiness/startup probes, non-root security context, digest-pinned image), config via ConfigMaps/Secrets (and why base64 Secrets aren't encryption), exposing with Services/Ingress/Gateway API + cert-manager, autoscaling (HPA) and availability (PDB, topology spread), packaging with Kustomize or Helm, and a pod-failure debug playbook. |
| `deployment-and-gitops` | Getting it deployed: push vs. pull delivery, the deploy loop (`apply`, `kubectl rollout status/undo`, image digests), RollingUpdate vs. Recreate, progressive delivery (canary/blue-green via **Argo Rollouts** or **Flagger** with metric-gated promotion & auto-rollback), **GitOps** (**Argo CD** / **Flux**: declarative, pull-based, drift-corrected, app-of-apps), and multi-environment promotion. |

Usage: `/kubernetes` (loads the section), `/kubernetes <what you're deploying or the failure>`, or
`/kubernetes deployment-and-gitops` to focus a skill.

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

## Section: App prompt engineering — `/app-prompt`

`packs/app-prompt/SKILL.md` · 1 skill

A method for turning a rough application idea into a **complete, build-ready specification** that a
downstream implementing agent can execute without guessing — `prompt-enhancement` specialized to app
creation, with a fixed brief and a fixed output template. Like the `ui-ux-design` brief but for the
whole app: it runs a structured **AskUserQuestion** interview across the axes that decide an app
(type & core purpose, platform/form factor, features & the MVP-vs-later cut, users/roles/auth, data
& persistence, external integrations, tech stack, non-functional requirements, UI direction,
deployment/ops, and success criteria & non-goals), then compiles the answers into a clean sectioned
spec — goals/non-goals, users, prioritized features with testable acceptance criteria, data model,
architecture & stack, integrations, UI/interface, non-functional, a **phased build order**,
deployment, assumptions & open questions, and a **handoff** section naming exactly which devkit
sections the builder should load. The interactive interview stays in the main thread; the
`app-prompt-engineer` subagent compiles or audits the spec off the main thread. It routes UI work to
`ui-ux-design` / `gui-design` rather than duplicating it.

Usage: `/app-prompt` (loads the section) or `/app-prompt <app idea>` (loads + runs the brief).

## Section: AI agent evaluation — `/agent-evaluation`

`packs/agent-evaluation/` · 5 skills

The quality gate for the agents `agent-development` builds: how you *prove* an agent works and keep
it from regressing. A multi-skill section (`INDEX.md` + five skills) plus a runnable
eval-in-CI scaffold:

| Skill | Covers |
| --- | --- |
| `eval-foundations` | What to measure — task vs. component vs. trajectory (tool-call correctness, the path), building an eval dataset and growing it from real failures, offline (gate releases) vs. online (watch drift), and RAG metrics. Read first. |
| `llm-as-judge` | Scoring open-ended output with a model — rubric/assertion design, pairwise vs. pointwise, the judge-bias catalog (position/verbosity/self-preference) and mitigations, and validating the judge against human labels. |
| `eval-harness-ci` | Turning evals into a merge gate — deterministic vs. model-graded assertions, pass-rate thresholds, regression suites, and the tooling landscape (promptfoo/DeepEval/Ragas). |
| `tracing-observability` | Tracing & monitoring — OpenTelemetry GenAI semantic conventions, online eval on live traffic, and production-drift monitoring. |
| `langgraph-workflow-evals` | Evaluating a LangChain/**LangGraph** agent specifically — datasets from traces; final-response vs. single-step (node) vs. trajectory evaluators; LangSmith `evaluate`/`aevaluate` + `pytest`; reproducible runs via checkpointing; gating graph changes. Applies the general discipline to LangGraph. |

A `promptfoo-eval-ci` starter under `templates/` wires a first gate in one `/scaffold`.

Usage: `/agent-evaluation` (loads the section), `/agent-evaluation <task>`, or
`/agent-evaluation langgraph-workflow-evals` (focus a skill).

## Section: Extensible code architecture — `/extensible-architecture`

`packs/extensible-architecture/SKILL.md` · 1 skill

The craft of writing code that is easy to extend and adapt *without rewrites*: coupling↓/cohesion↑
as the measure, module boundaries and package-by-feature, dependency inversion and injection,
open-closed in practice (extend via new implementations, not edits), hexagonal ports-and-adapters
to keep the core free of I/O, extension points and plugin/registry design, stable semantic-versioned
contracts, refactoring toward seams (Feathers) and the strangler-fig, and feature flags for safe
incremental change — with a "make-it-extensible" review checklist. The source-structure companion to
`app-prompt`/`subagents` (which produce/decompose the work) and `agent-development`'s workflow design.

Usage: `/extensible-architecture` (loads the section) or `/extensible-architecture <module/feature>`.

## Section: Database design & configuration — `/database-design`

`packs/database-design/` · 2 skills

The data-layer rung between "spec the app" and "ship it" — engine-neutral principles with Postgres as
the worked example. A multi-skill section (`INDEX.md` + two skills):

| Skill | Covers |
| --- | --- |
| `data-modeling` | Designing the schema: modeling to access patterns, entities/relationships, normalization 1NF–3NF and when to denormalize (only when measured), keys/constraints/types, SQL-vs-NoSQL selection, and ORM/query patterns (N+1, pagination). |
| `operations-and-tuning` | Running it in production: indexing & reading EXPLAIN, migrations & versioning (expand/contract, zero-downtime), connection pooling (PgBouncer modes, sizing), transactions & isolation levels, Postgres config, security (least-privilege, TLS, encryption, secret rotation), and backups/PITR. |

Usage: `/database-design` (loads the section), `/database-design <task>`, or
`/database-design operations-and-tuning` (focus a skill).

## Section: Deployment pipelines — `/deployment-pipelines`

`packs/deployment-pipelines/` · 2 skills

Platform-specific CI/CD field manuals — the concrete-YAML companion to `cloud-infrastructure`'s
vendor-neutral concepts. A multi-skill section (`INDEX.md` + two skills) plus starter workflows:

| Skill | Covers |
| --- | --- |
| `github-actions` | Production GitHub Actions — pipeline skeleton, OIDC keyless cloud auth, least-privilege `GITHUB_TOKEN`, environments & required reviewers, deployment strategies, reusable workflows vs. composite actions, matrix/cache/concurrency, and supply-chain hardening (SHA-pinning, `attest-build-provenance`/SLSA, dependabot). |
| `azure-devops` | Production Azure DevOps Pipelines — multi-stage YAML, templates, workload-identity (OIDC) service connections, environments & approvals/checks, variable groups linked to Key Vault, and deployment jobs & strategies (runOnce/rolling/canary/blueGreen). |

A `cicd-starters` template under `templates/` ships an OIDC-authed, prod-gated `deploy.yml` and
`azure-pipelines.yml`.

Usage: `/deployment-pipelines` (loads the section), `/deployment-pipelines <task>`, or
`/deployment-pipelines azure-devops` (focus a skill).

## Section: Prompt engineering — `/prompt-engineering`

`packs/prompt-engineering/SKILL.md` · 1 skill

The craft of writing an effective prompt or system prompt for reliable LLM output — distinct from
`prompt-enhancement` (which sharpens *your* request to Claude). Prompt structure & delimiters (role/
task/context/constraints/output/examples; XML tags; long data at the top), few-shot/multishot,
chain-of-thought vs. reasoning models (when "think step by step" *hurts*), output & structured-output
control, the named prompt patterns (chaining/routing/parallelization/orchestrator-workers/
evaluator-optimizer), instruction hygiene, and eval-driven iteration — Claude-first but portable, with
an OpenAI reasoning-model contrast.

Usage: `/prompt-engineering` (loads the section) or `/prompt-engineering <prompt or task>`.

## Section: Systematic debugging — `/systematic-debugging`

`packs/systematic-debugging/SKILL.md` · 1 skill

A stack-agnostic method for debugging any failing program, flaky test, or production incident —
debugging as a *search*, not a guess: reproduce reliably (a minimal, deterministic repro), read the
real error and stack trace, work one hypothesis at a time (predict → observe), bisect the search
space (`git bisect`, binary search, delta debugging), reach for the right instrument (structured
logs, interactive debuggers/watchpoints, tracing, profilers, sanitizers, core dumps), recognize the
common bug classes and their tells (races/heisenbugs, off-by-one, env/config drift, dependency
version, integration boundary), and confirm the root cause with a failing regression test *before*
fixing. Cross-cutting — it applies to any code, including the agents and pipelines the other sections
build.

Usage: `/systematic-debugging` (loads the section) or `/systematic-debugging <the bug or failing test>`.

## Section: Speech interfaces (STT & TTS) — `/speech-interfaces`

`packs/speech-interfaces/` · 2 skills

Adding voice to an app, practically — engine option matrices and integration patterns, not a single
recommendation. A multi-skill section (`INDEX.md` + two skills):

| Skill | Covers |
| --- | --- |
| `speech-to-text` | Recognition/STT: choosing an engine by constraint (accuracy vs. latency vs. cost vs. on-device/privacy) across cloud (Azure/Google/AWS/Deepgram/OpenAI-Whisper) and open/on-device (whisper.cpp, faster-whisper, Vosk), streaming vs. batch (interim results, endpointing/VAD), audio capture & format, wake words, diarization/timestamps, and integration patterns. |
| `text-to-speech` | Synthesis/TTS: choosing an engine across cloud (Azure/Google/AWS Polly/ElevenLabs/OpenAI) and open/on-device (Piper, Coqui/XTTS, espeak-ng), streaming synthesis & first-byte latency for real-time use, voice/prosody/SSML, audio formats & playback, cost, and integration patterns. |

Vendor specifics move fast — both skills carry a "verify current" note. Pairs with
`agent-development` for two-way voice agents.

Usage: `/speech-interfaces` (loads the section), `/speech-interfaces <task>`, or
`/speech-interfaces text-to-speech` (focus a skill).

## Section: Embedded dev boards — ESP32 — `/esp32`

`packs/esp32/SKILL.md` · 1 skill

A tips-and-tricks field manual for ESP32 (the worked example for embedded dev boards): choosing a
toolchain (ESP-IDF vs. Arduino-ESP32 vs. PlatformIO); flashing and the upload-failure fixes — force
download mode by **holding BOOT while tapping EN/RESET**, or **holding BOOT through power-up until
the flash finishes**, plus USB-UART drivers (CP2102/CH340), ports, baud, bad/charge-only cables, and
`erase_flash`; a symptom→cause→fix upload/boot table; **dual-core FreeRTOS** — pin a task per core
with `xTaskCreatePinnedToCore` (core 0 runs the WiFi/BT stack; Arduino `loop()` runs on core 1), pass
data with queues/semaphores/notifications, feed the watchdog, never block `loop()`; GPIO & strapping
pins (input-only 34–39, ADC2-vs-WiFi conflict, boot-sensitive pins); brownout and deep sleep; and
serial/JTAG debugging (decoding a panic backtrace).

Usage: `/esp32` (loads the section) or `/esp32 <the board task or upload symptom>`.

## How the sections relate

- Within agent-development, LangChain and LangGraph compose — LangChain components run inside
  LangGraph orchestration; the `combining-langchain-and-langgraph` skill ties them together.
- Subagent-driven development is orthogonal and applies to any task, including building the
  agent-development code or writing docs.
- UI/UX design depends on the external Dolle-MCP server for its tools, and layers on the
  aesthetic-direction craft in `ui-design` §0 (the external `frontend-design` skill is an optional complement).
- Web performance pairs with UI/UX design: the motion rules the design section enforces
  (`transform`/`opacity`, reduced-motion) are the same ones that protect the CLS and INP metrics.
  The `web-designer` subagent executes the UI/UX design loop; performance is checked after.
- The design sections layer: **UI design / fundamentals** (§0 aesthetic direction, then the §1+
  interface craft: hierarchy, states, forms, accessibility) → **UI design / design-systems** (make
  it repeatable: tokens, component library, theming) → the build layer, either **UI/UX design**
  (web, on the Dolle-MCP server) or **GUI design** (native/desktop: window chrome, menus, HiDPI,
  platform HIG). GUI design and UI/UX design are siblings — same craft underneath, different
  platform on top. Web performance backstops the web path.
- The three platform sections form a delivery chain: **Containerization** builds the image (its
  non-root user, `HEALTHCHECK`, and `SIGTERM` handling are exactly what **Kubernetes** probes and
  graceful termination depend on), and **Cloud infrastructure** provisions the target and ships it
  through CI/CD — with Kubernetes as one compute option among serverless/containers/PaaS.
- **Prompt enhancement** is cross-cutting: it applies before any of the above. The clarify-first
  discipline it teaches (AskUserQuestion, ask-vs-assume, restate before building) is the same one
  the `ui-ux-design` design brief, the `subagents` self-contained brief, and `deep-research` scope
  narrowing already rely on — this section names the method they share.
- **App prompt engineering** applies that discipline to a whole application: it sits at the very
  front of a build, produces the spec, and then *routes* to the sections that execute it —
  `ui-ux-design`/`gui-design` for the UI, `agent-development` when the app is an AI agent, and
  `containerization`/`kubernetes`/`cloud-infrastructure` for shipping. It is to a full app what the
  `ui-ux-design` brief is to a page. The `app-prompt-engineer` subagent compiles the spec off the
  main thread, the same way `web-designer` executes a settled design brief.
- **Agent development and agent evaluation are a build→measure pair**: `agent-development` builds the
  LangChain/LangGraph agent; `agent-evaluation` proves it works and gates changes against regression.
  The eval-harness plugs into a CI pipeline (`cloud-infrastructure` / `deployment-pipelines`) as a
  merge gate, and `prompt-engineering`'s eval-driven-iteration loop *is* an agent-evaluation dataset.
- **Deployment pipelines is the platform-mechanics layer under cloud infrastructure**: cloud-infra
  owns the vendor-neutral *why* (build-once-promote, OIDC rationale, strategy tradeoffs);
  deployment-pipelines owns the concrete GitHub Actions / Azure DevOps YAML that implements it, and
  ships the container from `containerization` to the `kubernetes`/cloud target.
- **Database design is the data-layer rung** between `app-prompt` (which captures *what* data) and
  `cloud-infrastructure` (which provisions the managed DB *service*): it owns how you model, index,
  migrate, pool, and secure the database itself.
- **Extensible architecture is cross-cutting source-structure craft**: it shapes the code the other
  build sections produce so features slot in without rewrites; pairs naturally with
  `agent-development`'s workflow design and anything `app-prompt`/`subagents` decompose.
- **Prompt engineering vs. prompt enhancement vs. app prompt vs. subagent briefs**: `prompt-engineering`
  is the craft of the prompt *handed to a model*; `prompt-enhancement` sharpens *your* request before
  work; `app-prompt` turns an app idea into a spec; and `subagents`' `writing-subagent-instructions`
  writes the brief a *worker* runs on. Same family, four distinct moments.

- **Kubernetes is now a build→ship pair**: `workloads` defines the manifests; `deployment-and-gitops`
  ships them (rollout loop, Argo Rollouts/Flagger progressive delivery, Argo CD/Flux GitOps that reads
  those very manifests as desired state). It sits between `containerization` (the image) and
  `deployment-pipelines`/`cloud-infrastructure` (the surrounding CI/CD).
- **The design section now has eight crafts, split by failure mode**: `fundamentals` and
  `design-systems` are the base (does it *work*, and does it stay consistent); `anti-slop`,
  `structural-variety`, `type-and-color` and `surfaces-and-details` are the anti-generic layer (does it
  look *made for this*, or like every other generated page — the named tells, plus shape, surface and
  containment/finish, which is where "correct but still generated" usually lives); `data-visualization` and
  `motion-and-interaction` deepen two specific crafts on top, resolving color and motion from
  `design-systems` tokens and honoring `web-performance`'s CLS/INP budgets. `ui-ux-design` executes
  all of it on Dolle-MCP; `gui-design` carries it to native/desktop.
- **LangGraph evaluation closes the agent loop**: `agent-development` builds the graph,
  `agent-evaluation`'s new `langgraph-workflow-evals` measures it (trajectory + node + response) using
  the section's general discipline (`llm-as-judge`, `eval-harness-ci`, `tracing-observability`).
- **Systematic debugging is cross-cutting**, like prompt-enhancement: it applies to any failing code —
  an agent, a pipeline, a query, board firmware — and complements `agent-development`'s troubleshooting
  log with a general method.
- **Speech interfaces and ESP32 extend devkit past the web/cloud stack** into voice apps and embedded
  firmware; speech pairs with `agent-development` (voice agents) and ESP32 with `systematic-debugging`.

## Related

- [Usage](usage.md) — the commands that load these.
- [Architecture](architecture.md) — how loading works.
- [Extending](extending.md) — add a skill or a whole section.

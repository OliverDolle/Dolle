---
description: List the devkit skill sections and how to load each one on demand.
argument-hint: "[optional: a section name to load directly, e.g. agent-development]"
---

You are the devkit menu. Your job is to help the user pick and load a skill **section**. A
section is a group of related skills exposed by one command.
**Do not read or load any pack/skill file as part of showing this menu** — sections stay out of
context until the user explicitly loads one.

If the user passed an argument that clearly names a section (`agent-development`,
`agent-evaluation`, `subagents`, `docs`, `ui-ux-design`, `web-performance`, `ui-design`,
`gui-design`, `extensible-architecture`, `database-design`, `systematic-debugging`,
`containerization`, `kubernetes`, `cloud-infrastructure`, `deployment-pipelines`,
`speech-interfaces`, `esp32`, `prompt-enhancement`, `prompt-engineering`, or `app-prompt`), skip
the menu and run that section's loader
(follow the behavior in the corresponding loader command: read the section's `INDEX.md` if it has
one, then the relevant `SKILL.md` files under `${CLAUDE_PLUGIN_ROOT}/packs/`).

Otherwise, present this menu to the user verbatim (adjust formatting only):

---

**devkit skill sections** — each loads only when you call its command:

| Command | Section | What it gives you |
| --- | --- | --- |
| `/agent-development` | Agent development | Building agents & workflows with LangChain + LangGraph together — plus combining them, workflow design, and a troubleshooting log. (5 skills) |
| `/agent-evaluation` | AI agent evaluation | Proving an agent works & stopping it from regressing — what to measure, LLM-as-judge, a pass-rate CI merge gate, and OpenTelemetry tracing. The quality gate for `/agent-development`. (4 skills + a promptfoo CI scaffold) |
| `/subagents` | Subagent-driven development | Two skills — **orchestration** (decomposing work and running the explore → plan → implement → verify fan-out) and **writing-subagent-instructions** (the craft of the brief each subagent runs on: the contract, pinning non-delegated decisions, tools, effort scaling, deviations report). |
| `/docs` | Documentation | A method for writing a short README that links to per-section docs so the project is easy to navigate. |
| `/ui-ux-design` | UI/UX design | Distinctive web design driven by the Dolle-MCP server (templates, color palettes, WCAG contrast, SVG, screenshots), starting with a short design brief. Aesthetic-direction craft is built into `ui-design` §0. |
| `/web-performance` | Web performance | Making pages fast against Core Web Vitals (LCP, CLS, INP) — measure-first workflow, per-metric fix playbook, and budgets. |
| `/ui-design` | UI design (craft) | Tool-agnostic craft of great UI in four skills — **fundamentals** (hierarchy, spacing/type scales, semantic color & WCAG 2.2 contrast, component & content states, forms, accessibility), **design-systems** (tokens, theming, a component library, dev handoff), **data-visualization** (charts & dashboards), and **motion-and-interaction** (animation & micro-interactions). |
| `/gui-design` | GUI design (native/desktop) | Designing desktop apps (Qt, GTK, WinUI) — platform HIG, window/menu/toolbar structure, the desktop keyboard model, resizable layouts, HiDPI, native feel & OS dark mode, a responsive UI thread, and desktop accessibility. Builds on `/ui-design`. |
| `/extensible-architecture` | Extensible code architecture | Writing code that is easy to extend without rewrites — module boundaries, dependency inversion, open-closed, hexagonal ports-and-adapters, extension points/plugins, semantic-versioned contracts, refactoring toward seams, and feature flags. |
| `/database-design` | Database design & config | Designing and configuring a database — schema/data modeling, normalization, SQL-vs-NoSQL, indexing & EXPLAIN, migrations, connection pooling, transactions & isolation, security, and backups. (2 skills) |
| `/systematic-debugging` | Systematic debugging | A method for debugging any failing program, flaky test, or incident — reproduce reliably, read the real error, one hypothesis at a time, bisect the search space, the right instrument (debugger/tracing/profiler/sanitizers), and confirm root cause before fixing. |
| `/containerization` | Containerization | Docker & Compose done right — multi-stage builds, small non-root images, layer caching, `.dockerignore`, healthchecks, and an image size/security checklist. |
| `/kubernetes` | Kubernetes | Running services on K8s in two skills — **workloads** (Deployments/Services/Ingress, config/secrets, resources, probes, autoscaling, Kustomize/Helm, pod debugging) and **deployment-and-gitops** (rollout loop, canary/blue-green via Argo Rollouts/Flagger, GitOps with Argo CD/Flux). |
| `/cloud-infrastructure` | Cloud infrastructure | CI/CD pipelines, Terraform/IaC, choosing a cloud compute target, OIDC auth, secrets across environments, and observability. |
| `/deployment-pipelines` | Deployment pipelines | Production CI/CD on **GitHub Actions** and **Azure DevOps** — OIDC/workload-identity keyless auth, environments & approvals, deployment strategies, reusable workflows/templates, and supply-chain hardening (SHA-pinning, attestation). (2 skills + starter YAML) |
| `/speech-interfaces` | Speech interfaces (STT/TTS) | Adding voice to an app in two skills — **speech-to-text** (engine options cloud & on-device, streaming vs batch, audio capture, wake words) and **text-to-speech** (engine options, streaming synthesis, SSML/prosody, latency & cost). |
| `/esp32` | Embedded dev boards (ESP32) | Developing/flashing/debugging ESP32 firmware — toolchain choice, the upload-failure fixes (hold BOOT while resetting/powering), dual-core FreeRTOS (a task per core, WiFi on core 0), GPIO/strapping gotchas, brownout, deep sleep, and serial/JTAG debugging. |
| `/prompt-enhancement` | Prompt enhancement | Turning a vague request into a precise prompt — diagnose the gaps, clarify with **AskUserQuestion**, then sharpen and restate before doing the work. |
| `/prompt-engineering` | Prompt engineering | The craft of writing an effective prompt/system prompt — structure & delimiters, few-shot, chain-of-thought vs. reasoning models, structured output, prompt patterns, and eval-driven iteration. (The craft; `/prompt-enhancement` sharpens *your* request.) |
| `/app-prompt` | App prompt engineering | Turning a rough app idea into a build-ready spec — an **AskUserQuestion** interview across the app's axes (type/platform, users/auth, features & MVP scope, data, integrations, stack, deployment), compiled into a clean, sectioned spec with a phased build order and handoff. |

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
Dolle-MCP-driven build/verify loop from a settled design spec), `app-prompt-engineer` (compiles a
settled app brief into a build-ready spec, or audits an existing one, off the main thread).

---

Then stop and wait for the user to choose. Do not load a section unless asked.

Argument (optional): $ARGUMENTS

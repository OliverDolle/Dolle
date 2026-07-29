# App prompt engineering (idea → build-ready spec)

You are a **prompt/product-spec lead**. A one-line app idea ("build me a habit tracker") is not
buildable — an implementing agent handed that will guess the platform, invent a data model, pick a
random stack, and build the wrong thing. Your job is to turn the idea into a **complete,
unambiguous, structured specification** that a receiving agent can execute step by step *without
having to ask you anything*. You do the asking, once, up front.

Two halves, exactly like the ui-ux-design brief: **(1) interview** the user with `AskUserQuestion`
to settle every axis that changes the build, then **(2) compile** the answers into a fixed,
clean-structured spec document. This skill specializes the general `prompt-enhancement` method
(diagnose → ask-vs-assume → sharpen) to application creation, with a fixed brief and a fixed output
template so the handoff is consistent every time.

**Load `prompt-enhancement.md` too (or keep it in mind)** — it owns the ask-vs-assume
discipline and how to write good `AskUserQuestion` calls. This skill is that method aimed at apps.

## Step 0 — Orient before asking

- **Read what already exists.** If this extends a codebase, scan it (stack, structure, conventions,
  existing data model) so you ask about *decisions*, not things the repo already answers. Greenfield
  → note that and move on.
- **Separate the literal ask from the real goal.** "A dashboard" may really be "let ops see failing
  jobs at a glance." Spec the goal.
- **Only ask what changes the build.** Infer what you can, assume sensible defaults for cheap/
  reversible choices (state them), and reserve `AskUserQuestion` for the blocking, path-changing,
  taste-only decisions. One good batched round beats ten timid ones.

## Step 1 — Run the app brief (AskUserQuestion)

Use the **`AskUserQuestion`** tool: 1–4 questions per call, 2–4 mutually-exclusive options each,
a recommended option first (append "(Recommended)"), a one-line consequence per option,
`multiSelect: true` where choices stack (features, platforms, integrations). Skip any axis the user
already specified; don't ask what you can infer. Cover these axes — they are what decide an app:

1. **App type & core purpose.** What kind of application and what single core job? Map the type
   because it routes everything downstream: web app, mobile app, **desktop/GUI app**, CLI tool,
   API/backend service, library/SDK, browser extension, bot (chat/Discord/Slack), AI agent, data
   pipeline/ETL, game. Nail the one-sentence "this app lets <user> <do X> so that <benefit>."

2. **Platform & form factor.** Where it runs and its reach: browser, native desktop (which OSes),
   mobile (iOS/Android/both), server/cloud, terminal. Online-only vs offline-capable; single-user
   vs multi-user; public vs internal.

3. **Core features & MVP scope** (`multiSelect`). List candidate features; split **must-have (MVP)**
   from **later**. The MVP cut is the single most important thing to get explicit — a spec with no
   scope line produces a bloated build. Capture each feature as a user story where you can.

4. **Users, roles & auth.** Who uses it; distinct roles/permissions; how they sign in — none /
   local accounts / OAuth (Google/GitHub…) / SSO / API keys for service-to-service. Any per-role
   access rules.

5. **Data & persistence.** What entities exist and their key relationships; where data lives —
   none / in-memory / local file (JSON/SQLite) / relational DB (Postgres/MySQL) / document/KV /
   cloud store; external data sources or feeds; privacy-sensitive data (PII, secrets).

6. **Integrations & external services** (`multiSelect`). Third parties the app must talk to:
   payments (Stripe…), email/SMS, auth providers, LLM/AI APIs, maps, storage, analytics, webhooks.
   Each integration is a dependency and a config/secret the builder must plan for.

7. **Tech stack & constraints.** Preferred language/framework, or "recommend one and justify it";
   must-use and must-avoid; greenfield vs extend-this-repo; team familiarity. If they defer to you,
   pick a stack in Step 2 and state why.

8. **Non-functional requirements.** Expected scale/load; performance targets; security/privacy/
   compliance (auth hardening, GDPR, PCI); accessibility (route UI work to `devkit:design` → `references/ui-fundamentals.md` +
   `devkit:design` → `references/web-dolle-mcp.md`/`devkit:design` → `references/desktop-native.md`); internationalization; offline/resilience.

9. **UI/UX direction (if it has a UI).** Capture just enough to route and to brief the UI work —
   mood/complexity and whether it's web or native. **Do not design the UI here**; hand it to
   `devkit:design` → `references/web-dolle-mcp.md` (web) or `devkit:design` → `references/desktop-native.md` (desktop), which run their own design brief.
   For a headless app (CLI/API/library), record the interface contract instead (commands/flags,
   endpoints, public API shape).

10. **Deployment, ops & lifecycle.** How it's shipped and run — local only, Docker, a cloud target,
    an app store, a package registry; CI/CD needs; environments; monitoring. Route the heavy work to
    `devkit:shipping` → `references/containerization.md` / `devkit:shipping` → `references/kubernetes.md` / `devkit:shipping` → `references/cloud-infrastructure.md` when relevant.

11. **Success criteria & out-of-scope.** How we'll know the MVP works (concrete, testable);
    explicit **non-goals** (what NOT to build); any milestone/deadline shape.

## Step 2 — Compile the spec (the clean structure)

Fill sensible defaults for anything not settled and **label each as an assumption**; leave genuinely
open items in *Open questions*. If the user deferred the stack, choose one and justify it in a line.
Then emit the spec in **this exact template** — the fixed structure is what lets a receiving agent
parse and execute it every time:

```markdown
# <App name> — Build Specification

## 1. Overview
<2–4 sentences: what it is, who it's for, the core job it does, and why.>

## 2. Goals & non-goals
- **Goals:** <the outcomes the MVP must deliver.>
- **Non-goals (out of scope):** <what we are deliberately NOT building now.>

## 3. Users & roles
| Role | Can do | Auth |
| --- | --- | --- |
| <role> | <permissions> | <method> |

## 4. Features (prioritized)
### MVP (build first)
- **<feature>** — As a <role>, I can <action> so that <benefit>.
  - Acceptance: <testable condition that proves it works.>
### Later (not now)
- <feature> — <one line.>

## 5. Data model
<Entities, key fields, and relationships. A short list or a fenced schema/ERD sketch —
enough for the builder to create tables/types without inventing them.>

## 6. Architecture & tech stack
- **Type:** <web app / desktop / CLI / service / …>
- **Stack:** <language, framework, DB, key libraries> — <one-line rationale per major choice.>
- **Structure:** <suggested modules/dirs or components and how they interact.>

## 7. External integrations
| Service | Purpose | Notes / secrets needed |
| --- | --- | --- |

## 8. UI / interface
<Screens/flows for a GUI app (and which design skill builds them:
devkit:design → references/web-dolle-mcp.md for web, devkit:design → references/desktop-native.md for desktop),
OR the interface contract for a headless app: CLI commands/flags, API endpoints, public API.>

## 9. Non-functional requirements
<Scale, performance, security/privacy/compliance, accessibility, i18n, offline — only what applies.>

## 10. Build order (phased)
1. **Phase 1 — <name>:** <what to build; leaves a runnable, verifiable slice.>
2. **Phase 2 — …**
<Each phase is independently verifiable and builds on the last. This is the builder's roadmap.>

## 11. Deployment & ops
<How it's built, run, and shipped; environments; CI/CD; monitoring — route to the platform skills.>

## 12. Assumptions & open questions
- **Assumptions:** <every default you took, so the user can veto it.>
- **Open questions:** <anything still genuinely undecided.>

## 13. Handoff — instructions to the implementing agent
- Build in the phase order above; after each phase, verify against its acceptance criteria before
  moving on.
- Use the stack in §6 exactly; don't substitute without flagging.
- Load the relevant devkit sections: <e.g. ui-ux-design / gui-design for UI, agent-development for
  an AI agent, containerization / kubernetes / cloud-infrastructure for shipping>.
- Treat §2 non-goals as hard boundaries; ask before expanding scope.
```

## Step 3 — Confirm cheaply, then hand off

- **Echo the spec's spine back in a few lines** (core job, MVP feature list, stack, key assumptions)
  and let the user veto before anyone builds. Catch a misread while it's free.
- **Then hand off.** Either build it yourself following the phased order, or **dispatch the
  `app-prompt-engineer` agent** to compile/normalize a large spec off the main thread, or pass the
  spec straight to a builder. Point the builder at the devkit sections named in §13.
- If the app has a UI, the UI work runs through its own brief (`ui-ux-design` / `gui-design`) — this
  spec feeds it the goal, users, and structure; it doesn't replace that design step.

## The standing bar

- **No ambiguity left.** The receiving agent should never have to guess platform, stack, scope, or
  data shape — if it would, you didn't finish Step 1.
- **MVP-first, scope-honest.** Every feature is tagged MVP-or-later; non-goals are explicit; don't
  let the spec balloon past what the user asked for.
- **Every requirement testable.** A feature without an acceptance condition is a wish, not a spec.
- **Assumptions are visible, never silent.** State each default so it can be vetoed.
- **Structure over prose.** Fill the template's fields; a receiving agent parses fields, not essays.
- **Route, don't duplicate.** UI, containerization, K8s, cloud, and agent-building each have their
  own devkit section — name them in the handoff instead of re-specifying them here.

## Checklist (before calling a spec build-ready)

- [ ] Real goal captured as one sentence (user → action → benefit), not just the literal ask.
- [ ] Every brief axis settled: type/platform, users/auth, features, data, integrations, stack,
      non-functional, deployment, success criteria — asked only what changed the build.
- [ ] MVP vs later is explicit; non-goals stated.
- [ ] Every MVP feature has a testable acceptance condition.
- [ ] Data model and tech stack are concrete (stack justified if you chose it).
- [ ] Build order is phased, each phase independently verifiable.
- [ ] All assumptions listed; open questions separated from decided items.
- [ ] Handoff names the exact devkit sections the builder should load and the scope boundaries.
- [ ] Spec echoed back and confirmed before the build starts.

## Related

- `prompt-enhancement.md` — the general clarify-then-sharpen method this specializes; read it
  for how to run `AskUserQuestion` well and the ask-vs-assume test.
- **`app-prompt-engineer` agent** — compiles/normalizes a settled brief into this template off the
  main thread, or audits an existing spec for the gaps in the checklist. It does not run the
  interactive interview (that stays here, in the main thread).
- `devkit:design` → `references/web-dolle-mcp.md` / `devkit:design` → `references/desktop-native.md` — the UI design briefs this spec hands off to (web /
  native). `devkit:design` → `references/ui-fundamentals.md` for the underlying craft.
- `devkit:agent-development` — when the app *is* an AI agent/workflow, the builder loads this.
- `devkit:shipping` → `references/containerization.md` / `devkit:shipping` → `references/kubernetes.md` / `devkit:shipping` → `references/cloud-infrastructure.md` — the deployment
  targets §11 routes to.
- `subagents.md` — this spec is exactly the kind of no-ambiguity brief a subagent needs; the
  same bar applies.

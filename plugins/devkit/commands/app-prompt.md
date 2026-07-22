---
description: "Use this whenever the user wants to build an application from a rough idea — load it BEFORE building to turn the idea into a complete, build-ready spec a receiving agent can execute without guessing. Runs an AskUserQuestion interview across the app's axes (type/platform, users/auth, features + MVP scope, data, integrations, stack, non-functional, deployment, success criteria), then compiles a clean, sectioned spec with a phased build order and explicit handoff. Use this (not prompt-enhancement) whenever the thing being built is an app or product; prompt-enhancement is for sharpening a general, non-app request. Triggers: 'build an app', 'spec out this app', 'app requirements', 'turn my idea into a spec', 'plan this application', 'write a build brief'."
argument-hint: "[optional: the app idea to spec, e.g. 'a habit tracker with reminders']"
---

**A "build an app / spec this out" request matches this command — load it before building; do not
start coding from a rough idea.** Read the file `${CLAUDE_PLUGIN_ROOT}/packs/app-prompt/SKILL.md` in
full and follow it as the active method for this work. It specializes the `prompt-enhancement`
method — load
`devkit:prompt-enhancement` too and keep its ask-vs-assume discipline in mind.

Then:
1. Confirm in one line that the **app-prompt** section is loaded.
2. Summarize the method in 3–5 bullets: read any existing codebase first; run the app brief with
   **AskUserQuestion** (ask only what changes the build — type/platform, users/auth, features & MVP
   scope, data, integrations, stack, non-functional, deployment, success criteria); compile the
   answers into the fixed spec template (goals/non-goals, users, prioritized features with testable
   acceptance, data model, stack, integrations, UI/interface, non-functional, **phased build
   order**, deployment, assumptions, and a **handoff** naming which devkit sections the builder
   loads); echo the spec back and confirm cheaply before building.
3. If the user gave an app idea below, start on it — run the brief (via `AskUserQuestion`) for
   whatever they left open before writing the spec. Route UI work to `devkit:ui-ux-design`
   (web) or `devkit:gui-design` (native); for a large spec you can dispatch the
   `app-prompt-engineer` agent to compile it off the main thread.

User task (optional): $ARGUMENTS

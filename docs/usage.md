---
title: Usage
description: >-
  Day-to-day use of devkit: the /devkit menu, invoking one of the four hubs, how a hub's router picks
  a reference, dispatching the bundled subagents, and what the two hooks do. Includes the one
  permission rule that stops reference reads from prompting.
order: 20
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

# Usage

> The menu, invoking a hub, how references get picked, subagents, and the hooks.

## Overview

devkit is **four hubs**. Invoking one loads a short router — one row per reference saying when to
read it — and Claude then reads only the reference the task needs.

```
startup            4 descriptions (~568 tokens). Nothing else.
/devkit:shipping   router arrives (1.4 KB, no file read, no prompt)
   └─ reads references/kubernetes.md   (9.6 KB — only this one)
```

Two levels, two costs. You never pay for `cloud-infrastructure` while debugging a pod.

## The menu

```
/devkit
```

Lists the four hubs and the references inside each. Loads nothing. Jump straight in with
`/devkit design` or `/devkit kubernetes` — a topic name resolves to its owning hub.

## Invoking a hub

| Invoke | Covers | References |
| --- | --- | --- |
| `/devkit:agent-development` | LangChain + LangGraph agents and workflows | `langchain-agents`, `langgraph-workflows`, `combining-langchain-and-langgraph`, `workflow-design`, `troubleshooting` |
| `/devkit:design` | Any interface — web, desktop, UI craft, design systems, page speed | `ui-fundamentals`, `design-systems`, `web-dolle-mcp`, `desktop-native`, `web-performance` |
| `/devkit:shipping` | Packaging & deploying | `containerization`, `kubernetes`, `cloud-infrastructure` |
| `/devkit:process` | How to run the work | `prompt-enhancement`, `app-prompt`, `subagents`, `documentation` |

Pass a task to load and start immediately:

```
/devkit:design                                  # router only — pick a reference after
/devkit:design redesign the pricing page        # router, then web-dolle-mcp + ui-fundamentals
/devkit:shipping my pod is crashing             # router, then kubernetes
/devkit:process this request is vague           # router, then prompt-enhancement
```

You usually don't need to name a hub at all. Each description carries its domain's trigger phrases,
so "my pod is crashing", "review my UI", "write a Dockerfile", or "build a LangGraph workflow" match
a hub on their own and Claude invokes it. The slash forms are the manual override.

The `devkit:` prefix is optional when nothing else claims the name; keep it when in doubt.

## Stop reference reads from prompting

A reference is a real file read. Outside auto-accept mode that prompts, and a declined prompt means
the depth silently doesn't load. One rule fixes it for good:

```bash
claude config add permissions.allow 'Read(//C:/Users/Oliver/.claude/plugins/cache/dolle/**)'
```

Routers are unaffected either way — invoking a hub never reads a file.

## Other commands

Three commands remain, for behavior a skill can't provide:

| Command | Does |
| --- | --- |
| `/devkit` | The menu — lists the hubs and their references without loading one. |
| `/scaffold` | Start a project/component from a bundled template (e.g. a LangGraph or LangChain starter) and adapt it to your task. |
| `/mcp-preview-server` | Start the bundled Dolle-MCP live preview server (if it isn't running) and print its gallery URL. Optionally pass a template id (e.g. `/mcp-preview-server charts`) to open it in the browser. |

`/mcp-preview-server` relies on the **Dolle-MCP** server, which devkit bundles and registers
automatically (see [Installation](installation.md#bundled-mcp-server-dolle-mcp)).

## Subagents

Four subagents ship with devkit and can be dispatched for larger jobs. Each has the **Skill** tool
and loads its own hub, so you don't have to load anything first.

- **`agent-developer`** — designs and builds LangChain + LangGraph agents/workflows, and debugs them
  against the troubleshooting log.
- **`doc-writer`** — creates/updates documentation following the documentation method.
- **`web-designer`** — takes a settled design spec and runs the Dolle-MCP-driven build/verify loop
  (templates, palettes, screenshots) off the main thread.
- **`app-prompt-engineer`** — takes a settled app brief and compiles it into a build-ready spec (or
  audits an existing one) off the main thread.

Ask naturally ("use the agent-developer subagent to build the ingestion workflow") or let Claude pick
them from their descriptions. The interactive **AskUserQuestion** interviews stay in the main thread.

## Hooks

- **SessionStart** — one line naming the four hubs and the router-plus-references shape.
- **UserPromptSubmit** — if your prompt hits a topic keyword, it names the hub **and the exact
  reference** (e.g. `devkit:shipping (references/kubernetes.md)`), so Claude skips scanning the
  router. Silent on unrelated prompts.

Both are Node scripts under `plugins/devkit/hooks/scripts/`, so they behave the same on Windows,
macOS, and Linux. To disable them, remove the entries from `plugins/devkit/hooks/hooks.json`.

## Desktop vs. CLI

No functional difference. Hubs, commands, subagents, and hooks work identically; the desktop app
gives you a graphical command menu instead of typing `/`-commands into a terminal.

## Related

- [Skill hubs](skill-packs.md) — what each reference covers.
- [Architecture](architecture.md) — why hubs and references.
- [Extending](extending.md) — add a reference or a hub.

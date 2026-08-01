---
title: Installation
description: >-
  How to add the devkit marketplace and install the plugin, in both the Claude Code CLI and the
  desktop app. Covers prerequisites, verifying the install, updating, uninstalling, and enabling
  it for a whole team.
order: 10
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

# Installation

> How to add the devkit marketplace and install the plugin, in both the Claude Code CLI and
> the desktop app.

## Overview

devkit is distributed as a **plugin marketplace**: this repository's `.claude-plugin/marketplace.json`
lists the `devkit` plugin, which lives in `plugins/devkit/`. You add the marketplace once, then
install (and later update) the plugin from it.

## Prerequisites

- Claude Code installed and working.
- Node.js on your PATH (Claude Code requires it; devkit's hooks use it).
- Access to this repository — either the GitHub repo or a local clone.
- [`uv`](https://docs.astral.sh/uv/) on your PATH — only needed for the bundled **Dolle-MCP**
  server (see below). For its screenshot tools, also run once per machine:
  `uvx playwright install chromium`.

## CLI

Add the marketplace, then install:

```
/plugin marketplace add OliverDolle/Dolle
/plugin install devkit@dolle
```

You can also add from a local checkout (useful while developing the plugin itself):

```
/plugin marketplace add C:/Users/Oliver/Documents/GitHub/Dolle
/plugin install devkit@dolle
```

Here `dolle` is the marketplace `name` and `devkit` is the plugin `name`.

Verify the install:

```
/help                # devkit entries (/devkit, /devkit:design, /devkit:shipping, ...) appear
/devkit              # shows the hub menu
```

## Desktop app

The desktop app (macOS/Windows) uses the same plugin system:

1. Open the command menu and type `/plugin`.
2. Choose **marketplace add** and enter `OliverDolle/Dolle` (or browse to a local folder).
3. Choose **install**, pick `devkit`, and confirm.
4. Type `/devkit` in the chat to confirm the hub menu appears.

Everything after installation — commands, subagents, hooks — behaves identically in the CLI
and the desktop app.

## Bundled MCP server (Dolle-MCP)

The `design` hub's `web-dolle-mcp` reference is driven by the **[Dolle-MCP](https://github.com/OliverDolle/Dolle-MCP)**
server. devkit **bundles** it — `plugins/devkit/.mcp.json` registers `dolle-mcp` automatically
when the plugin is enabled, so there is **no manual `claude mcp add` step and no separate
approval prompt**. Confirm it with:

```
/mcp        # dolle-mcp should be listed as connected
```

Notes:

- The server launches via `uvx --refresh --from git+https://github.com/OliverDolle/Dolle-MCP@main dolle-mcp`,
  **tracking `main`**, so [`uv`](https://docs.astral.sh/uv/) must be on your PATH (see the
  prerequisites above). No clone or build — `uvx` fetches and runs it on demand, and `--refresh`
  makes each server start re-resolve `main` so a reconnect is enough to pick up new tools.
- Use `/mcp-preview-server` to start the live preview gallery and print its URL.
- If `/mcp` shows it disconnected after an update, reconnect it there (a running MCP server does
  not hot-reload).
- You can still add it standalone (without the plugin) — see the Dolle-MCP README.

### How server updates flow (tracking `main`)

The bundled server **follows Dolle-MCP `main`** (`plugins/devkit/.mcp.json`), so new tools,
templates and segments arrive without waiting for a plugin release:

- **A reconnect is the whole upgrade.** `--refresh` re-resolves `main` on every server start, so
  `/mcp` → **dolle-mcp** → *Reconnect* (or restarting Claude Code) picks up whatever has landed.
  No `/plugin update` needed for server-side changes; that still delivers skills and commands.
- **The trade this makes.** Everyone tracks the same moving target instead of one frozen build,
  which is what you want while the server is evolving quickly — but it also means a broken push
  to `main` reaches every user on their next reconnect, and there is no "which build was I on?"
  to fall back to. Keep `main` green; the Dolle-MCP test suite is the gate.
- **If you need reproducibility again** (a shared team baseline, or bisecting a regression): pin
  the ref back to a tag — `git+https://github.com/OliverDolle/Dolle-MCP@vX.Y.Z` — and drop
  `--refresh`, since changing a tag busts `uvx`'s cache on its own. Release steps live in the
  Dolle-MCP repo's `CLAUDE.md` (“Releasing & how the devkit plugin consumes this server”).
- **Server changes are still worth tagging** even while tracking `main`, so a pin is available
  the moment someone needs one.

## Updating

```
/plugin marketplace update dolle
/plugin update devkit@dolle
```

## Uninstalling

```
/plugin uninstall devkit@dolle
```

## Team distribution

Once this repo is pushed to GitHub, teammates only need the two `/plugin` lines above. To make
the plugin trusted automatically for a project, commit a `.claude/settings.json` that lists the
marketplace and plugin so it is enabled on checkout (see the Claude Code plugin docs for the
exact `enabledPlugins` format).

## Related

- [Usage](usage.md) — what to do once it's installed.
- [Architecture](architecture.md) — how the repo and lazy loading are structured.

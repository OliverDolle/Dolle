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
/help                # devkit commands (/devkit, /agent-development, ...) appear in the list
/devkit              # shows the section menu
```

## Desktop app

The desktop app (macOS/Windows) uses the same plugin system:

1. Open the command menu and type `/plugin`.
2. Choose **marketplace add** and enter `OliverDolle/Dolle` (or browse to a local folder).
3. Choose **install**, pick `devkit`, and confirm.
4. Type `/devkit` in the chat to confirm the menu appears.

Everything after installation — commands, subagents, hooks — behaves identically in the CLI
and the desktop app.

## Bundled MCP server (Dolle-MCP)

The UI/UX design section is driven by the **[Dolle-MCP](https://github.com/OliverDolle/Dolle-MCP)**
server. devkit **bundles** it — `plugins/devkit/.mcp.json` registers `dolle-mcp` automatically
when the plugin is enabled, so there is **no manual `claude mcp add` step and no separate
approval prompt**. Confirm it with:

```
/mcp        # dolle-mcp should be listed as connected
```

Notes:

- The server launches via `uvx --refresh --from git+https://github.com/OliverDolle/Dolle-MCP dolle-mcp`,
  tracking the **latest** default-branch build (no version pin), so [`uv`](https://docs.astral.sh/uv/)
  must be on your PATH (see the prerequisites above). No clone or build — `uvx` fetches and runs it
  on demand, and `--refresh` re-checks for a newer build each launch.
- If `uv` is **not** on your PATH, devkit's SessionStart hook detects it (instead of the server
  failing silently) and prompts the assistant to first **confirm whether you have uv installed**,
  then offer the install command for your OS (Windows / macOS / Linux). Install uv and restart
  Claude Code so the server relaunches; the design skills still work meanwhile, minus the live
  template/palette/contrast/screenshot tooling.
- Use `/mcp-preview-server` to start the live preview gallery and print its URL.
- If `/mcp` shows it disconnected after an update, reconnect it there (a running MCP server does
  not hot-reload).
- You can still add it standalone (without the plugin) — see the Dolle-MCP README.

### How server updates flow (tracks latest)

The bundled server tracks the **latest Dolle-MCP build** from its default branch in
`plugins/devkit/.mcp.json` — there is no version tag to bump, so the two repos can't drift out of
sync because someone forgot to update a pin here:

- **You get the newest server build automatically.** The `--refresh` flag makes `uvx` re-check the
  git source on each launch, so a new commit on Dolle-MCP is picked up the next time the server
  starts (reconnect via `/mcp`, or restart Claude Code). The trade-off is a small startup cost —
  `uvx` needs network at launch to check for updates, and a changed build is re-fetched/rebuilt.
- **Releasing a server change** (maintainers): merge to the Dolle-MCP default branch — that's it.
  No pin bump or plugin release is needed to deliver it.
- **Need everyone frozen on one build** (e.g. to reproduce a bug)? Temporarily pin by appending
  `@vX.Y.Z` to the `git+…` URL and dropping `--refresh`; revert to track latest again afterward.

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

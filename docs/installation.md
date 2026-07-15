---
title: Installation
description: >-
  How to add the devkit marketplace and install the plugin, in both the Claude Code CLI and the
  desktop app. Covers prerequisites, verifying the install, updating, uninstalling, and enabling
  it for a whole team.
order: 10
---

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

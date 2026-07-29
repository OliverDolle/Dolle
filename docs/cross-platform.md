---
title: Cross-platform
description: >-
  How to use devkit's references with agents other than Claude Code, such as Codex and Cursor.
  Explains that every reference is portable plain Markdown you can point at directly, and which
  plugin features (skills, commands, marketplace, hooks) do not carry over.
order: 60
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

# Cross-platform

> Using the devkit skills with Codex, Cursor, and other agents beyond Claude Code.

## Overview

The plugin machinery (marketplace, the Skill tool, `/`-commands, hooks) is specific to Claude Code,
but the **value — the references — is plain Markdown**. Every reference is one self-contained file
under `plugins/devkit/skills/<hub>/references/`, with no frontmatter, so any agent that can read a
file can use it. This page shows how to wire them into other tools.

## Claude Code (native)

Full experience: marketplace install, four hubs whose routers load on invoke with no file read,
references read on demand, subagents, and hooks. See [Installation](installation.md) and
[Usage](usage.md).

## Codex

Codex reads an `AGENTS.md` for project context and supports custom prompts.

- The repo's root [`AGENTS.md`](../AGENTS.md) maps every topic to its reference path and tells Codex
  to read the relevant one before working on that topic.
- To mimic invoking a hub, add a custom prompt (e.g. under your Codex prompts directory) whose body
  is: *"Read `plugins/devkit/skills/agent-development/SKILL.md` for the reference table, then read
  the reference this task needs and follow it."* One prompt per hub gives you the same on-demand
  loading.

## Cursor / Windsurf and other IDE agents

- Point the agent at a reference explicitly: *"Follow
  `plugins/devkit/skills/agent-development/references/langgraph-workflows.md`."*
- Or turn a reference into a project rule (e.g. a `.cursor/rules/*.mdc` file) by pasting its body and
  scoping it to relevant files. Prefer referencing the file so there's one source of truth.

## Any LLM tool / raw API

Copy the relevant `references/*.md` into your system prompt or context when the task calls for it.
Each reference is self-contained, so one file is usually all you need — read the hub's `SKILL.md`
first only if you're unsure which reference applies.

## Keeping one source of truth

Wherever possible, **point at** the reference file rather than copying its text, so updates in
`plugins/devkit/skills/` propagate everywhere. Copy only when a tool can't read repo files directly.

## What does not port

- The Skill tool, `/`-commands, the marketplace, and `${CLAUDE_PLUGIN_ROOT}` are Claude Code
  features. Outside Claude Code you read the router by path instead of invoking it — the content is
  identical, you just pay one extra file read.
- The Node hooks rely on Claude Code's hook events; other tools have their own mechanisms
  (e.g. Codex/Cursor rules) you'd configure separately.

## Related

- [Skill hubs](skill-packs.md) — the portable content.
- [Extending](extending.md) — add references that stay portable.

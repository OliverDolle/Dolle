---
title: Cross-platform
description: >-
  How to use the skills with agents other than Claude Code, such as Codex and Cursor. Explains
  that the skills are portable Markdown you can reference directly, and which plugin features
  (commands, marketplace, hooks) do not carry over.
order: 60
---

# Cross-platform

> Using the devkit skills with Codex, Cursor, and other agents beyond Claude Code.

## Overview

The plugin machinery (marketplace, `/`-commands, hooks) is specific to Claude Code, but the
**value — the skills — is plain Markdown**. Every skill is a single `SKILL.md` under
`plugins/devkit/packs/<section>/`, so any agent that can read a file can use the guidance. This
page shows how to wire them into other tools.

## Claude Code (native)

Full experience: marketplace install, section loader commands, subagents, and hooks. See
[Installation](installation.md) and [Usage](usage.md).

## Codex

Codex reads an `AGENTS.md` for project context and supports custom prompts.

- The repo's root [`AGENTS.md`](../AGENTS.md) points Codex at the sections/skills and tells it
  to read the relevant one before working on that topic.
- To mimic the loader commands, add a custom prompt (e.g. under your Codex prompts directory)
  whose body is: *"Read `plugins/devkit/packs/agent-development/INDEX.md` and the relevant
  `SKILL.md` files, then follow them for this task."* One prompt per section gives you the same
  on-demand loading.

## Cursor / Windsurf and other IDE agents

- Point the agent at a skill explicitly: *"Follow the guidance in
  `plugins/devkit/packs/agent-development/langgraph-workflows/SKILL.md`."*
- Or turn a skill into a project rule (e.g. a `.cursor/rules/*.mdc` file) by pasting the skill
  body and scoping it to relevant files. Prefer referencing the file so there's one source of
  truth.

## Any LLM tool / raw API

Copy the relevant `SKILL.md` (or a section's `INDEX.md` plus its skills) into your system prompt
or context when the task calls for it. Because each skill is self-contained, one file is often
all you need.

## Keeping one source of truth

Wherever possible, **reference** the skill file rather than copying its text, so updates in
`packs/` propagate everywhere. Copy only when a tool can't read repo files directly.

## What does not port

- `/`-commands, the marketplace, and `${CLAUDE_PLUGIN_ROOT}` are Claude Code features.
- The Node hooks rely on Claude Code's hook events; other tools have their own mechanisms
  (e.g. Codex/Cursor rules) you'd configure separately.

## Related

- [Skill sections](skill-packs.md) — the portable content.
- [Extending](extending.md) — add skills/sections that stay portable.

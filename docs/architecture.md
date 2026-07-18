---
title: Architecture
description: >-
  The repository layout and how command-gated (lazy) loading of skill sections works under the
  hood. Covers the packs-vs-skills distinction, the request flow from command to loaded guidance,
  and why the hooks are Node scripts.
order: 50
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

# Architecture

> Repository layout and how command-gated (lazy) loading of sections works.

## Repository layout

```
Dolle/
├── .claude-plugin/
│   └── marketplace.json        # marketplace listing (name: "dolle")
├── .github/workflows/
│   └── docs-index.yml          # Action: regenerate the README doc index
├── scripts/
│   └── generate-doc-index.mjs  # builds the README index from doc descriptions
├── README.md                   # project hub; index generated between DOC-INDEX markers
├── AGENTS.md                   # entry point for Codex / other agents
├── docs/                       # per-section docs (each with a description frontmatter)
│   ├── code-map.md             # where the large subsystems live
│   └── ...                     # installation, usage, architecture, ...
└── plugins/
    └── devkit/
        ├── .claude-plugin/
        │   └── plugin.json      # plugin manifest (name: "devkit")
        ├── .mcp.json            # bundled Dolle-MCP server (auto-registers on enable)
        ├── commands/            # /devkit menu + loaders + /scaffold + /mcp-preview-server
        ├── agents/              # subagents: agent-developer, doc-writer, web-designer
        ├── skills/              # auto-loaded index skill (catalog) — the ONLY thing scanned
        │   └── catalog/SKILL.md # maps tasks -> which pack file Claude should read
        ├── packs/               # the skill sections — NOT auto-loaded
        │   ├── agent-development/
        │   │   ├── INDEX.md               # section catalog (multi-skill section)
        │   │   ├── langchain-agents/SKILL.md
        │   │   ├── langgraph-workflows/SKILL.md
        │   │   ├── combining-langchain-and-langgraph/SKILL.md
        │   │   ├── workflow-design/SKILL.md
        │   │   └── troubleshooting/SKILL.md
        │   ├── subagent-driven-development/SKILL.md   # single-skill section
        │   ├── documentation/
        │   │   ├── SKILL.md                           # single-skill section
        │   │   └── assets/                            # doc-index templates to copy per repo
        │   ├── ui-ux-design/SKILL.md                  # single-skill section
        │   ├── web-performance/SKILL.md               # single-skill section
        │   ├── ui-design/SKILL.md                     # single-skill section
        │   ├── containerization/SKILL.md              # single-skill section
        │   ├── kubernetes/SKILL.md                    # single-skill section
        │   ├── cloud-infrastructure/SKILL.md          # single-skill section
        │   └── prompt-enhancement/SKILL.md            # single-skill section
        └── hooks/
            ├── hooks.json       # SessionStart + UserPromptSubmit
            └── scripts/*.mjs    # Node hook scripts (cross-platform)
```

## Sections and skills

- A **command** loads a **section**.
- A **section** is a folder under `packs/` containing one or more **skills** (each a
  `SKILL.md`).
- A **multi-skill section** (e.g. `agent-development`) adds an `INDEX.md` catalog so the loader
  can read only the skills a task needs. A **single-skill section** is just one `SKILL.md`.

This is what makes the loaders flexible instead of strict: agent development brings in
LangChain *and* LangGraph *and* how to combine them, because they're used together — while
still loading only when you ask.

## The key idea: sections live in `packs/`, not `skills/`

Claude Code auto-discovers plugin `commands/`, `agents/`, and `skills/`. For skills it loads
each skill's name + description into context at startup so the model knows they exist. With
many skills that metadata adds up, and every skill becomes a candidate the model might trigger.

devkit deliberately puts its knowledge in **`packs/`** — a directory Claude Code does **not**
scan. The result:

- At startup, only the lightweight **commands**, the **agent descriptions**, and **one index
  skill** (`skills/catalog`) are known.
- No section content — no pack `SKILL.md` — sits in context until it is read.
- A **loader command** reads the section's `INDEX.md` and/or `SKILL.md` files via
  `${CLAUDE_PLUGIN_ROOT}` only when you run it.

This is the "call a command to expose a section of skills" model, like UI/UX-style pro-max
plugins: a thin menu up front, deep guidance pulled in on demand.

### The catalog skill: model-driven loading

`skills/catalog/SKILL.md` is the single exception that is auto-discovered. Only its short
`description` loads at startup (a few lines); its body — a map of task → which pack file to
read — loads when the skill is invoked, and the packs themselves load only when Claude reads
them. This lets **Claude** find and pull the right section on its own when a task matches,
rather than requiring the user to run a loader. The loader commands remain the manual override.
The heavy content still stays out of startup context either way.

## Request flow

```
startup ─▶ commands + agent descriptions registered (cheap)
   │
   ▼
/devkit ─▶ prints the section menu (loads nothing)
   │
   ▼
/agent-development "build X"
   ├─▶ reads packs/agent-development/INDEX.md
   ├─▶ reads the relevant <skill>/SKILL.md files (langchain + langgraph + combining, ...)
   └─▶ works on X
```

## The `${CLAUDE_PLUGIN_ROOT}` variable

Claude Code substitutes `${CLAUDE_PLUGIN_ROOT}` with the plugin's absolute directory before
running commands, agents, and hook commands. That's how loaders find their section and how
`hooks.json` finds its scripts, regardless of where the plugin is installed.

## Why hooks are Node scripts

Hook `command`s run through the OS shell, and inline `echo`/quoting differs across cmd.exe,
PowerShell, and bash. Because Claude Code already requires Node.js, the hooks call small `.mjs`
scripts instead — identical behavior on every platform, and they emit proper
`hookSpecificOutput` JSON.

## Design choices

- **Skills are single Markdown files**, so any agent can read one. See
  [Cross-platform](cross-platform.md).
- **Skills double as drop-in native skills:** each is a valid `SKILL.md`. Copy or symlink a
  skill folder into `plugins/devkit/skills/` to make it always-on instead of command-gated.
- **Commands are the public API;** sections and skills are the implementation behind them.

## Related

- [Skill sections](skill-packs.md) — the sections and their skills.
- [Extending](extending.md) — add skills, sections, agents, and hooks.
- [Cross-platform](cross-platform.md) — reuse skills outside Claude Code.

---
title: Architecture
description: >-
  The repository layout and how two-level lazy loading works — four hub descriptions at startup, a
  router body on invoke, and references read on demand. Covers why the count of registered skills is
  the only cost you cannot defer, the request flow, and why the hooks are Node scripts.
order: 50
---
<!-- BACK-TO-README:START -->
[← Back to README](../README.md)
<!-- BACK-TO-README:END -->

# Architecture

> Repository layout and how two-level lazy loading works.

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
└── plugins/
    └── devkit/
        ├── .claude-plugin/plugin.json
        ├── .mcp.json            # bundled Dolle-MCP server (auto-registers on enable)
        ├── commands/            # /devkit menu + /scaffold + /mcp-preview-server
        ├── agents/              # agent-developer, doc-writer, web-designer, app-prompt-engineer
        ├── templates/           # runnable starters /scaffold copies
        ├── skills/              # FOUR hubs — the only registered skills
        │   ├── agent-development/
        │   │   ├── SKILL.md     # router
        │   │   └── references/  # langchain-agents, langgraph-workflows, combining,
        │   │                    # workflow-design, troubleshooting
        │   ├── design/
        │   │   ├── SKILL.md
        │   │   └── references/  # ui-fundamentals, design-systems, web-dolle-mcp,
        │   │                    # desktop-native, web-performance
        │   ├── shipping/
        │   │   ├── SKILL.md
        │   │   └── references/  # containerization, kubernetes, cloud-infrastructure
        │   └── process/
        │       ├── SKILL.md
        │       ├── references/  # prompt-enhancement, app-prompt, subagents, documentation
        │       └── assets/      # doc-index automation the documentation reference copies
        └── hooks/
            ├── hooks.json       # SessionStart + UserPromptSubmit
            └── scripts/*.mjs    # Node hook scripts (cross-platform)
```

## The one cost you cannot defer

Claude Code scans `skills/` **once, at session start**, and loads each skill's name + description.
There is no API to register a skill mid-session. So:

- **Descriptions are unavoidable.** Every registered skill costs its description every session,
  whether you use it or not. The only lever is *how many skills are registered*.
- **Bodies are free until invoked.** Any amount of content behind a registered skill costs nothing
  until something invokes it.

That asymmetry sets the whole design: **few skills, deep content.**

## Two levels

```
skills/<hub>/
├── SKILL.md        # invoked -> injected, no tool call, no permission prompt
└── references/*.md # read on demand, only when a row matches the task
```

A hub's `SKILL.md` is a **router**, not a mini-manual: one row per reference saying *when to read it*,
plus the two or three rules that bind regardless. Routers are 1.4–1.8 KB; references are 5–16 KB.

Deliberately **no "what it covers" column.** That reads as helpful but is a table of contents for a
file the model is about to open — it cost ~1 KB per router (34 % of the body) and changed no routing
decision. The *when* column does the picking.

Measured:

| | bytes | tokens |
|---|---|---|
| startup (4 descriptions) | 2,273 | **~568** |
| invoke a hub (router) | 1,427–1,783 | ~360–450 |
| one reference | 5,271–15,645 | ~1,300–3,900 |
| **deferred to references** | 146,586 of 153,216 | **95.7 %** |

For comparison, the original design was 7,743 B of command descriptions at startup (~1,936 tokens)
and every use began with a `Read` that yielded nothing if declined.

## Why four hubs and not twelve

Twelve topic-scoped skills cost 5,711 B of descriptions (~1,428 tokens) every session. Grouping them
into four domain hubs cuts that to 568 while keeping every topic reachable — the hub description
carries its whole domain's trigger phrases, and the router points at the exact reference.

Going further (one hub for everything) would be cheaper still, ~400 B, but a single description would
have to cover Docker *and* typography *and* LangChain. Broad descriptions match badly, so Claude would
stop auto-invoking and you'd be back to typing a command every time. Four domain-scoped descriptions
keep matching reliable. That is also the shape ui-ux-pro-max settled on (7 hubs, 82 % deferred).

## Reference reads are ordinary file reads

Nothing privileged happens when Claude reads `references/kubernetes.md` — it is a `Read` of a file in
the plugin's install directory, and outside auto-accept mode it prompts. What the two-level shape buys
is that the prompt is **conditional and rare** instead of mandatory: the router always arrives free,
and a reference is only read when the task genuinely needs that depth.

To remove the prompt entirely, allowlist the plugin directory once:

```bash
claude config add permissions.allow 'Read(//C:/Users/Oliver/.claude/plugins/cache/dolle/**)'
```

## Request flow

```
startup ─▶ 4 hub descriptions + 3 command descriptions + agent descriptions (~568 tok)
   │
   ▼
/devkit ─▶ prints the hub menu (loads nothing)
   │
   ▼
"my pod is crashing"
   ├─▶ UserPromptSubmit hook: "devkit:shipping (references/kubernetes.md)"
   ├─▶ Skill: devkit:shipping        router injected, 1.4 KB, no prompt
   ├─▶ Read: references/kubernetes.md   9.6 KB — only this one
   └─▶ debugs the pod
```

## The `${CLAUDE_PLUGIN_ROOT}` variable

Claude Code substitutes it with the plugin's absolute directory. Routers use it to point at their own
`references/`, at `process/assets/` (doc-index automation), and at `templates/`.

## Why hooks are Node scripts

Hook `command`s run through the OS shell, and inline `echo`/quoting differs across cmd.exe,
PowerShell, and bash. Because Claude Code already requires Node.js, the hooks call small `.mjs`
scripts instead — identical behavior on every platform, emitting proper `hookSpecificOutput` JSON.

## Design choices

- **References are plain Markdown**, no frontmatter — they aren't skills. Any agent can read one
  directly. See [Cross-platform](cross-platform.md).
- **Commands are for behavior, not loading:** `/devkit` (menu), `/scaffold` (copy and adapt a
  template), `/mcp-preview-server` (start a server, print a URL). Guidance is never a command.
- **The hook names the reference, not just the hub**, so a nudge saves the router scan too.
- **Subagents get the `Skill` tool** and load their own hub rather than reading files by path.

## Related

- [Skill hubs](skill-packs.md) — the hubs and references that ship today.
- [Extending](extending.md) — add a reference or a hub.
- [Cross-platform](cross-platform.md) — reuse the references outside Claude Code.

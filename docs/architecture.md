---
title: Architecture
description: >-
  The repository layout and how two-level lazy loading works — five short hub descriptions at startup,
  a router body on invoke, and references read on demand. Covers why the count of registered skills
  and commands is the only cost you cannot defer, how descriptions are written, the request flow, and
  why the hooks are Node scripts.
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
        ├── skills/              # FIVE hubs — the only registered skills
        │   ├── agent-development/
        │   │   ├── SKILL.md     # router
        │   │   └── references/  # 13: langchain/langgraph, workflow-design, prompt-engineering,
        │   │                    # speech-to/text-to-speech, five eval refs, troubleshooting
        │   ├── design/
        │   │   ├── SKILL.md
        │   │   └── references/  # 11: ui-fundamentals, anti-slop, structural-variety, type-and-color,
        │   │                    # surfaces, motion, data-viz, design-systems, web-dolle-mcp,
        │   │                    # desktop-native, web-performance
        │   ├── shipping/
        │   │   ├── SKILL.md
        │   │   └── references/  # 6: containerization, kubernetes, kubernetes-gitops,
        │   │                    # cloud-infrastructure, github-actions, azure-devops
        │   ├── engineering/
        │   │   ├── SKILL.md
        │   │   └── references/  # 5: systematic-debugging, extensible-architecture,
        │   │                    # data-modeling, database-operations, esp32
        │   └── process/
        │       ├── SKILL.md
        │       ├── references/  # 5: prompt-enhancement, app-prompt, subagents,
        │       │                # subagent-briefs, documentation
        │       └── assets/      # doc-index automation the documentation reference copies
        └── hooks/
            ├── hooks.json       # SessionStart + UserPromptSubmit
            └── scripts/*.mjs    # Node hook scripts (cross-platform)
```

## The one cost you cannot defer

Claude Code scans `skills/` and `commands/` **once, at session start**, and lists each one's name +
description. There is no API to register a skill mid-session. So:

- **Descriptions are unavoidable.** Every registered skill — and every model-invocable command —
  costs its description every session, whether you use it or not. The levers are *how many are
  registered* and *how long each description is*.
- **Bodies are free until invoked.** Any amount of content behind a registered skill costs nothing
  until something invokes it.

That asymmetry sets the whole design: **few skills, short descriptions, deep content.**

Every command stays model-invocable with a one-line "Call…" description (~80–160 B each), so Claude
can run `/devkit`, `/scaffold`, or `/mcp-preview-server` when a task calls for it. The lever for a
command the model should never run is `disable-model-invocation: true` — still a slash command, zero
startup cost — but devkit's three commands all earn their line.

## Two levels

```
skills/<hub>/
├── SKILL.md        # invoked -> injected, no tool call, no permission prompt
└── references/*.md # read on demand, only when a row matches the task
```

A hub's `SKILL.md` is a **router**, not a mini-manual: one row per reference saying *when to read it*,
plus the two or three rules that bind regardless. Routers are 1.3–2.5 KB; references are 4–33 KB.

Deliberately **no "what it covers" column.** That reads as helpful but is a table of contents for a
file the model is about to open — it cost ~1 KB per router (34 % of the body) and changed no routing
decision. The *when* column does the picking.

Measured:

| | bytes | tokens |
|---|---|---|
| startup — 5 hub descriptions | 672 | **~170** |
| startup — everything devkit adds (hubs, 3 commands, 4 agents, SessionStart line) | 2,233 | **~560** |
| invoke a hub (router) | 1,263–2,455 | ~320–610 |
| one reference | 4,392–33,131 | ~1,100–8,300 |
| **deferred to references** | 451,740 of 460,051 | **98.2 %** |

Before this shape settled, devkit put 9,954 B (~2,490 tokens) in every session: four hubs, eight
pack commands whose bodies only said "read this file" (~5 KB of descriptions), long agent
descriptions, and a 537 B SessionStart line. The original design before that was 7,743 B of command
descriptions and every use began with a `Read` that yielded nothing if declined.

## Descriptions are short imperatives

The skill listing *is* the trigger surface: the model decides whether to invoke a hub from its
description alone. A hub description is one line that starts with **"Call before…"** or **"Call
when…"** and names the concrete nouns of its domain:

```
Call before building, restyling, or reviewing any UI — web pages, components, desktop apps, design
systems, color/type, charts, motion, page speed.
```

A short imperative with the right nouns matches as reliably as a long list of quoted trigger phrases,
at a fraction of the bytes — and it tells the model *when* to act, not just what the hub contains.
The per-prompt keyword matching lives in the UserPromptSubmit hook instead, where it costs nothing
unless it fires.

## Why five hubs and not forty

Forty topic-scoped skills would cost a description each, every session. Grouping them into five
domain hubs keeps the listing at ~170 tokens while keeping every topic reachable — the hub
description names its domain, and the router points at the exact reference.

Going further (one hub for everything) would be cheaper still, but a single description would have to
cover Docker *and* typography *and* LangChain. Broad descriptions match badly, so Claude would stop
auto-invoking and you'd be back to typing a command every time. Domain-scoped descriptions keep
matching reliable.

The fifth hub, **engineering**, exists because debugging, code architecture, databases, and firmware
fit none of the other four descriptions — folding them into `process` or `shipping` would have
blurred those descriptions for every session. That is the bar for a new hub.

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
startup ─▶ 5 hub descriptions + 3 command lines + 4 agent descriptions + 1 hook line (~560 tok)
   │
   ▼
/devkit ─▶ prints the hub menu (loads nothing)
   │
   ▼
"my pod is crashing"
   ├─▶ UserPromptSubmit hook: "devkit:shipping (references/kubernetes.md)"
   ├─▶ Skill: devkit:shipping        router injected, 1.5 KB, no prompt
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

The SessionStart hook is one ~170 B line (it runs every session, so it stays tiny). The
UserPromptSubmit hook matches keywords on word boundaries — a trailing `s`/`es` allowed, so `inp`
doesn't fire on "input" nor `pod` on "podcast" — and covers all 40 references.

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

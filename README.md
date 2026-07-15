# Dolle devkit

**devkit** is a Claude Code plugin of *command-gated skill sections* for AI-assisted
development. Instead of loading every skill into context at startup, a **section** (a group of
related skills) stays dormant until you run its command — so your context stays lean and you
pull in focused guidance only when you need it. It ships with skill sections, subagents, and
hooks, and is distributed as a plugin marketplace so a whole team can install it.

Sections today:

- **Agent development** — building agents & workflows with **LangChain + LangGraph** together,
  how to combine them, workflow design, and a troubleshooting log (5 skills).
- **Subagent-driven development** — a methodology for decomposing work across subagents.
- **Documentation** — a short-README-plus-linked-docs method.

## Quickstart (Claude Code)

```
# 1. Add the GitHub repo as a plugin marketplace (works on any machine)
/plugin marketplace add OliverDolle/Dolle

# 2. Install the plugin
/plugin install devkit@dolle

# 3. See the sections, then load one on demand
/devkit
/agent-development build an agent that queries Postgres
```

Nothing from a section is in context until you call its command. Run `/devkit` any time for the
menu.

## Documentation

The table below is generated from each doc's `description` frontmatter by
`scripts/generate-doc-index.mjs` and kept in sync automatically by the
[Docs Index](.github/workflows/docs-index.yml) GitHub Action — don't edit it by hand.

<!-- DOC-INDEX:START -->

| Doc | What it covers |
| --- | --- |
| [Installation](docs/installation.md) | How to add the devkit marketplace and install the plugin, in both the Claude Code CLI and the desktop app. Covers prerequisites, verifying the install, updating, uninstalling, and enabling it for a whole team. |
| [Usage](docs/usage.md) | Day-to-day use of devkit: the /devkit menu, loading skill sections on demand, dispatching the bundled subagents, and what the two hooks do. Explains why loading is command-gated and how it works identically in the CLI and the desktop app. |
| [Skill sections](docs/skill-packs.md) | Describes each skill section, the individual skills inside it, and the command that loads it. Explains the difference between multi-skill sections (with an index) and single-skill sections, and how the sections relate. |
| [Templates & scaffolding](docs/templates.md) | How devkit bundles runnable starter templates that an agent copies into your project and adapts to the task. Covers the /scaffold command, the templates that ship today, how the copy-and-adapt flow works, and how to add your own. |
| [Code map](docs/code-map.md) | A map of where the major parts of the project live in the repository — commands, skill sections, subagents, hooks, and the docs tooling. Points to large entities and their paths, not line-level details. |
| [Architecture](docs/architecture.md) | The repository layout and how command-gated (lazy) loading of skill sections works under the hood. Covers the packs-vs-skills distinction, the request flow from command to loaded guidance, and why the hooks are Node scripts. |
| [Cross-platform](docs/cross-platform.md) | How to use the skills with agents other than Claude Code, such as Codex and Cursor. Explains that the skills are portable Markdown you can reference directly, and which plugin features (commands, marketplace, hooks) do not carry over. |
| [Extending](docs/extending.md) | How to add your own skills, sections, commands, subagents, and hooks to devkit. Includes the file templates and the conventions that keep everything consistent, portable, and out of startup context. |

<!-- DOC-INDEX:END -->

## What's in the box

- **3 skill sections** (`plugins/devkit/packs/`) holding **7 skills** — loaded only via their
  command.
- **5 commands** (`plugins/devkit/commands/`) — `/devkit` (menu), one loader per section, and
  `/scaffold`.
- **1 index skill** (`plugins/devkit/skills/catalog/`) — auto-loaded so Claude can find and read
  the right section itself, without you running a loader command.
- **2 subagents** (`plugins/devkit/agents/`) — `agent-developer`, `doc-writer`.
- **2 hooks** (`plugins/devkit/hooks/`) — a session-start reminder and a topic-aware section
  suggester.
- **Starter templates** (`plugins/devkit/packs/agent-development/templates/`) — runnable
  LangGraph and LangChain skeletons that `/scaffold` copies in and adapts.
- **Self-maintaining docs** — the README index above is generated from each doc's `description`
  by `scripts/generate-doc-index.mjs`, kept in sync by a GitHub Action.

## Requirements

- **Claude Code** for the full plugin experience.
- **Node.js** for the hooks (already required by Claude Code itself).
- Other agents (Codex, Cursor, …) can use the skills as portable Markdown — see
  [Cross-platform](docs/cross-platform.md).

## License

No license file is included yet — add one before sharing publicly if you want to set reuse
terms.

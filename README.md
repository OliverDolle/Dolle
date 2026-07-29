# Dolle devkit

**devkit** is a Claude Code plugin of *on-demand guidance* for AI-assisted development, built so it
costs almost nothing to have installed. It registers **four skill hubs**; only their four
descriptions sit in startup context (~568 tokens). Invoking a hub loads a short **router** (1.4–1.8 KB)
listing its references and when to read each; Claude then reads only the one the task needs. **95.7 %
of the content never enters context unless it's relevant.** It ships with hubs, subagents, hooks, and
a **bundled [Dolle-MCP](https://github.com/OliverDolle/Dolle-MCP) server**, distributed as a plugin
marketplace so a whole team can install it.

The four hubs:

| Hub | Covers | References |
| --- | --- | --- |
| **agent-development** | Building agents & workflows with **LangChain + LangGraph** together | `langchain-agents`, `langgraph-workflows`, `combining-langchain-and-langgraph`, `workflow-design`, `troubleshooting` |
| **design** | Any interface — web pages via the bundled [Dolle-MCP](https://github.com/OliverDolle/Dolle-MCP) server, native/desktop GUIs (Qt, GTK, WinUI), the UI craft under both, design systems, and Core Web Vitals | `ui-fundamentals`, `design-systems`, `web-dolle-mcp`, `desktop-native`, `web-performance` |
| **shipping** | Packaging & deploying — Docker & Compose, Kubernetes, CI/CD and Terraform | `containerization`, `kubernetes`, `cloud-infrastructure` |
| **process** | How to run the work — sharpening a vague ask, turning an app idea into a build-ready spec, decomposing across subagents, and a documentation method | `prompt-enhancement`, `app-prompt`, `subagents`, `documentation` |

Full detail on every reference: [Skill hubs](docs/skill-packs.md).

## Quickstart (Claude Code)

```
# 1. Add the GitHub repo as a plugin marketplace (works on any machine)
/plugin marketplace add OliverDolle/Dolle

# 2. Install the plugin
/plugin install devkit@dolle

# 3. See the hubs, then load one on demand
/devkit
/devkit:agent-development build an agent that queries Postgres
```

Nothing but the four descriptions is in context until a hub is invoked — by you, or by Claude matching
your request against a hub description ("my pod is crashing", "review my UI", "write a Dockerfile" all
match on their own). Run `/devkit` any time for the menu.

**One-time setup worth doing:** allowlist the plugin directory so reading a reference never prompts.

```bash
claude config add permissions.allow 'Read(//C:/Users/Oliver/.claude/plugins/cache/dolle/**)'
```

Installing the plugin also **registers the bundled Dolle-MCP server automatically** — confirm
with `/mcp` (look for `dolle-mcp`, connected) and run `/mcp-preview-server` to open its live
preview. This needs [`uv`](https://docs.astral.sh/uv/) on your PATH (see below).

## Bundled MCP server (Dolle-MCP)

devkit bundles the **[Dolle-MCP](https://github.com/OliverDolle/Dolle-MCP)** server — an MCP
server that serves a library of UI themes/templates (components, charts, parallax/scroll, CSS &
WebGL 3D, motion, SVG animation) plus color-palette, WCAG-contrast, SVG-tracing, and screenshot
tools. It powers the `design` hub's `web-dolle-mcp` reference and the `web-designer` subagent.

Because it's bundled (`plugins/devkit/.mcp.json`), it **registers automatically when the plugin
is enabled** — no separate `claude mcp add`, and no extra approval prompt. Verify with `/mcp`
(look for `dolle-mcp`, connected).

- **Prerequisite:** [`uv`](https://docs.astral.sh/uv/) on your PATH — the server launches via
  `uvx --from git+https://github.com/OliverDolle/Dolle-MCP dolle-mcp`, fetched and run on demand
  (no clone, no build). For the screenshot tools, run `uvx playwright install chromium` once.
- **Live preview:** run **`/mcp-preview-server`** any time to start the preview gallery and get
  its URL (pass a template id, e.g. `/mcp-preview-server charts`, to open it deep-linked).
- **After updates:** a running MCP server doesn't hot-reload — reconnect it in `/mcp`.
- **Reference:** setup and troubleshooting in
  [Installation → Bundled MCP server](docs/installation.md#bundled-mcp-server-dolle-mcp); the
  full tool/template reference lives in the
  [Dolle-MCP repo](https://github.com/OliverDolle/Dolle-MCP).

## Documentation

The table below is generated from each doc's `description` frontmatter by
`scripts/generate-doc-index.mjs` and kept in sync automatically by the
[Docs Index](.github/workflows/docs-index.yml) GitHub Action — don't edit it by hand.

<!-- DOC-INDEX:START -->

| Doc | What it covers |
| --- | --- |
| [Installation](docs/installation.md) | How to add the devkit marketplace and install the plugin, in both the Claude Code CLI and the desktop app. Covers prerequisites, verifying the install, updating, uninstalling, and enabling it for a whole team. |
| [Usage](docs/usage.md) | Day-to-day use of devkit: the /devkit menu, invoking one of the four hubs, how a hub's router picks a reference, dispatching the bundled subagents, and what the two hooks do. Includes the one permission rule that stops reference reads from prompting. |
| [Skill hubs](docs/skill-packs.md) | The four devkit hubs, the references inside each, and what every reference covers. Explains the router-plus-references shape that keeps startup context to four descriptions and loads only the depth a task needs. |
| [Templates & scaffolding](docs/templates.md) | How devkit bundles runnable starter templates that an agent copies into your project and adapts to the task. Covers the /scaffold command, the templates that ship today, how the copy-and-adapt flow works, and how to add your own. |
| [Code map](docs/code-map.md) | A map of where the major parts of the project live in the repository — the four skill hubs and their references, commands, subagents, templates, hooks, and the docs tooling. Points to large entities and their paths, not line-level details. |
| [Architecture](docs/architecture.md) | The repository layout and how two-level lazy loading works — four hub descriptions at startup, a router body on invoke, and references read on demand. Covers why the count of registered skills is the only cost you cannot defer, the request flow, and why the hooks are Node scripts. |
| [Cross-platform](docs/cross-platform.md) | How to use devkit's references with agents other than Claude Code, such as Codex and Cursor. Explains that every reference is portable plain Markdown you can point at directly, and which plugin features (skills, commands, marketplace, hooks) do not carry over. |
| [Extending](docs/extending.md) | How to add a reference to an existing hub, add a whole new hub, and add commands, subagents, templates, and hooks. Includes the file templates and the conventions that keep startup context to four descriptions. |

<!-- DOC-INDEX:END -->

## What's in the box

- **4 skill hubs** (`plugins/devkit/skills/`) holding **17 references** — 2,273 B of descriptions at
  startup, 1.4–1.8 KB per router on invoke, and 95.7 % of the 153 KB of content deferred to
  references read only when a task needs them.
- **3 commands** (`plugins/devkit/commands/`) — `/devkit` (menu), `/scaffold`, and
  `/mcp-preview-server`. Commands are reserved for behavior a skill can't provide.
- **1 bundled MCP server** (`plugins/devkit/.mcp.json`) — [Dolle-MCP](https://github.com/OliverDolle/Dolle-MCP)
  registers automatically when the plugin is enabled (no manual `claude mcp add`); it powers the
  `design` hub's `web-dolle-mcp` reference and `/mcp-preview-server`.
- **4 subagents** (`plugins/devkit/agents/`) — `agent-developer`, `doc-writer`, `web-designer`,
  `app-prompt-engineer`, each granted the `Skill` tool so it loads its own hub.
- **2 hooks** (`plugins/devkit/hooks/`) — a session-start reminder, and a topic-aware suggester that
  names the hub **and the exact reference** so Claude skips the router scan.
- **Starter templates** (`plugins/devkit/templates/`) — runnable LangGraph and LangChain
  skeletons that `/scaffold` copies in and adapts.
- **Self-maintaining docs** — the README index above is generated from each doc's `description`
  by `scripts/generate-doc-index.mjs`, kept in sync by a GitHub Action.

## Requirements

- **Claude Code** for the full plugin experience.
- **Node.js** for the hooks (already required by Claude Code itself).
- **[`uv`](https://docs.astral.sh/uv/)** on your PATH for the bundled Dolle-MCP server (and
  `uvx playwright install chromium` once, for its screenshot tools). See
  [Installation](docs/installation.md#bundled-mcp-server-dolle-mcp).
- Other agents (Codex, Cursor, …) can use the references as portable Markdown — see
  [Cross-platform](docs/cross-platform.md).

## License

[MIT](LICENSE) © 2026 Oliver Nielsen. The bundled [Dolle-MCP](https://github.com/OliverDolle/Dolle-MCP)
server is MIT-licensed under its own repository.

---
description: List the devkit skill hubs and what each one covers.
argument-hint: "[optional: a hub to load directly, e.g. design]"
---

You are the devkit menu. Your job is to help the user pick and load a **hub**.
**Do not load any hub or read any reference as part of showing this menu.**

If the user passed an argument naming a hub (`agent-development`, `design`, `shipping`, `process`),
skip the menu and invoke it with the **Skill** tool as `devkit:<name>`, passing any remaining text as
its arguments. If the argument names a *topic* instead (e.g. `kubernetes`, `web-performance`,
`docs`), invoke the hub that owns it and go straight to that reference.

Otherwise, present this menu verbatim (adjust formatting only):

---

**devkit — four skill hubs.** Invoking one loads a short router; it names references and when to read
each, so only the depth your task needs enters context.

| Hub | Covers | References |
| --- | --- | --- |
| `/devkit:agent-development` | Building agents & workflows with LangChain + LangGraph | `langchain-agents`, `langgraph-workflows`, `combining-langchain-and-langgraph`, `workflow-design`, `troubleshooting` |
| `/devkit:design` | Any interface — web, desktop, UI craft, design systems, page speed | `ui-fundamentals`, `design-systems`, `web-dolle-mcp`, `desktop-native`, `web-performance` |
| `/devkit:shipping` | Packaging & deploying | `containerization`, `kubernetes`, `cloud-infrastructure` |
| `/devkit:process` | How to run the work | `prompt-enhancement`, `app-prompt`, `subagents`, `documentation` |

Each hub accepts a task, e.g. `/devkit:design redesign the pricing page` or
`/devkit:shipping my pod is crashing` — it loads the router and goes to the right reference.

You can also name a topic and let Claude find the hub: "my pod is crashing", "review my UI",
"write a Dockerfile", "this request is vague" all match a hub description on their own.

Other commands:
- `/scaffold` — start a project/component from a bundled template (e.g. a LangGraph or LangChain
  starter) and adapt it to your task.
- `/mcp-preview-server` — start the bundled Dolle-MCP live preview server (if needed) and print
  its gallery URL, so you don't have to remember or ask for it.

Subagents you can dispatch: `agent-developer`, `doc-writer`, `web-designer` (runs the Dolle-MCP
build/verify loop from a settled design spec), `app-prompt-engineer` (compiles a settled app brief
into a build-ready spec, or audits an existing one, off the main thread).

---

Then stop and wait for the user to choose. Do not load a hub unless asked.

Argument (optional): $ARGUMENTS

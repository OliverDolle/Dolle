---
description: Start the Dolle-MCP live preview server (if it isn't running) and print its gallery URL — so you never have to remember or ask for it.
argument-hint: "[optional: a template id to open in the browser, e.g. 'charts' or 'charts#candlestick', or 'open' for the gallery]"
---

Your one job: hand the user the **Dolle-MCP preview gallery URL** with as little ceremony as
possible. The preview server is started on demand, so start it (if it isn't already) and then
report the live URL. Keep the reply short — the point is the URL, not an explanation.

Steps:

1. **Check the server is available.** The preview tools come from the `dolle-mcp` MCP server
   (tools are namespaced `mcp__dolle-mcp__*`). If those tools are not available, the server
   isn't connected — tell the user how to enable it, then stop:
   - It ships bundled with the **devkit** plugin. If devkit is installed,
     run `/mcp` and reconnect `dolle-mcp`; if not, `/plugin install devkit@dolle` (then approve
     the plugin) registers it automatically — no manual `claude mcp add` needed.
   - Standalone alternative: `claude mcp add dolle-mcp -s user -- uvx --from git+https://github.com/OliverDolle/Dolle-MCP dolle-mcp`.
   - The server needs [`uv`](https://docs.astral.sh/uv/) on the user's `PATH` to launch.

2. **Start / locate the preview.**
   - If the user passed a template id (or `open`) below, call `open_preview` — pass the template
     id, and a segment id too if they wrote `template#segment`. This starts the server **and**
     opens it in their browser, deep-linked to that template/component.
   - Otherwise call `start_preview` — this starts the server in the background without forcing a
     browser tab open.

   Use the base URL the tool **returns** — do not hardcode the port. It reflects `DOLLE_MCP_PORT`
   if the user set it (default `http://127.0.0.1:4321/`). If the default port is already taken
   (e.g. another instance is running it), the server auto-falls-back to a free port — and
   `restart_preview(port?)` can move a running one — so always trust the returned URL. If the call
   fails because the server can't launch, surface the error and the `uv`-on-PATH note from step 1.

3. **Report the URL, prominently** — a short, copyable block:
   - **Gallery:** the returned base URL (e.g. `http://127.0.0.1:4321/`)
   - **Palettes:** `<base>/palettes`
   - **Manifest (tools + resources as JSON):** `<base>/api/manifest.json`

   Then one line: the server keeps running in the background — re-run `/mcp-preview-server`
   any time to get the URL again.

Argument (optional): $ARGUMENTS

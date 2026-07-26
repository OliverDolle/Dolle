---
description: "Use this whenever the user asks to build, design, or restyle a web page, site, landing page, or web UI — load it BEFORE writing any markup or picking colors. This is the web-build workflow: a short design brief, then real templates, curated palettes, WCAG contrast, SVG, and screenshots. NOT for native/desktop apps (use gui-design) and NOT for standalone component or design-system craft (use ui-design). Triggers: 'build a website', 'landing page', 'redesign this page', 'make it look good', 'navbar', 'hero section'."
argument-hint: "[optional: what you're designing, e.g. 'a SaaS landing page']"
---

**A web-design request matches this command — load it before writing any markup; do not design a
site from memory.** Read the file `${CLAUDE_PLUGIN_ROOT}/packs/ui-ux-design/SKILL.md` in full and
follow it as the active method for this work. Its design-craft base is `devkit:ui-design` —
`anti-slop` (the named AI-default tells and the gate sweep) plus `fundamentals` §0 (aesthetic
direction), with `structural-variety`, `type-and-color` and `surfaces-and-details` for the shape,
palette and containment decisions; the external `frontend-design` skill covers similar ground if you
have it, but it is optional, never required.

Then:
1. Confirm in one line that the **ui-ux-design** section is loaded (and note whether the
   `dolle-mcp` MCP server is connected — check `/mcp`; if not, tell the user how to add it).
2. Summarize the method in 3–5 bullets: use the `dolle-mcp` tools first (templates, palettes,
   contrast, SVG, screenshots); run the design brief (ask the user for any unspecified
   direction — menu bar, page count, single-document vs separate API entry points, colors/
   palette, animation, images/SVG, page structure); avoid the AI-default looks (no purple/violet
   by default); plan → build from real template source → verify with screenshots and contrast.
3. **Call `golden_rules()` first** — the server's own workflow plus the design rules, each naming
   the template that demonstrates it. Then **three more calls are not optional:** `design_variation(domain=…, avoid=[…])` before markup
   (so this page differs from the last build — pass any stamp the project's CSS carries),
   `generate_theme(…)` / `get_theme(name)` for the palette rather than hand-picked hex (check its
   `failures` is empty), and `slop_check(<path>)` on what you wrote before handing it back.
4. If the user gave a task below, start on it — run the design brief (via `AskUserQuestion`) for
   whatever they left open before writing any code.

User task (optional): $ARGUMENTS

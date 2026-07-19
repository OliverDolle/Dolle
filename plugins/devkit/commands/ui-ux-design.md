---
description: "Use BEFORE building, designing, or restyling any web page, site, landing page, or UI — before writing markup or picking colors. Runs a quick design brief, then drives real templates, curated palettes, WCAG contrast, SVG, and screenshots. Triggers: 'build a website', 'landing page', 'redesign this page', 'make it look good', 'navbar', 'hero section'."
argument-hint: "[optional: what you're designing, e.g. 'a SaaS landing page']"
---

Read the file `${CLAUDE_PLUGIN_ROOT}/packs/ui-ux-design/SKILL.md` in full and adopt it as active
guidance for the rest of this session. It builds on the `frontend-design` skill — load
`frontend-design:frontend-design` too and treat it as the design-craft base.

Then:
1. Confirm in one line that the **ui-ux-design** section is loaded (and note whether the
   `dolle-mcp` MCP server is connected — check `/mcp`; if not, tell the user how to add it).
2. Summarize the method in 3–5 bullets: use the `dolle-mcp` tools first (templates, palettes,
   contrast, SVG, screenshots); run the design brief (ask the user for any unspecified
   direction — menu bar, page count, single-document vs separate API entry points, colors/
   palette, animation, images/SVG, page structure); avoid the AI-default looks (no purple/violet
   by default); plan → build from real template source → verify with screenshots and contrast.
3. If the user gave a task below, start on it — run the design brief (via `AskUserQuestion`) for
   whatever they left open before writing any code.

User task (optional): $ARGUMENTS
</content>

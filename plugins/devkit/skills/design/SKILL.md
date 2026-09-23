---
name: design
description: Call before building, restyling, or reviewing any UI — web pages, components, desktop apps, design systems, color/type, charts, motion, page speed.
---

# Design — router

> Read only the reference(s) below that the task needs. Name which one in a line, then work from it.

| Reference | Read it when |
| --- | --- |
| `ui-fundamentals` | Designing or reviewing one screen, component, or flow. **Default** — §0 sets the aesthetic direction; the base layer under everything below. |
| `anti-slop` | Before shipping anything visual, or "does this look AI-generated?" — the named tells, escape moves, gate sweep. |
| `structural-variety` | Before markup for any page — page shape, nav/footer archetypes, hero fit. |
| `type-and-color` | Picking typefaces or a palette — pairings, OKLCH, accent discipline, themes. |
| `surfaces-and-details` | Cards, panels, radius/border/shadow decisions; a UI that's correct but flat. |
| `motion-and-interaction` | Animation, transitions, micro-interactions. |
| `data-visualization` | Charts and dashboards. |
| `design-systems` | The work outlives one screen — tokens, theming, a component library, dev handoff. |
| `web-dolle-mcp` | Actually building or restyling web UI. Drives the `dolle-mcp` tools; runs a design brief first. |
| `desktop-native` | A desktop app — Qt, GTK, WinUI, wx. |
| `web-performance` | A page feels slow, or before shipping one. Stands alone. |

Paths: `references/<name>.md`. A web page: `web-dolle-mcp`, which names the three craft references to
read with it.

**Binds regardless:** WCAG **AA** contrast is a hard gate. If direction is unspecified (palette, page
count, structure, animation, platform), **ask before building**.

Dispatch `web-designer` to run the Dolle-MCP build/verify loop off the main thread.

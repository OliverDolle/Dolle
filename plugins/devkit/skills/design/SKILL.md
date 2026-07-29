---
name: design
description: >-
  Designing or reviewing any interface — BEFORE writing markup, picking colors, or building windows.
  Web pages and sites, native/desktop apps, UI craft (hierarchy, spacing/type, semantic color + WCAG
  contrast, component & content states, forms, accessibility), design systems (tokens, theming,
  component library), and Core Web Vitals. Triggers: 'build a website', 'landing page', 'design this
  screen', 'review my UI', 'fix the spacing', 'form design', 'navbar', 'design tokens', 'design
  system', 'theming', 'Qt app', 'desktop app UI', 'PyQt/PySide', 'GTK', 'menu bar', 'page is slow',
  'LCP', 'CLS', 'INP', 'lighthouse'.
---

# Design — router

> Read only the reference(s) below that the task needs. Name which one in a line, then work from it.

| Reference | Read it when |
| --- | --- |
| `ui-fundamentals` | Designing or reviewing one screen, component, or flow. **Default**, and the base layer under `web-dolle-mcp` and `desktop-native`. |
| `design-systems` | The work outlives one screen — a product, component library, several people, a rebrand, a new dark mode. |
| `web-dolle-mcp` | Actually building or restyling web UI. Drives the `dolle-mcp` tools; runs a design brief first. |
| `desktop-native` | A desktop app — Qt, GTK, WinUI, wx. |
| `web-performance` | A page feels slow, or before shipping one. Stands alone. |

Paths: `references/<name>.md`.

**Binds regardless:** WCAG **AA** contrast is a hard gate. If direction is unspecified (palette, page
count, structure, animation, platform), **ask before building**.

Aesthetic *direction* lives in the separate `frontend-design` skill. Dispatch `web-designer` to run
the Dolle-MCP build/verify loop off the main thread.

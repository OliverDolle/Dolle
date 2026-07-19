---
name: ui-design
description: Section index for the craft of great UI. Two skills — fundamentals (getting one screen/component right: hierarchy, spacing, type, color, states, forms, accessibility) and design-systems (making those decisions repeatable across a product: tokens, a component library, theming, and dev handoff). Read fundamentals for a single screen; add design-systems when the work outlives one screen.
---

# UI design — section index

This section is the **tool-agnostic craft** of great UI — the rules that separate a UI that feels
designed from one that feels assembled. It applies whether you're in Figma, hand-writing CSS,
driving the Dolle-MCP library, or building a native app.

It has two skills that stack: **`fundamentals`** gets *one* screen or component right;
**`design-systems`** makes those same decisions *repeatable* across a whole product so nothing
drifts as it grows. Read the one(s) the task needs — you don't have to read both.

## Skills in this section

| Skill | Read it for | File |
| --- | --- | --- |
| **Fundamentals** | Designing/reviewing a single screen, component, or flow — visual hierarchy, spacing & type scales, semantic color + WCAG contrast, every component and content state, forms, feedback, responsive layout, microcopy, accessibility, and a review checklist. | `fundamentals/SKILL.md` |
| **Design systems** | Making the above scale: design tokens (primitive → semantic → component tiers), a component library (variants, a states matrix, composition), theming (light/dark, multi-brand, density), documentation, and design-to-dev handoff. The *setup* a professional stands up before building many screens. | `design-systems/SKILL.md` |

Paths are relative to this section folder (`${CLAUDE_PLUGIN_ROOT}/packs/ui-design/`).

## How to use this section

- **Designing or reviewing one screen/component:** read `fundamentals`. That's usually enough.
- **The work outlives one screen** (a product, a component library, more than one designer or
  engineer, a rebrand or a dark mode): also read `design-systems` — it turns the fundamentals into
  tokens and reusable components so consistency is automatic, not manual.
- **Building it on the web with the Dolle-MCP library:** pair either skill with
  `devkit:ui-ux-design` (the build workflow) and `frontend-design` (aesthetic direction).
- **Building a native/desktop app** (Qt, GTK): use `devkit:gui-design`, which carries the same
  craft onto desktop conventions (window chrome, menus, keyboard model, HiDPI, native a11y).

## How the design skills relate

`frontend-design` (what it should *feel* like) → **fundamentals** (make one screen work) →
**design-systems** (make it repeatable) → `ui-ux-design` (build it on Dolle-MCP) /
`gui-design` (build it native). `web-performance` backstops the web path.

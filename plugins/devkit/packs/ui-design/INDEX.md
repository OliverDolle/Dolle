---
name: ui-design
description: Section index for the craft of great UI. Eight skills — anti-slop (the named AI-default tells, escape moves, audit gates), fundamentals (one screen right: hierarchy, spacing, type, color, states, forms, accessibility), structural-variety (page shape, nav/footer archetypes, hero fit), type-and-color (real pairings, OKLCH palettes, accent & contrast discipline, themes), surfaces-and-details (containers beyond cards, radius/border/elevation, the 1px detail layer), design-systems (tokens, component library, theming, handoff), data-visualization (charts & dashboards), and motion-and-interaction (animation & micro-interactions). Read anti-slop + fundamentals by default; add the others as the work calls for shape, palette depth, container craft, a system, charts, or motion.
---

# UI design — section index

This section is the **tool-agnostic craft** of great UI — the rules that separate a UI that feels
designed from one that feels assembled. It applies whether you're in Figma, hand-writing CSS,
driving the Dolle-MCP library, or building a native app.

Two skills answer the two failure modes. **`fundamentals`** makes one screen *work*.
**`anti-slop`** stops it from being the same screen every model produces — because a UI can satisfy
every usability rule and still read as machine-generated. The other six deepen a specific craft.
Read the ones the task needs; you don't have to read all eight.

## Skills in this section

| Skill | Read it for | File |
| --- | --- | --- |
| **Anti-slop** | Anything visual you're about to *generate* or *review*: the named tells of AI-default UI (violet gradients, `100vh` centered hero, three-up icon cards, the AI nav/footer, `transition: all`, invented metrics, emoji icons), why each reads as generated, the fix, the escape moves, an audit report format, a six-axis pre-emit self-critique, and a 40-question gate sweep. **Read this by default alongside `fundamentals`.** | `anti-slop/SKILL.md` |
| **Fundamentals** | Designing/reviewing a single screen, component, or flow — visual hierarchy, spacing & type scales, semantic color + WCAG contrast, every component and content state, forms, feedback, responsive layout, microcopy, accessibility, and a review checklist. | `fundamentals/SKILL.md` |
| **Structural variety** | Page shape — the fingerprint that survives every palette swap. The six structural axes, ~20 named whole-page shapes to pick from (and a domain → offer-three table), nav & footer archetypes that escape the two most-recognized AI defaults, hero fit/enrichment tiers, section rhythm, and a stamp-then-differ rule. Read before writing markup for a page or site. | `structural-variety/SKILL.md` |
| **Type & color** | The two decisions that give a design away: the display+body(+outlier) pairing rule, faces to avoid and a catalog of foundry-grade free alternatives by voice, ratio scales and display caps, weight/measure/numeral mechanics — plus OKLCH palette construction, tinted neutrals, the ≤5% accent rule, a dark-mode recipe, and the contrast pairs that fail most often. | `type-and-color/SKILL.md` |
| **Surfaces & details** | Containers that aren't reflexively cards, and the 1px layer: the containment ladder (whitespace → rule → tint → border → elevation), radius as a committed language with computed nested corners, hairline/border discipline, elevation recipes for light vs dark, density & optical padding, a three-surface limit — then the detail layer (`text-wrap`, hanging punctuation, focus-ring geometry, selection/caret/accent/tap-highlight, `scrollbar-gutter`, `scroll-margin-top`, reserved slots, honest cursors). Read when a UI is "correct but still looks generated", or before reaching for a card. | `surfaces-and-details/SKILL.md` |
| **Design systems** | Making the above scale: design tokens (primitive → semantic → component tiers), a component library (variants, a states matrix, composition), theming (light/dark, multi-brand, density), documentation, and design-to-dev handoff. The *setup* a professional stands up before building many screens. | `design-systems/SKILL.md` |
| **Data visualization** | The craft of charts & dashboards: chart-type selection by the question asked, dashboard layout & hierarchy, categorical/sequential/diverging color, declarative titles & direct labeling, honest scales, chart states, and accessible/responsive charts. Read when building any chart, KPI tile, or dashboard. | `data-visualization/SKILL.md` |
| **Motion & interaction** | The craft of motion & micro-interactions: what to animate and why, easing/duration intent, choreography, state & page transitions, gesture feedback, the named motion tells, and motion as a tokenized system — every rule paired with `prefers-reduced-motion`. | `motion-and-interaction/SKILL.md` |

Paths are relative to this section folder (`${CLAUDE_PLUGIN_ROOT}/packs/ui-design/`).

## How to use this section

- **Designing or reviewing one screen/component:** read `anti-slop` + `fundamentals`. That's usually
  enough. (`anti-slop` alone is the right read for a pure "does this look AI-generated?" review.)
- **Building a page or site:** add `structural-variety` (pick the shape *before* markup) and
  `type-and-color` (pick the pairing, palette and theme bundle — don't free-hand them).
- **"It's correct but it still looks generated":** read `surfaces-and-details` — it's usually the
  containers (every group wrapped in the same rounded bordered card) and the missing 1px layer, not the
  layout or the palette.
- **The work outlives one screen** (a product, a component library, more than one designer or
  engineer, a rebrand or a dark mode): also read `design-systems` — it turns these rules into tokens
  and reusable components so consistency is automatic, not manual.
- **Building it on the web with the Dolle-MCP library:** pair the above with `devkit:ui-ux-design`
  (the build workflow — templates, curated palettes, `color_contrast`, screenshots).
- **Building a native/desktop app** (Qt, GTK): use `devkit:gui-design`, which carries the same craft
  onto desktop conventions (window chrome, menus, keyboard model, HiDPI, native a11y).

## How the design skills relate

**anti-slop** (don't be generic) + **fundamentals §0** (what it should *feel* like) set direction →
**structural-variety** (page shape), **type-and-color** (type, palette, theme) and
**surfaces-and-details** (containment + finish) execute it →
**fundamentals §1–§12** make it work → **design-systems** makes it repeatable →
`ui-ux-design` builds it on Dolle-MCP / `gui-design` builds it native. `data-visualization` and
`motion-and-interaction` deepen two specific crafts; `web-performance` backstops the web path. (The
external `frontend-design` skill is an optional complement to this section, never a dependency.)

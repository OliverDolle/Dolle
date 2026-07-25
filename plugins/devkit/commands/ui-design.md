---
description: "Use this whenever you are designing or reviewing the craft of any screen, component, or flow — load it BEFORE finalizing a UI. Eight skills: anti-slop (the named AI-default tells, escape moves, audit gates), fundamentals (hierarchy, spacing/type scales, semantic color + WCAG contrast, every component & content state, forms, accessibility), structural-variety (page shape, nav/footer archetypes, hero fit), type-and-color (real type pairings, OKLCH palettes, accent & contrast discipline, themes), surfaces-and-details (containers beyond cards, radius/border/elevation, the 1px detail layer), design-systems (tokens, theming, a component library, dev handoff), data-visualization, and motion-and-interaction. NOT for driving a full website build (use ui-ux-design) and NOT for native/desktop apps (use gui-design). Triggers: 'design this screen', 'review my UI', 'does this look AI-generated', 'anti-slop', 'make it look less generic', 'improve the layout', 'fix the spacing', 'font pairing', 'color palette', 'card design', 'border radius', 'form design', 'design tokens', 'design system', 'component library', 'theming'."
argument-hint: "[optional: the screen/component/flow to design or review, or a skill name — anti-slop | structural-variety | type-and-color | surfaces-and-details | design-systems | data-visualization | motion-and-interaction — to focus it]"
---

**A UI-craft request matches this command — load it before finalizing the design; do not eyeball
spacing, color, states, or a typeface from memory.** Read
`${CLAUDE_PLUGIN_ROOT}/packs/ui-design/INDEX.md`, then the skill(s) the task needs:

- **`anti-slop/SKILL.md`** — the named tells of AI-default UI, the escape moves, the audit report
  format, the pre-emit self-critique, and the gate sweep. **Read this by default** on anything you are
  about to generate or review visually — it is what stops the output from being the same design every
  model produces.
- **`fundamentals/SKILL.md`** — designing or reviewing a single screen/component/flow. **Read this by
  default** too.
- **`structural-variety/SKILL.md`** — before writing markup for a page or site: pick a named page
  shape, nav and footer archetypes, hero fit, section rhythm, and diverge from the last build.
- **`type-and-color/SKILL.md`** — before picking a typeface or writing a palette: pairing rules, real
  free alternatives to the default faces, OKLCH palette layers, accent ≤5%, dark mode, contrast pairs,
  and themes as named bundles you rotate.
- **`surfaces-and-details/SKILL.md`** — when the UI is "correct but still looks generated", or before
  reaching for a card: the containment ladder, radius as one committed language, hairline/elevation
  discipline, optical padding, and the 1px detail layer (`text-wrap`, focus-ring geometry, selection/
  caret/scrollbar, reserved slots, honest cursors).
- **`design-systems/SKILL.md`** — when the work outlives one screen (a product, a component library,
  more than one designer/engineer, a rebrand, or a new dark mode): tokens, theming, and handoff.
- **`data-visualization/SKILL.md`** — any chart, KPI tile, or dashboard.
- **`motion-and-interaction/SKILL.md`** — transitions, micro-interactions, loading choreography, or a
  motion system.

If the argument names a skill, focus that one. Otherwise read `anti-slop` + `fundamentals`, and add
`structural-variety` / `type-and-color` when the task involves a full page, a typeface, or a palette;
`surfaces-and-details` when it involves cards/containers or a "looks generated" complaint;
`design-systems` for tokens/theming/scale; the last two for charts or motion. Follow what you load as
the active method for this work.

Then:
1. Confirm in one line which **ui-design** skill(s) you loaded.
2. Summarize the method in 3–5 bullets. Anti-slop: name the tells before you draft (no violet-gradient
   or `100vh` centered hero, no three-up icon-card grid, no AI nav/footer, no italic heading, no
   invented metrics, no emoji icons); re-seed every decision from the subject; score the six axes and
   revise anything under 3; run the gate sweep — every answer must be "no". Fundamentals: hierarchy
   (one primary action per view); one spacing scale + a small type scale (body ≥16px, 45–75ch); semantic
   color roles with **AA contrast**, meaning never by color alone; design **every** component state and
   all four content states; forms one-column with real labels + inline validation; accessibility is a
   constraint, not a phase. Structural-variety: state a named page shape before markup and make it
   differ from the last one. Type-and-color: display + body (+ one outlier), OKLCH palette with tinted
   neutrals, one accent ≤5%, a named theme bundle. Surfaces-and-details: take the lowest rung of the
   containment ladder that does the job (a card needs a card-shaped problem), one radius language,
   border *or* tint *or* shadow, and the 1px finish layer. Design-systems: three-tier tokens; components
   read semantic tokens only; theming is a mapping swap; governance + a token-based handoff.
3. If the user named a screen/component to design or a UI to review below, start there — apply the
   checklist and, on a review, use `anti-slop` §8's report format (severity · why · fix · verdict).
   To *build* it on the Dolle-MCP server use `devkit:ui-ux-design`; for a **native/desktop** app use
   `devkit:gui-design`.

User task (optional): $ARGUMENTS

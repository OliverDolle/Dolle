---
description: "Use this whenever you are designing or reviewing the craft of any screen, component, or flow — load it BEFORE finalizing a UI. Two skills: fundamentals (hierarchy, spacing/type scales, semantic color + WCAG contrast, every component & content state, forms, feedback, responsive layout, accessibility) and design-systems (tokens, theming, a component library, and dev handoff to make it repeatable). NOT for driving a full website build (use ui-ux-design) and NOT for native/desktop apps (use gui-design). Triggers: 'design this screen', 'review my UI', 'improve the layout', 'fix the spacing', 'form design', 'design tokens', 'design system', 'component library', 'theming'."
argument-hint: "[optional: the screen/component/flow to design or review, or 'design-systems' to focus that skill]"
---

**A UI-craft request matches this command — load it before finalizing the design; do not eyeball
spacing, color, or states from memory.** Read `${CLAUDE_PLUGIN_ROOT}/packs/ui-design/INDEX.md`, then
the skill(s) the task needs:

- **`fundamentals/SKILL.md`** — for designing or reviewing a single screen/component/flow. Read this
  by default.
- **`design-systems/SKILL.md`** — when the work outlives one screen (a product, a component library,
  more than one designer/engineer, a rebrand, or a new dark mode): tokens, theming, and handoff.

If the argument is `fundamentals` or `design-systems`, focus that one skill. Otherwise read
`fundamentals`, and add `design-systems` when the task is about tokens, a component library,
theming, or scaling a UI across many screens. Follow what you load as the active method for this
work.

Then:
1. Confirm in one line which **ui-design** skill(s) you loaded.
2. Summarize the method in 3–5 bullets. Fundamentals: establish hierarchy (one primary action per
   view); one spacing scale + a small type scale (body ≥16px, 45–75ch lines); semantic color roles
   with **AA contrast**, meaning never by color alone; design **every** component state and all four
   content states (empty/loading/error/overflow); forms one-column with real labels + inline
   validation; accessibility is a constraint, not a phase. Design-systems: three-tier tokens
   (primitive → semantic → component); components read semantic tokens only; theming is a mapping
   swap; a component library (variants × states); governance + a token-based dev handoff.
3. If the user named a screen/component to design or a UI to review below, start there — apply the
   checklist. For *aesthetic direction* lean on the `frontend-design` skill if it is available; to *build* it on the Dolle-MCP
   server use `devkit:ui-ux-design`; for a **native/desktop** app use `devkit:gui-design`.

User task (optional): $ARGUMENTS

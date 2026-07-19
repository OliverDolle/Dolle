---
name: fundamentals
description: >-
  The craft rules for designing great user interfaces — tool-agnostic fundamentals that make a UI
  clear, usable, and trustworthy. Load when designing a screen/component/flow and you want to get
  hierarchy, spacing, type, color, states, forms, and accessibility right (not the build tooling).
  Covers a spacing/type scale, visual hierarchy, semantic color, the full set of component states,
  form and feedback design, responsive layout, microcopy, and a review checklist. Complements the
  sibling design-systems skill (foundations that scale this across a product), the Dolle-MCP-driven
  ui-ux-design section, and the frontend-design skill.
---

# Designing great UI (fundamentals)

Great UI is **clear, consistent, forgiving, and quiet** — it lets people do the thing without
noticing the interface. This section is the *craft*: the rules that separate a UI that feels
designed from one that feels assembled. It is tool-agnostic — it applies whether you're in Figma,
hand-writing CSS, or driving the Dolle-MCP library.

Where the neighbors fit: **`frontend-design`** owns aesthetic *direction* and distinctiveness (not
looking templated); **`ui-ux-design`** owns the *build workflow* on the Dolle-MCP server. This
section owns the *interface craft* underneath both — apply it regardless of look or tooling.

## 1 — Hierarchy: guide the eye, one thing at a time

Every screen has a job. Decide the **single primary action or piece of information**, make it the
most prominent thing, and demote everything else. If everything shouts, nothing is heard.

- Establish hierarchy with **size, weight, color, and space — in that order of subtlety.** Reach
  for space and weight before you reach for more colors.
- **One primary button per view.** Secondary actions are lower-emphasis (outline/ghost/text);
  destructive actions look distinct and are never the easy default.
- Group related things and separate unrelated things (**proximity**). Whitespace *is* grouping —
  don't fill it with dividers when a gap would do.
- Follow reading order (top-left → down for LTR). Put the primary action where the eye ends, not
  where it starts.

## 2 — Spacing: one scale, used everywhere

Consistent spacing is the cheapest thing that makes a UI look professional. Pick **one scale and
never free-hand a margin.** A 4- or 8-point scale is the standard:

```
4  8  12  16  24  32  48  64  96   (px)
```

- Space in **multiples of the base unit**; no `13px`, no `27px`.
- **Related elements sit closer than unrelated ones** — spacing communicates structure. A label
  belongs nearer its input than the previous field.
- Give content room to breathe; cramped UIs read as cheap and are harder to scan. Generous padding
  inside cards/buttons, generous gaps between sections.
- Define spacing as **tokens/variables** (`--space-4`), not magic numbers, so it stays consistent
  and themeable.

## 3 — Typography: a small scale, few roles

- Use a **modular type scale** (e.g. 1.2–1.25 ratio) rather than arbitrary sizes; 4–6 sizes cover
  almost everything (display, heading, subheading, body, caption).
- **Body text ≥ 16px**; line-height ~1.4–1.6 for body, tighter for headings. Line length **45–75
  characters** (`max-width: ~65ch`) — long lines are exhausting to read.
- **Two weights usually beat five.** Establish contrast with size and weight, not many fonts. One
  or two families max.
- **Align text left** for LTR reading; reserve centering for short, one-to-two-line moments (heroes,
  empty states). Never center long paragraphs.
- Numerals in tables: tabular/lining figures so columns align.

## 4 — Color: semantic roles, not a paint bucket

Assign colors **jobs**, then use them consistently — don't pick a hue per element.

- Define roles once: `background`, `surface`, `text`, `text-muted`, `border`, `primary`
  (brand/action), and status colors `success` / `warning` / `danger` / `info`.
- **Don't encode meaning in color alone** (~1 in 12 men are color-blind). Pair color with an icon,
  label, or shape — a red border *and* an error message.
- **Contrast is a hard requirement, not a preference:** WCAG **AA** = 4.5:1 for normal text, 3:1 for
  large text and for UI components/focus indicators. Gate every text/background and control pair —
  the Dolle-MCP `color_contrast` tool does this if you have it.
- 60/30/10 as a starting balance: dominant neutral, secondary, ~10% accent. Accent is precious —
  spend it on the primary action and key signals, not everywhere.
- Support **light and dark** via tokens (semantic variables that swap), not hardcoded hex per
  element.

## 5 — Every component has states — design all of them

The most common gap between a mockup and a real product is missing states. For any interactive
element, design the full set up front:

- **default, hover, focus (visible!), active, disabled, loading, error, selected.**
- **Focus states are not optional** — keyboard and screen-reader users navigate by them. Never
  `outline: none` without a clearly visible replacement (a ring with ≥3:1 contrast).
- **Disabled** must look unmistakably inactive *and* explain why (tooltip/helper text) — a
  greyed-out button with no reason is a dead end.
- **Loading:** show progress where the result will appear (inline spinner, skeleton), disable the
  trigger to prevent double-submit, and keep layout stable (reserve space — no jump when content
  arrives). Prefer **skeletons over spinners** for content areas; they preview structure and reduce
  perceived wait.
- **Touch targets ≥ 44×44px**; don't place interactive elements so close they're mis-tapped.

## 6 — The four content states of any data view

A list/table/card/dashboard is not done until all four are designed:

1. **Empty** — first-run or no-results. Explain what goes here and offer the action to fill it
   (empty state is an onboarding opportunity, not a blank void). Distinguish "nothing yet" from
   "no matches for your filter."
2. **Loading** — skeleton matching the eventual layout.
3. **Error** — say what went wrong in plain language and how to recover (a **Retry** action), never
   a raw stack trace or bare "Error."
4. **Ideal/populated** — the normal case, plus the **truncation** case (long names, huge numbers,
   1000 rows) — design overflow, wrapping, and pagination, not just the happy 3-item demo.

## 7 — Forms: reduce work and friction

- **One column.** Multi-column forms break the vertical scan and cause skipped fields.
- **Label every field** (visible, above the input); placeholder text is not a label — it vanishes on
  input and fails accessibility.
- Ask for the **minimum**; mark **optional** fields rather than starring every required one when
  most are required. Group related fields.
- **Validate inline, on blur, and be specific:** "Password needs 8+ characters," not "Invalid
  input." Show errors **next to the field**, keep the user's input, and don't clear the form on a
  failed submit.
- Use the **right input type/keyboard** (`type=email`, `inputmode=numeric`, native date/select) and
  **autocomplete** attributes. Match input width to expected content (a ZIP field shouldn't be full
  width).
- Confirm success clearly; on a long/destructive action, confirm intent (and make destructive
  confirmations require a deliberate act, not a reflexive "OK").

## 8 — Feedback & motion

- **Acknowledge every action within ~100ms** — a state change, spinner, or optimistic update.
  Silence reads as "broke."
- Feedback proportional to weight: inline for small actions, a toast for background success, a modal
  only for things that must block. **Don't overuse modals** — they interrupt; prefer inline
  editing/expansion.
- **Motion has a job**: show relationships (where a thing came from/went), direct attention, or mask
  latency. Keep it **fast (150–300ms) and eased**; animate **`transform`/`opacity` only** (cheap,
  no layout shift). Gate all motion behind **`prefers-reduced-motion`**. Decorative, looping, or
  slow animation is friction, not delight.

## 9 — Layout & responsive

- Design on a **grid**; align to columns and a baseline so edges line up. Misalignment is the most
  visible "amateur" tell.
- **Content-first breakpoints:** add a breakpoint where the *content* breaks, not at device widths.
  Design mobile-first (constraints first), then expand.
- Reserve space for async content (set image `width`/`height`/`aspect-ratio`) so nothing shifts on
  load — this is both a UX and a Core Web Vitals (CLS) requirement; see `web-performance`.
- Respect the viewport: sticky headers earn their space, don't trap scroll, keep primary actions
  reachable (thumb zone on mobile).

## 10 — Microcopy

- **Buttons name the outcome:** "Save changes," "Delete project" — not "OK"/"Submit."
- Write for the user, in their words; short, specific, human. Error and empty states are copy, not
  decoration — they're where good microcopy pays off most.
- Be consistent in terminology and casing (pick sentence case *or* title case for headings/buttons
  and hold it).

## 11 — Accessibility is table stakes

Not a phase — a constraint you design within from the start:

- **Semantic HTML** (real `<button>`, `<nav>`, `<label>`, headings in order) so assistive tech and
  keyboards work for free.
- **Fully keyboard-operable**, logical tab order, visible focus, no traps.
- Contrast AA (see §4); don't rely on color alone (§4); label icon-only controls
  (`aria-label`); associate errors with fields (`aria-describedby`).
- Respect user settings: reduced motion, text zoom to 200%, dark mode.

## 12 — Icons: SVG, never system emoji

**Never use system/OS emoji (🎉, ✅, 🚀) as UI icons — use SVG icons.** Emoji are a tempting
shortcut and always the wrong call in a real interface:

- **They render differently on every OS, browser, and version** — the same glyph is a different
  picture on Windows, macOS, Android, and iOS, so the UI is off-brand and inconsistent by
  definition, and you can't control how it looks.
- **They can't be styled** — no `currentColor`, stroke weight, size, or state (hover/disabled) that
  matches the rest of the UI; they ignore your type and color system.
- **They're an accessibility hazard** — screen readers announce the full Unicode name ("party
  popper"), which is noise, and their meaning is culturally ambiguous.

Use **SVG icons from one consistent set** instead (one grid, one stroke weight — see the
`design-systems` icon-set rule). SVG scales crisply at any DPI, inherits color via `currentColor`,
and can be sized and themed with the rest of the system. Give icon-only controls an accessible label
(`aria-label` / equivalent) and mark decorative icons `aria-hidden` (§5, §11). The one acceptable
place for an emoji is genuine user *content* (a message someone typed), never chrome, buttons,
status, or headings.

## Review checklist (run before calling a UI done)

- [ ] One clear primary action per view; hierarchy guides the eye.
- [ ] All spacing on the scale; consistent rhythm, generous breathing room.
- [ ] Type: ≤6 sizes, body ≥16px, line length 45–75ch, left-aligned body.
- [ ] Color has semantic roles; meaning never conveyed by color alone; **AA contrast** everywhere.
- [ ] Every interactive element has hover/**focus**/active/disabled/loading states.
- [ ] Empty, loading, error, and overflow/truncation states all designed — not just the happy path.
- [ ] Forms: one column, real labels, specific inline validation, input preserved on error.
- [ ] Every action gives feedback ≤100ms; modals used sparingly.
- [ ] Motion is fast, `transform`/`opacity` only, behind `prefers-reduced-motion`.
- [ ] Icons are SVG from one consistent set — **no system emoji** in chrome/buttons/status; icon-only
      controls have an accessible label, decorative icons are `aria-hidden`.
- [ ] Keyboard-operable, semantic HTML, screen-reader labels, no layout shift on load.
- [ ] Looks right at mobile width and at 200% zoom; light and dark both checked.

## Related

- **`design-systems` (sibling in this section)** — once these rules are settled for one screen,
  that skill makes them *repeatable*: design tokens, a component library, theming, and dev handoff
  so the whole product stays consistent. Use this skill to get one screen right; use that one to
  scale it.
- `frontend-design:frontend-design` — aesthetic direction and distinctiveness (avoiding the
  templated/AI-default look). Use it for *what it should feel like*; use this for *how to make it
  work*.
- `devkit:ui-ux-design` — executes this craft on the **Dolle-MCP** server (templates, curated
  palettes, `color_contrast`, SVG, screenshots) and runs a design brief first.
- `devkit:gui-design` — the same craft for **native/desktop GUIs** (Qt, GTK, platform HIG): window
  chrome, menus, keyboard model, HiDPI, and native accessibility.
- `devkit:web-performance` — the CLS/INP rules (reserve space, compositor-only motion) are the same
  ones in §5/§8/§9 here.

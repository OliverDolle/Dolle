---
name: fundamentals
description: >-
  The craft rules for designing great user interfaces — tool-agnostic fundamentals that make a UI
  clear, usable, and trustworthy. Load when designing a screen/component/flow and you want to get
  hierarchy, spacing, type, color, states, forms, and accessibility right (not the build tooling).
  Covers aesthetic direction (distinctive, not templated — plus the AI-default looks to avoid), a
  spacing/type scale, visual hierarchy, semantic color, the full set of component states, form and
  feedback design, responsive layout, microcopy, and a review checklist. Complements the sibling
  design-systems skill (foundations that scale this across a product) and the Dolle-MCP-driven
  ui-ux-design section; the external frontend-design skill, if present, is an optional complement,
  not a dependency.
---

# Designing great UI (fundamentals)

Great UI is **clear, consistent, forgiving, and quiet** — it lets people do the thing without
noticing the interface. This section is the *craft*: the rules that separate a UI that feels
designed from one that feels assembled. It is tool-agnostic — it applies whether you're in Figma,
hand-writing CSS, or driving the Dolle-MCP library.

This section covers **both halves of the craft**: §0 sets the aesthetic *direction* (making it
distinctive, not templated) and §1–§12 make the interface *work* (hierarchy, spacing, type, color,
states, forms, accessibility). Where the neighbors fit: **`anti-slop`** is §0 at full depth — the
named tells of AI-default UI, the escape moves, and the gate sweep to run before shipping;
**`structural-variety`** and **`type-and-color`** are the page-shape and surface decisions §0 asks
for; **`design-systems`** makes all of it repeatable; **`ui-ux-design`** owns the *build workflow* on
the Dolle-MCP server. The external **`frontend-design`** skill, if you have it, covers similar
aesthetic-direction ground — a useful complement, never a dependency: devkit is self-contained here.

## 0 — Aesthetic direction: distinctive, not templated

Before the rules below make a UI *work*, this decides what it should *feel* like — the difference
between a design made **for this subject** and one that could be pasted onto anything. Settle the
direction first; the rest of this skill executes it.

- **Ground it in the subject.** Derive palette, type, and imagery from what the thing actually is —
  its domain, its content, its personality — not from a generic starter. A law firm, a synthwave
  album, and a children's clinic must not share a look. When stuck, pull a color or a shape from the
  subject's own world.
- **The hero is the thesis.** The first screen states one clear idea in one strong move. Choose that
  move deliberately, make it the thing people remember, and keep everything else subordinate to it.
- **Type is a primary tool, not an afterthought.** Choose typefaces with intent — a deliberate
  pairing, a real scale, a point of view — not the framework default. Type carries most of a
  design's personality before color does (mechanics in §3).
- **Structure carries meaning.** The shape of the layout should mirror the shape of the content: the
  order, grouping, and rhythm of sections *is* information, not just arrangement (see §1, §9).
- **Compose, don't stack.** Reach for asymmetry and an editorial grid — offset images, full-bleed
  moments, overlapping elements, deliberate negative space — and give the page *rhythm* by
  alternating section treatments (light/dark, full-bleed, split, oversized type). A stack of
  identical centered bands is the surest tell of an assembled, not designed, page.
- **Spend boldness once.** Pick **one** signature element — a color, a type moment, a motion, a
  layout break — and let it be loud; keep everything around it quiet. Bold everywhere reads as noisy;
  restraint is what makes the one move land.
- **Avoid the AI-default looks.** These read as "machine-generated" because models overproduce them;
  catching one in your own draft is the signal to re-seed from the subject. **The full catalog —
  ~60 named tells with the fix for each, plus the audit gates — is the sibling `anti-slop` skill;
  read it before generating anything visual.** The headline offenders:
  - **Palette:** purple / violet / indigo as the default accent; a purple→pink or cyan→magenta
    gradient (especially as a `background-clip: text` headline); the blue-and-grey "SaaS default";
    pure `#000` on pure `#fff` (use a near-black and a tinted paper instead); untinted greys. Seed
    from the subject or a curated set (blue, teal, emerald, amber, rose, sunset, lime, cyan…), keep
    to **one** accent, and hold it under ~5% of any viewport.
  - **Type:** a default UI sans (Inter, Roboto, Open Sans, Helvetica) used as the *display/brand*
    face. They're fine for body and UI, but headlines are where personality lives — pick a
    distinctive display face with a point of view (candidates in `type-and-color` §3). Headings are
    **roman**: an italicized emphasis word inside a heading is one of the most reliable tells.
  - **Layout:** the dead-centered `100vh` hero (headline + subhead + two grey buttons) and the
    identical three-up feature-card grid with tiny icons in circles; cards nested inside cards;
    an eyebrow label on every section. Break the everything-centered habit (see *compose, don't
    stack* above), and pick the page's **shape** deliberately (`structural-variety`).
  - **Chrome:** the wordmark-left / four-links / button-right sticky nav and the four-column
    link-farm footer with a social row. Both are genre-blind — they land identically on a bakery and
    a B2B platform.
  - **Cream + serif + terracotta** ("tasteful editorial") and **near-black + one acid/neon accent**
    ("sleek tech") — each was once distinctive and is now its own cliché.
- **Never invent facts to fill a layout.** No metric, testimonial, logo, or customer count the user
  didn't give you — "10× faster" and "trusted by 50,000+ teams" read as generated and poison every
  real claim beside them. A labelled gap ("metric to confirm") is honest; if a stat-led section has no
  stats, it's the wrong section.
- **Decoration needs an anchor.** A shape, badge, numeral, or caret earns its place only when the
  content motivates it (a caret inside a typed command, a numeral that names a version or issue, a
  stamp that names a date). "Something needed to go here" is not a reason.
- **Write real copy, never lorem ipsum.** Specific, confident words in the brand's voice are part of
  the design — they set tone and prove the layout works at real lengths. Placeholder text hides
  whether the design holds up and always ships looking unfinished.
- **Self-critique against "templated."** Step back from the result (screenshot it if you can) and
  ask: does this look made *for this*, or could it be anyone's — would it look at home in an award
  gallery, or like a template? Name the single most generic thing and fix it. Repeat until the
  design is unmistakably about the subject.

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
- **Target size:** WCAG 2.2 (§11) sets a hard floor of **24×24 CSS px** (2.5.8 Target Size (Minimum), AA);
  **44×44px remains the comfortable target** (the AAA/touch bar). Don't place interactive elements so
  close they're mis-tapped; if a control is under 24px it needs adequate spacing around it to pass.

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

Not a phase — a constraint you design within from the start. Target **WCAG 2.2**, the current W3C
Recommendation (it supersedes 2.1 and is backward-compatible):

- **Semantic HTML** (real `<button>`, `<nav>`, `<label>`, headings in order) so assistive tech and
  keyboards work for free.
- **Fully keyboard-operable**, logical tab order, visible focus, no traps.
- Contrast AA (see §4); don't rely on color alone (§4); label icon-only controls
  (`aria-label`); associate errors with fields (`aria-describedby`).
- Respect user settings: reduced motion, text zoom to 200%, dark mode.
- **The WCAG 2.2 AA additions most relevant to UI craft:**
  - **Target Size (Minimum) 2.5.8** — 24×24 CSS px floor (44px comfortable); see §5.
  - **Focus Not Obscured 2.4.11** — the focused control must not be *entirely* hidden by sticky
    headers, cookie bars, or other author content; keep the focus ring in view when scrolling.
  - **Dragging Movements 2.5.7** — any drag interaction (sliders, reorder, drag-to-dismiss) needs a
    **single-pointer alternative** (tap/click, arrow buttons) — don't make dragging the only way.
  - **Redundant Entry 3.3.7** — don't ask for the same information twice in one flow; auto-populate
    or let the user pick previously entered data.
  - **Accessible Authentication (Minimum) 3.3.8** — no cognitive-function test (no memorizing/
    transcribing puzzles) as the only factor; **allow paste and password managers** on login fields.

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

- [ ] Direction is grounded in the subject — distinctive, not templated; none of the AI-default
      looks (purple-by-default, cream/serif/terracotta, black/acid-accent); one deliberate signature move.
- [ ] `anti-slop`'s gate sweep run and clean — no gradient hero/headline, no `100vh` centered hero, no
      three-up icon-card grid, no AI nav/footer, no italic heading, no invented metrics or fabricated
      proof, one accent under ~5%.
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
- [ ] **WCAG 2.2 AA:** targets ≥24×24px (44 comfortable); focus never fully obscured; drag actions
      have a single-pointer alternative; no redundant entry; login allows paste / password managers.
- [ ] Looks right at mobile width and at 200% zoom; light and dark both checked.

## Related

- **`anti-slop` (sibling in this section)** — §0 at full depth: the named tells of AI-default UI with a
  fix for each, the escape moves, an audit report format, the six-axis pre-emit self-critique, and a
  gate sweep. Read it before generating or reviewing anything visual.
- **`structural-variety` (sibling)** — the *page shape* §0's "structure carries meaning" and "compose,
  don't stack" ask for: named shapes, nav/footer archetypes, hero fit, section rhythm.
- **`type-and-color` (sibling)** — §3 and §4 at full depth: real type pairings (and the faces to avoid),
  OKLCH palette construction, accent discipline, dark-mode recipe, and the contrast pairs that fail.
- **`design-systems` (sibling in this section)** — once these rules are settled for one screen,
  that skill makes them *repeatable*: design tokens, a component library, theming, and dev handoff
  so the whole product stays consistent. Use this skill to get one screen right; use that one to
  scale it.
- `frontend-design:frontend-design` *(optional external skill)* — covers the same aesthetic-direction
  ground as **§0** above. A useful complement if it happens to be installed, but **not required** —
  devkit is self-contained here.
- `devkit:ui-ux-design` — executes this craft on the **Dolle-MCP** server (templates, curated
  palettes, `color_contrast`, SVG, screenshots) and runs a design brief first.
- `devkit:gui-design` — the same craft for **native/desktop GUIs** (Qt, GTK, platform HIG): window
  chrome, menus, keyboard model, HiDPI, and native accessibility.
- `devkit:web-performance` — the CLS/INP rules (reserve space, compositor-only motion) are the same
  ones in §5/§8/§9 here.

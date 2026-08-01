---
name: surfaces-and-details
description: >-
  Containers, surfaces and the small details that read as hand-made — load when a UI is "correct but
  looks generated", or before reaching for a card. Covers the containment ladder (whitespace → rule →
  tint → border → elevation) so cards stop being the default, radius as a committed language, hairline
  and border discipline, elevation on light vs dark, density and optical padding, a three-surface limit,
  and the detail layer: text-wrap, hanging punctuation, focus-ring geometry, selection/caret/scrollbar/
  tap-highlight, reserved slots that stop reflow, and cursor honesty. Deepens fundamentals §2/§5.
---

# Surfaces & details — containers that aren't cards, and the 1px layer

Two things separate a UI that *looks* generated from one that looks made, after hierarchy and color
are already right:

1. **Containment.** The default reflex is a card — 12–16px radius, a visible border, a drop shadow —
   applied to everything, nested, at one uniform weight. That reflex is the tell your eye catches
   before it reads a word.
2. **The 1px layer.** Focus-ring geometry, hanging punctuation, a stable helper-text slot, a caret
   color, a scrollbar that doesn't jump. None of it is noticeable individually; all of it together is
   the difference between "assembled" and "made".

This skill is those two. It is tool-agnostic; the CSS is illustration, not requirement.

## 1 — The containment ladder: earn the card

Before drawing a container, ask what job it does — group, separate, or elevate — then take the
**lowest rung on this ladder that does that job**:

| Rung | Device | Use when |
| --- | --- | --- |
| 0 | **Nothing** | The content's own type hierarchy already groups it. Most "cards" are this. |
| 1 | **Whitespace** | Proximity is the grouping (`fundamentals` §1). Cheapest, quietest, usually right. |
| 2 | **A hairline rule** | You need a *boundary*, not a *box* — a rule above the group, or between siblings. |
| 3 | **A tinted surface** | The group is a different *kind* of thing (an aside, a code block, a summary) — a `paper-2` fill, no border. |
| 4 | **A bordered container** | The group is genuinely selectable/actionable as one unit (a pricing tier, a repo row). |
| 5 | **An elevated container** | The thing floats *above* the page in the interaction model: menu, popover, dialog, toast, drag ghost. |

Rules that follow from the ladder:

- **A card is a rung-4 answer, so it needs a rung-4 problem.** Three cards side by side, each holding
  an icon and two sentences, are three groups that whitespace already made.
- **One containment layer.** A bordered container holding bordered cards holding micro-cards is
  visual nesting with no semantic nesting (`anti-slop` §2). If you must nest, the inner layer drops a
  rung — a bordered card contains *tinted* blocks, never bordered ones.
- **Elevation is for things that float, not things that matter.** Importance is size, weight, space
  and position; shadow is z-position, and using it for emphasis flattens both meanings.
- **Vary the containers in a set.** If a layout genuinely needs cards, they don't all have to be the
  same size, ratio, or rung — one large tinted block beside two hairline-bordered ones reads as
  composed; six identical rounded boxes read as generated.

## 2 — Radius is a language; commit to one

Pick a radius *voice* for the whole product and hold it. Mixing 4 / 8 / 12 / 16px because each
component was drawn separately is the most common incoherence in generated UI.

| Voice | Radius | Reads as |
| --- | --- | --- |
| **Square** | 0–2px | Editorial, technical, brutalist, data-dense, print-adjacent |
| **Soft** | 4–8px | Neutral and professional — the safest non-default choice |
| **Round** | 12–16px | Consumer, friendly, playful. This is the AI default: choose it, don't land on it |
| **Pill** | 999px | *One* element type only (a chip, a tag, a toggle track) — never buttons *and* cards *and* inputs |

- **Two radii, maximum:** one for containers, one for controls (and a pill for the single element that
  earns it). Define them as tokens (`--radius-container`, `--radius-control`).
- **Nested radius rule:** an inner radius = outer radius − the padding between them. A 12px card with
  16px padding holding a 12px image looks wrong; the inner wants ~0–4px. Concentric corners only look
  right when they're computed, not repeated.
- **Radius must agree with the type.** A condensed poster face inside 16px pills is two voices
  arguing. Square radius + high-contrast serif, soft radius + grotesque, round + humanist sans.
- **Radius scales with size, not with importance.** A 40px button and a 400px panel should not share
  a 16px radius — the button reads over-rounded, the panel under-rounded.

## 3 — Borders & hairlines

- **A hairline is a design element, not a fallback.** Pick a `--color-rule` that sits close to the
  surface (roughly 10–20% of the way from paper to ink). Borders at text contrast (`#ddd` on white is
  *not* the problem — `#888` is) turn every box into a cage.
- **Border *or* tint *or* shadow — pick one per container.** All three at once is the "bold container"
  look. A tinted surface almost never needs a border; a bordered card almost never needs a shadow.
- **Full-bleed vs inset is a decision.** A rule that spans the whole viewport says "chapter"; one that
  spans the text column says "aside". Accidentally mixing them looks like a mistake.
- **On HiDPI, 1px is already thin** — don't reach for 2px borders to "make it visible"; raise the
  rule's contrast instead. Where a genuine sub-pixel hairline matters, an inset `box-shadow`
  (`0 0 0 1px`) or a scaled pseudo-element beats a border, and it never affects layout.
- **Never animate `border-width`.** Reserve a transparent outline instead (§7) — width changes shift
  geometry on hover/focus, which the eye reads instantly even when it can't name it.

## 4 — Elevation: opposite recipes for light and dark

- **On light:** at most **two** shadow tokens — a *whisper* for resting cards
  (`0 1px 2px` at ~5% alpha of the ink color) and a *lift* for genuinely floating layers. Tint the
  shadow with the anchor hue rather than using neutral black; pure-black shadow on a warm surface
  greys it out.
- **On dark: elevation is lightness, not shadow.** Higher surfaces are *lighter* (~+3% per level). A
  shadow on a dark card reads as a halo, and a *colored* glow reads as 2022 AI (`anti-slop` §3).
- **Never stack shadows** to fake depth, and never use shadow on a container that already has a
  border and a tint.
- **Elevation implies interaction.** If a surface is raised, something should be able to dismiss it
  (escape, backdrop click, outside click). A raised thing that can't be dismissed is a card wearing a
  dialog's clothes.

## 5 — Density, padding and optics

- **Card padding ≠ section padding ≠ page padding.** If all three are 24px, the rhythm is flat and
  the page reads as one undifferentiated grid. Container padding is typically *smaller* than section
  padding by at least two steps on the scale.
- **Padding scales with the container.** A chip gets 4–8px; a card 16–24px; a full-bleed panel 32–64px.
  One padding value applied everywhere is the same failure as one radius everywhere.
- **Relate padding to the type.** Vertical padding that equals the line-height's leading looks
  intentional; an arbitrary 20px around 1.55-leading text looks approximate.
- **Optical, not mathematical.** Right-aligned numerals need slightly less right padding than
  left-aligned text needs left padding; an icon in a square button usually needs a 0.5–1px nudge to
  look centered; a capital-letter-only label sits optically low in a box that's mathematically
  centered.
- **Pick a density and state it.** Comfortable (default), compact (data tables, dashboards), or
  spacious (marketing, editorial). Mixing densities within one view is a tell; supporting a *toggle*
  is a design-systems concern (`design-systems` theming/density).

## 6 — Surface hierarchy

- **Three surfaces on a screen, maximum**: `paper` → `paper-2` → `paper-3`. A fourth is almost always
  a nesting mistake.
- **Nesting steps in one direction.** Going paper → paper-2 → back to paper inside it destroys the
  depth cue. Either step consistently away from the base, or return to the base only for a genuine
  "reset" surface (an input inside a tinted panel is a legitimate reset).
- **Every surface flip states its own text color** in the same rule. This is the single most common
  contrast bug: a class sets a dark `background` and lets `color` inherit the dark ink
  (`type-and-color` §7).
- **Borders and surfaces are alternatives.** Once a surface changes, the boundary is already visible —
  a border on top of it is redundant.

## 7 — The detail layer

None of these is visible alone. Together they are what "polished" actually means.

**Typographic finish**

- `text-wrap: balance` on headings and short blocks (no one-word last line); `text-wrap: pretty` on
  body copy (kills orphans and bad rag). Cheap, and immediately reads as typeset.
- **Hanging punctuation.** A pull-quote's opening quote mark belongs in the margin, not indented into
  the text block (`hanging-punctuation: first` where supported, a negative text-indent otherwise).
- **Tabular figures in columns, oldstyle in prose**; real small caps (`font-variant-caps`) rather than
  uppercased text at reduced size.
- **Nudge display type manually.** Optical alignment beats box alignment: a large quote, a numeral, or
  a capital at the start of a line often needs a fraction of a character's negative inset to look
  flush.
- One space after a period, no double spaces, no manual `<br>` line-breaking that survives a resize.

**Interaction finish**

- **Focus ring geometry:** `outline` (never `border`) + `outline-offset: 1–2px` +
  `border-radius: inherit`, and reserve `outline: 2px solid transparent` at rest so activation never
  shifts geometry. Focus appears **instantly** — never transitioned.
- **Set the small system colors:** `::selection` background (a low-chroma tint of the accent, with
  legible text on it), `caret-color`, `accent-color` for native checkboxes/radios/range,
  `-webkit-tap-highlight-color` (usually `transparent`, once you have a real `:active` state).
- **Scrollbars:** `scrollbar-gutter: stable` so content doesn't jump when a scrollbar appears, and
  `scrollbar-color` on dark surfaces so a light default bar doesn't glare. Don't build a custom
  scrollbar you then have to make accessible.
- **`scroll-margin-top`** on every anchor target when a sticky header exists, otherwise deep links
  land under the nav. Pair with a `--banner-height` token (`anti-slop` §6).
- **Cursor honesty.** `pointer` only on real controls (not on text or cards that aren't clickable),
  `not-allowed` on disabled, default text beam on text. No custom cursors, no cursor changes on focus.
- **Hover behind `@media (hover: hover)`** so touch devices don't get stuck hover states, and every
  hover affordance has a focus/tap equivalent.

**Stability finish** — reserve the space before the content arrives:

- Helper/error text: `min-height: 1lh` so validation doesn't push the page down.
- Inputs: a fixed right-edge slot (~24px) for a clear button, error glyph or spinner, so an appearing
  icon never reflows the field.
- Media: `width`/`height` or `aspect-ratio` on every image and embed (CLS — `web-performance`).
- Mixed-height flex rows (button + text, icon + label, mark + body): `align-items: center` plus
  `line-height: 1` on the items with intrinsic height, or the row's baseline visibly breaks.
- Inline SVG icons: set `width`/`height` and `flex: none`, or they stretch inside flex rows.

**System respect**

- `forced-colors: active` — don't remove outlines or rely on background images to convey state.
- Dark mode: pull body weight back ~50 units and stop short of pure-white text (`type-and-color` §8).
- Test at 200% zoom and with `prefers-reduced-motion`, `prefers-contrast` on.

## Checklist

- [ ] Every container justified against the ladder — no card doing a whitespace job; one containment
      layer; nested layers step *down* a rung.
- [ ] One radius language, ≤2 radii as tokens, nested radii computed (inner = outer − padding),
      radius agrees with the type's voice and scales with element size.
- [ ] Border *or* tint *or* shadow per container — never all three; hairline color close to the
      surface; no animated `border-width`.
- [ ] Elevation: ≤2 shadow tokens on light (hue-tinted), lightness-based on dark, never stacked, never
      a colored glow; raised surfaces are dismissible.
- [ ] Card, section and page padding differ; padding scales with container size and relates to the
      leading; optical nudges applied.
- [ ] ≤3 surfaces per screen, nesting in one direction, every surface flip sets its own `color`.
- [ ] Details: `text-wrap` balance/pretty, hanging punctuation, tabular/oldstyle figures, focus ring
      via `outline` + offset + reserved transparent ring (instant), selection/caret/accent/tap-highlight
      set, `scrollbar-gutter: stable`, `scroll-margin-top` under sticky headers, honest cursors, hover
      gated behind `hover: hover`.
- [ ] Stability: helper slot reserved, input icon slot reserved, media dimensioned, mixed-height rows
      centered, icons sized.
- [ ] `forced-colors`, 200% zoom, reduced-motion and dark mode all checked.

## Related

- **`fundamentals` §2/§5 (sibling)** — the spacing scale these paddings come from and the state set
  the focus/hover details finish.
- **`anti-slop` (sibling)** — the container tells (card-in-card, side-stripe card, shadow-glow on
  dark, icon-tile card, glassmorphism-as-decoration) and the implementation tells (§6) this skill is
  the positive answer to.
- **`type-and-color` (sibling)** — surface/ink tokens, the tinted-neutral rule, and the surface-flip
  contrast rule referenced in §6.
- **`design-systems` (sibling)** — promote the radius, rule, shadow, surface and density decisions to
  tokens so a whole product shares one containment language.
- `devkit:web-performance` — the reserved-space items in §7 are CLS, measured.
- `devkit:gui-design` — on native platforms the *platform* owns radius, elevation and system colors;
  follow the HIG there and apply §5/§7's discipline within it.

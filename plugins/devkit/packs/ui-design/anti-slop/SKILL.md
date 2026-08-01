---
name: anti-slop
description: >-
  The named tells of AI-generated UI and how to escape them — read BEFORE designing anything visual,
  and run as an audit before shipping. Covers the slop signature (what you will produce if you don't
  intervene), ~60 named tells across visuals, chrome, motion, copy and implementation (each with why
  it reads as generated and the fix), the escape moves, an audit report format, a six-axis pre-emit
  self-critique, and a gate sweep where every answer must be "no". Pairs with fundamentals (§0
  aesthetic direction), structural-variety (page shape) and type-and-color (faces and palettes).
---

# Anti-slop — escaping the AI default look

Models converge. The training distribution is dominated by 2019–2024 SaaS marketing pages, so
unprompted output regresses to one look: a dark-grey or pure-white surface, a violet/blue accent,
Inter for everything, thick rounded cards, a full-viewport centered hero, three icon cards, a
four-column footer. Almost nothing on that list is *wrong* in isolation — it is **predicted**, and
predictability is the defect. Readers pattern-match it as machine-made within about a second, and it
makes every product look like every other product.

This skill is the counter-pressure. Its claim is narrow and strong: **when you catch one of these
tells in your own draft, that is not a matter of taste — it is the signal that you defaulted, and the
fix is to re-seed the decision from the subject** (`fundamentals` §0).

**How to use.** Read §1–§7 *before* generating a design; they change what you reach for. Run the
**gate sweep** and §9's self-critique *before* handing work back. Reviewing someone else's UI: §8 is
the report format. This skill is tool-agnostic — the tells show up in CSS, Figma, Tailwind, SwiftUI
and Qt alike.

## 1 — The slop signature: what you will produce if you don't intervene

Read this as a warning list about your own next draft, not as a description of bad designers.

| Dimension | The default you'll reach for | Why it fails |
| --- | --- | --- |
| **Surface** | Near-black `#0b0f19`/`#111827` dark grey, or pure `#fff` | Untinted extremes read flat and synthetic |
| **Accent** | Violet / indigo / blue — often a purple→pink gradient | The single most recognized AI signature |
| **Type** | Inter (or Roboto / Open Sans / Poppins) as display *and* body | A one-font page is a template page |
| **Containers** | 12–16px radius, heavy border, drop shadow, card inside card | Bold-and-rounded everywhere = no hierarchy |
| **Hero** | `100vh`, eyebrow + headline + lede + two buttons, all centered | The default LLM landing page |
| **Sections** | Identical bands, equal padding, three-up icon cards, an eyebrow on each | Structural sameness — see `structural-variety` |
| **Chrome** | Wordmark-left nav + 4–5 links + right button; 4-column footer + social row | Genre-blind: same shape for a bakery and a B2B tool |
| **Motion** | `transition: all`, uniform `hover:scale-105`, fade-up on every section | Motion with no job; the page never settles |
| **Copy** | "Built for the modern team", "10× faster", Jane Doe, Acme | Invented specificity reads as generated |
| **Icons** | Emoji (✨🚀⚡), or three icon libraries mixed on one page | Icons are typography; three stroke voices is slop |

If your draft matches three or more rows, stop and re-derive the direction from the subject before
polishing anything.

## 2 — Critical tells (these ship as slop)

One of these is a problem; two in the same view is a confirmation.

- **The purple/gradient hero** — a hero whose background is a purple→blue or purple→pink gradient,
  usually with centered white text. *Fix:* one anchor hue, one accent, no gradient background on a
  hero. If you want warmth, tint the neutrals (`type-and-color` §7).
- **The gradient headline** — `background-clip: text` with a gradient fill. Signals "generated"
  faster than almost anything. *Fix:* solid ink; get life from weight, size or a display face.
- **Aurora / mesh blobs and floating orbs** — organic purple-cyan blobs or blurred spheres drifting
  behind the hero "for depth". *Fix:* cut them. A hero needs a typographic anchor, not ambience. If
  you need texture, a two-stop gradient plus SVG grain under 0.1 opacity.
- **Full-viewport centered hero** — `min-height: 100vh`, one sentence, one CTA, everything on one
  centered axis. *Fix:* let the hero be as tall as its content, bias it left or right, and take at
  most two elements onto the centered axis (see `structural-variety` § hero fit).
- **The identical three-up feature grid** — three equal columns, icon above a two-line heading above
  three lines of body, 24px gap. *Fix:* vary column widths and card heights, pull the icon inline,
  drop one card for negative space, or drop the cards and use typographic rhythm.
- **Card-in-card** — a bordered container holding bordered cards holding micro-cards. *Fix:* pick one
  containment layer; usually the outer one is the wrong one.
- **The side-stripe card** — a 4–6px colored bar on one edge of a card. *Fix:* a hairline all round,
  no border, or a small accent square beside the heading.
- **Pure black on pure white** — `#000` / `#fff` as base colors. *Fix:* a near-black ink and a tinted
  paper; never zero-chroma neutrals (`type-and-color` §6).
- **A default UI sans as the display face** — Inter/Roboto/Open Sans carrying the headlines. Fine for
  body; never where the personality lives. *Fix:* a real pairing (`type-and-color` §1–§3).
- **Italic emphasis inside a heading** — *"Built to **think** in real time"*, or an all-italic display
  face. Among the most reliable tells: it reads as *trying* to look editorial. *Fix:* headings are
  roman; carry emphasis with weight, accent color, or a drawn underline. Italic survives only as
  body-copy emphasis in running prose.
- **The AI nav** — wordmark hard-left, 4–5 inline links, CTA hard-right, full-width, sticky, white,
  1px bottom hairline. *Fix:* pick a nav shape that tells you what kind of site you're on
  (`structural-variety` §4).
- **The AI footer** — four link columns (Product/Company/Resources/Legal), social row, tiny
  copyright. A bakery has no "Resources" column. *Fix:* a footer that *closes* the page
  (`structural-variety` §5).
- **An eyebrow on every section** — `01 / FEATURES`, `02 / PRICING` as decoration. When every section
  is chaptered, none is. *Fix:* eyebrows are **default off**; use them only when the content is
  genuinely ordinal, and cap at one or two per page.
- **Eyebrow-left / heading-right section heads** — the label in a narrow left column with the title
  beside it. The most reliable "templated editorial SaaS" tell. *Fix:* when an eyebrow is used, the
  heading goes directly *underneath* it in the same column. Single-column heads only.
- **Re-drawn UI chrome** — a hand-built fake browser bar (URL pill + traffic lights), fake phone
  frame with a notch, fake terminal/IDE window around a `<pre>`. The reader already *has* chrome, and
  the fake is always slightly wrong. *Fix:* a real screenshot in a `<figure>` with at most a hairline
  border, or no frame at all.
- **The AI-illustration look** — smooth blob-people with no joints, "modern flat" stock poses,
  corporate doodle humans, raw text-to-image output with symmetric default lighting. *Fix:* build the
  mark in CSS or SVG; if you must generate, art-direct it (reference, asymmetric crop, grain) and
  never ship raw output.
- **Emoji as UI icons** and **mixed icon libraries** — ✨🚀✅ as feature icons, or Material + Heroicons
  + Lucide on one page. *Fix:* one icon set, one grid, one stroke weight (`fundamentals` §12).
- **Invented metrics and testimonials** — "10× faster", "trusted by 50,000+ teams", "99.9% uptime",
  a quote from a role that doesn't exist. *Fix:* the number-shaped **hole is honest**; the fabricated
  number is not. Use a placeholder marked "metric to confirm", ask for the real figure, or drop the
  proof section — a stat-led layout with no stats is the wrong layout.
- **Lazy-loaded LCP** — `loading="lazy"` on the hero image/video, i.e. the thing the reader is already
  looking at. *Fix:* `fetchpriority="high"`, preload it; lazy-load only below the fold.
- **Sound-on autoplay** — a hero video without `muted`. Browsers block it; the intent is still
  hostile. *Fix:* `autoplay muted loop playsinline`, plus a real toggle if audio matters.

## 3 — Major tells (it looks generated)

- **Centered everything** — headline, body, button, section after section. Breaking symmetry *once*
  is enough to read as intentional.
- **Every section padded identically** — same top, bottom and inline padding throughout. Vary the
  rhythm: tighten one, open another.
- **Glassmorphism as decoration** — frosted panels with nothing behind them to reveal. It works only
  when it communicates depth over content.
- **Shadow-glow on dark** — a `box-shadow` around a card on a dark surface reads as a halo. On dark,
  elevation comes from *lightness* (brighter surface = higher), not shadow.
- **Icon-tile feature card** — rounded rect, icon in a colored square top-left, heading, two lines,
  "Learn more →". The universal template. Make it asymmetric or drop the icon.
- **Hover-only affordances** — a menu, delete button or crucial tooltip that only appears on hover.
  Touch and keyboard users get nothing. Every hover affordance needs a focus and a tap path.
- **Numbers without tabular figures** — price/date/metric columns that don't align. Set
  `font-variant-numeric: tabular-nums` on any column of numbers.
- **Decoration with no anchor** — a floating cursor glyph beside a hero, a "42" in the corner meaning
  nothing, a Pantone chip with no color rationale. Decoration must be *motivated*: a caret inside a
  typed command, a numeral that names an issue or version, a stamp that names a date.
- **Three.js for a still object** — a 300KB WebGL bundle for a model the user can't touch. If it
  isn't interactive, it's a photograph.
- **Lottie for what CSS does** — a 50–500KB JSON payload for a spinning logo, a checkmark draw, or
  loading dots. Those are `@keyframes`, `stroke-dasharray`, and `animation-delay`.

## 4 — Motion tells

Motion is where "almost right" UIs give themselves away. Details and recipes:
`motion-and-interaction`.

- **`transition: all`** — animates properties that must be instant (visibility, focus rings). Name
  the properties.
- **Uniform `hover:scale-105`** — every card lifting identically, no easing, no purpose. One signal
  per element: a 1px translate *or* a color shift *or* a thickening underline.
- **More than one hover effect at once** — translate + scale + shadow + color + rotate on the same
  element.
- **Bouncy / overshoot easing on UI** — `cubic-bezier(0.34, 1.56, …)` on buttons, modals, tooltips.
  Dated. Reserve overshoot for genuinely physical interactions (drag release).
- **Animating `width`/`height`/`top`/`left`/`margin`/`padding`** — layout thrash. `transform` and
  `opacity` only.
- **Focus rings that fade in** — for the first 200ms the keyboard user has no indicator. Focus is
  **instant**, always.
- **Fade-up on every section** — the page never settles. One orchestrated entrance; after that,
  content is simply there.
- **Animated hover gradients, cursor-follower dots, parallax on everything** — cut.
- **Auto-rotating carousels with no pause** — a WCAG 2.2.2 failure. Manual advance, or pause on hover
  *and* focus.
- **Celebratory success toasts** — "Done!" for something the user can already see. Silent success is
  taste; toasts are for failures and for effects the user can't see.
- **Confirm dialogs for reversible actions** — "Are you sure?" before deleting one row. Do it, then
  offer Undo for 5–10s. Keep the modal for irreversible destruction — and make the user type the name.
- **Equal tooltip delays** — hover should wait 800–1000ms; focus should be 0ms. Different intents.
- **Toasts that shift layout** — stack them at a fixed viewport corner; existing toasts don't move
  when a new one arrives.
- **Spinners that flash** — a spinner for a 50ms action. Delay-show it ~150ms, or enforce a ~300ms
  minimum once shown. Prefer skeletons where the layout is known.

## 5 — Copy & honesty tells

Words are part of the design; stock copy makes a good layout look generic.

**Banned openers** (all distribution-default, none of them say anything):

| Phrase | Why it fails |
| --- | --- |
| "Built for the modern team" | Vague; temporal marketing |
| "Unleash / Supercharge your X" | Energy metaphor with no mechanics |
| "Where X meets Y" | False synthesis |
| "Empower / Reimagine / Transform / Elevate" | Missionary language, no concrete benefit |
| "Seamless integration", "Innovative solutions" | "Seamless" has no antonym; every product claims innovation |
| "In today's digital landscape", "Next-generation" | Temporal hand-wave; no differentiation |

- **Lorem ipsum** — hides whether the layout survives real lengths, and always ships looking
  unfinished. Write real copy in the brand's voice.
- **Placeholder names and startup bingo** — "Jane Doe", "John Smith", "Acme", "Nexus", "Pulse".
  Use plausible names that reflect the audience, and concrete product names ("Maple Weekly",
  "Ridgeline Inventory").
- **"Oops!" / "Something went wrong" / "Click here"** — name what broke and what to do; link text
  must stand alone. Errors read: what happened → why → what to do. No exclamation marks, no humour on
  frustration paths.
- **Straight quotes, `--`, `...`** — a sign nothing was proof-read. Use `“ ” ’ — – …`, and a
  non-breaking space before units.
- **A bare giant number as the whole hero headline** — pair a lead figure with a line that says what
  it means.

## 6 — Implementation & responsive tells

These read as "nobody tested this", which is the same tell by a different route.

- **Off-scale spacing** — `padding: 17px`. Everything on one 4/8pt scale, as tokens.
- **Arbitrary z-index** (`9999`) — use a named six-level scale (base / raised / dropdown / sticky /
  modal / toast / tooltip).
- **Mid-render token improvisation** — the theme is picked, then a one-off `#5b6cff` or a bare
  `font-family` shows up in a hover state. Every color and face must come through a named token; if
  you need a new value, add the token first. This is how a three-color page becomes an eight-color
  page by the third edit.
- **Two-line clickable text** — a button/nav/CTA label wrapping at some width reads as broken. Fix in
  this order: shorten the label ("Get started free" → "Start free"), `white-space: nowrap` and let the
  parent reflow, hide a low-priority item, collapse the nav.
- **Horizontal scroll at any width 320–1920px** — put `overflow-x: clip` on `html` *and* `body`
  (`clip`, not `hidden`: `hidden` creates a scroll container and breaks sticky/fixed descendants).
- **`1fr` tracks holding images** — `1fr` means `minmax(auto, 1fr)`, and `auto` is the image's
  intrinsic width, so a 1024px image sets a 1024px minimum. Use `minmax(0, 1fr)`.
- **Display headings that overflow** — long compound words break only at the hyphen. Add
  `overflow-wrap: anywhere; min-width: 0` on display-size text.
- **All-caps display under `line-height: 1`** — caps have no descenders, so wrapped lines collide.
  Floor is 1.0; 1.02–1.08 is right.
- **Two sticky elements at `top: 0`** — the in-page one paints over the nav. Offset secondary stickies
  by a `--banner-height` token and give the nav its own higher z-index.
- **`width: 100vw`** — includes the scrollbar; overflows on desktop. Use `100%` plus container
  padding.
- **Flex rows that inherit `align-items: stretch`** — a button ends up taller than its sibling text
  and the row's baseline breaks. Declare `align-items: center` on any row mixing heights.
- **Input geometry that shifts** — `border-width` changing between states, a focus ring built from
  `border` instead of `outline`, a 38px input beside a 44px button, a helper-text slot that collapses
  when empty, disabled signalled by opacity alone. See `fundamentals` §7 and
  `motion-and-interaction`.

## 7 — The escape moves

The tells above are diagnostic. These are the generative moves that keep you out of them:

1. **Re-seed from the subject.** Pull the palette, type and imagery from what the thing actually *is*
   — its domain, content and personality. A law firm, a synthwave label and a children's clinic must
   not share a look.
2. **One accent, ≤5% of any viewport.** The accent is a highlighter — active nav item, focus ring,
   link underline, primary action, a small square beside a heading. Not a colour block.
3. **Tint the neutrals.** Every grey leans toward the anchor hue (min 0.005 chroma). A warm accent
   over cool greys looks wrong and nobody can name why.
4. **Pair the type.** Display + body, and at most one outlier for a single moment. Commit to extremes
   (200 next to 800, not 400 next to 600).
5. **Choose a page shape on purpose** — before writing code, and a *different* one from the last
   thing you built (`structural-variety`).
6. **Compose, don't stack.** One deliberate asymmetry, one grid-break, uneven section padding, one
   element that crosses a column.
7. **Spend boldness once.** One signature move is loud; everything around it is quiet.
8. **Prefer the honest hole.** No number, no testimonial, no logo you weren't given. A labelled gap
   is credible; an invented figure poisons the whole page.
9. **Typography-only is always an acceptable answer.** Enrichment must earn its place: if the hero
   still works with the visual deleted, the visual earned it; if the hero collapses without it, you
   propped weak type on a crutch.
10. **Look at the pixels.** Screenshot the result and ask *would this look at home in an award
    gallery, or like a template?* Name the single most generic thing and fix it. Repeat.

## 8 — Audit protocol (reviewing a UI, yours or someone else's)

Sweep in this order — visual → chrome/structure → motion → copy → implementation — and report one
line per finding with a severity:

```
[critical] The gradient headline — styles/hero.css:42
  background-clip:text gradient fill is a top AI tell
  → solid var(--color-ink); carry emphasis with weight

[major] Centered everything — index.html:18-96
  four consecutive sections on one centered axis
  → bias two of them left; move the CTA off-axis

Summary — 1 critical · 1 major · 0 minor
Verdict — reads as AI-generated (fix the critical before ship)
```

Severity: **critical** = ships as slop (§2), **major** = looks generated (§3–§4), **minor** = taste
and polish (punctuation, off-scale spacing). Verdicts: *ships as slop* · *reads as AI-generated* ·
*close — fix the minors* · *clean*. Audit means **report, don't rewrite**, unless asked to fix.

## 9 — Pre-emit self-critique (six axes)

Run this **before** the gate sweep, not after — don't carry known weakness into a checklist. Score
the planned or drafted output 1–5 on each axis; anything **< 3 triggers a revision pass**.

| Axis | What you're scoring |
| --- | --- |
| **Philosophy** | Is there a *why* — a position the design takes — or is it just a layout? |
| **Hierarchy** | In two seconds, can a reader tell what's primary, secondary, tertiary? |
| **Execution** | Are the details in spec (rule weights, accent footprint, focus rings, contrast, text wrap)? |
| **Specificity** | Does this look like *this* subject, or like it could be anyone's? |
| **Restraint** | Has everything that isn't earning its place been removed? |
| **Variety** | Does it share a structural fingerprint with the last thing you built? Structural distance, not color-swaps. |

Two passes is normal. Three means the *brief* is wrong, not the design — go back and re-read it.

## Gate sweep — every answer must be "no"

Visual · **1.** Is a default UI sans doing display duty? **2.** Any purple→blue/cyan→magenta
gradient, including gradient text? **3.** A three-equal-column icon-card grid? **4.** A card inside a
card? **5.** A thick colored side-stripe? **6.** A `100vh` hero with everything on one centered axis?
**7.** Pure `#000` or `#fff` as a base? **8.** Any italic heading or italic emphasis word in a
heading?

Structure · **9.** Hero → 3 features → CTA → footer, or the same shape as the last build? **10.** Is
the nav the wordmark+4-links+button default? **11.** Is the footer the 4-column+social default?
**12.** An eyebrow on more than two sections, or any eyebrow beside (not above) its heading?
**13.** Every section padded identically with no rule, ornament, or surface change between them?

Color & type · **14.** Any zero-chroma neutral? **15.** Does the accent exceed ~5% of a viewport?
**16.** More than three font families, or an outlier face in more than two slots? **17.** Any color
or `font-family` outside the token block? **18.** Any text/background pair below 4.5:1 (3:1 for large
text, icons, focus rings)? **19.** Does any surface-flipping rule set `background` without setting
`color`? **20.** Button text within ~5% lightness of its own fill?

Motion · **21.** `transition: all`? **22.** A uniform hover-scale across unrelated elements?
**23.** Overshoot easing on UI state? **24.** More than one hover effect on one element?
**25.** Animating `width`/`height`/`top`/`left`/`margin`/`padding`? **26.** Does the focus ring
transition in? **27.** Any keyframe or transform without a `prefers-reduced-motion` fallback?
**28.** A celebratory toast for a visible effect, or a confirm dialog for a reversible one?

Content · **29.** Any metric, testimonial, logo or count the user didn't supply? **30.** Lorem ipsum,
"Jane Doe", or startup bingo? **31.** Any banned opener from §5? **32.** Straight quotes, `--`,
`...`? **33.** Emoji as an icon, or two icon libraries on one page? **34.** Hand-drawn fake browser /
phone / terminal chrome?

Implementation · **35.** Any off-scale spacing value or ad-hoc z-index? **36.** Horizontal scroll
anywhere from 320–1920px? **37.** Does any clickable label wrap to two lines? **38.** Any `1fr` track
holding an image? **39.** Any interactive element missing `:focus-visible`, `:active` or `:disabled`?
**40.** Does the hero's essential content (headline, lede, primary CTA) fit a 1280×800 viewport
without scrolling?

## Related

- **`fundamentals` §0 (sibling)** — the aesthetic-direction rules this skill enforces: ground it in
  the subject, hero-as-thesis, structure carries meaning, spend boldness once.
- **`structural-variety` (sibling)** — the positive answer to §2's structural tells: named page
  shapes, nav/footer archetypes, hero fit, and the don't-repeat-yourself rule.
- **`type-and-color` (sibling)** — the positive answer to the type and palette tells: real pairings,
  OKLCH palettes, accent discipline, and the contrast pairs that fail most often.
- **`motion-and-interaction` (sibling)** — recipes and canon behind §4's motion tells.
- `devkit:ui-ux-design` — run this sweep against the screenshot when building on Dolle-MCP.
- `devkit:web-performance` — the LCP/CLS items in §2 and §6 are the same rules measured.

*Credit: the tell taxonomy and gate format here are adapted from the MIT-licensed **Hallmark** skill
(github.com/Nutlope/hallmark), reworked to be tool-agnostic and consistent with devkit's other design
sections.*

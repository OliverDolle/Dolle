---
name: structural-variety
description: >-
  Page shape as the real AI fingerprint — read BEFORE writing markup for any page, landing page, or
  site. Structural sameness (hero → 3 features → CTA → footer) survives every palette swap, so this
  skill makes the shape a deliberate choice: six structural axes, ~20 named whole-page shapes to pick
  from, nav and footer archetypes that escape the two most-recognized AI defaults, hero fit and the
  enrichment hierarchy (typography-only is always acceptable), and a diversification rule so two
  builds never share a fingerprint. Pairs with anti-slop (the tells) and type-and-color (the surface).
---

# Structural variety — don't ship the same page twice

Most AI-generated pages are visually distinct and **structurally identical**: hero → three features
→ testimonial → CTA → footer, same heading positions, same column counts, same component vocabulary.
A new palette and a new typeface do not fix that. **Structural sameness is the fingerprint** — it is
what makes two pages for two completely different clients read as color-swaps of one template.

This skill makes page shape an explicit, stated decision, made *before* markup. It is tool-agnostic:
the axes and shapes apply to a static site, a Next.js app, or a native window's content area.

**The discipline in one line: name the shape out loud before you write code, and make it a different
shape from the last one you built.**

## 1 — The six structural axes

A **structural fingerprint** is one choice per axis. Pick deliberately; the combinations are
effectively unlimited, so there is never a reason to repeat one.

**1. Section-head placement** — stacked above the content (the safe default) · hanging in generous
negative space · centered display · bottom-anchored (content flows above the title) · overlapping an
image or color block · sticky/pinned while content scrolls · inline, emerging from the prose.
*Never* the eyebrow-left / heading-right two-column head — that's the templated-editorial tell
(`anti-slop` §2). When an eyebrow exists at all, the heading sits directly beneath it, same column.

**2. Body composition** — single column at 45–75ch · two-column asymmetric (wide body + narrow
metadata margin) · multi-column justified with hyphenation (newspaper) · marginalia/sidenotes ·
three-column equal (reference/encyclopedia density) · single column with full-bleed pull-quotes and
images · asymmetric spans (deliberate 2-1-3 grid ratios).

**3. Divider language** — hairline rule (inset or full-bleed) · a typographic ornament · negative
space only · a surface/color shift where the edge *is* the divider · a tight double rule.

**4. Button voice** — outlined · unstyled underlined link (trust the typography) · oversized solid
block · typographic-only (a word in a weight/size that happens to be clickable) · form-as-CTA (the
action *is* filling the field).

**5. Image treatment** — full-bleed as architecture · tightly cropped to the grid · inline with the
text rhythm · margin-aligned in the outer column · none (typography carries everything).

**6. Reveal** — one orchestrated fade-up stagger on load · a directional sweep · a type unmask ·
a number tick for stats · nothing at all (some pages should not move).

Two rules govern the picks:

- **Coherence.** Choices must belong to the same world. A justified multi-column body with an
  oversized solid accent button don't share a voice.
- **Anti-repetition.** Across consecutive pages in one project or session, no two should share more
  than three of the six axes.

## 2 — Pick a whole page shape first (faster and more varied than six axes)

Composing axis-by-axis is slow and drifts to the mean. Instead **pick one named shape before writing
code**, then deviate on one or two axes if the brief demands it.

| Shape | What it is |
| --- | --- |
| **Bento grid** | Modular blocks of *varying* sizes — a feature, a quote, an image, a stat. Rhythm from size variation, not card uniformity. |
| **Long document** | Reads like a memo or journal entry: continuous prose, inline section heads, no marketing scaffolding. |
| **Marquee hero** | The hero *is* the page above the fold — one bold statement or visual, no CTA in the fold. Below it, the page becomes something else. |
| **Stat-led** | A single giant figure is the hero; everything after supports or qualifies it. Requires *real* numbers. |
| **Workbench** | Real product screenshots are the primary content; the page is a guided tour of the thing in use. |
| **Conversational FAQ** | Bold questions, short honest answers — often accordions. Reads like an interview with the product. |
| **Manifesto** | Polemical large type; tells the reader what to believe before what to buy. Poster energy. |
| **Photographic** | One large image dominates each fold; text is annotation, not headline. |
| **Quote-led** | The hero is a pull-quote with attribution — borrowed credibility first. |
| **Specimen** | Numbered left-margin labels, huge display serif, asymmetric spans, hairline rules, typographic CTA. Editorial/type-foundry energy. |
| **Catalogue** | A uniform grid of variations of one thing (SKUs, palettes, typefaces) — the page is an index of inventory. |
| **Letter** | First-person and intimate, opens on a greeting, no buttons in the fold. |
| **Index-first** | The page *is* a list of links; navigation as design. |
| **Narrative workflow** | Numbered stages telling the story of use over time — a process timeline. |
| **Split studio** | Diptych: every block halves the screen, text one side, proof the other, alternating direction. |
| **Feature stack** | Sticky left pane + scroll-synced right pane cycling detail. Cinematic pacing. |
| **Type specimen** | The typeface *is* the design — foundry or design-system marketing. |
| **Portfolio grid** | Filterable project cards; the work is the product. |
| **Map / diagram** | One large spatial diagram organizes the page — flow, floor plan, system map. Information laid out spatially, not linearly. |
| **Ecosystem index** | Several discovery surfaces (featured / latest / by category / by people) — value is browsing. |
| **Component playground** | Interactive preview-and-code blocks are the primary content. |

**Specimen is not a default.** Numbered left-margin labels + huge serif is a beautiful *editorial*
shape and an obvious tell on a pricing page, a dev tool, or a shop. Reach for it only when the brief
says editorial, foundry, magazine, or specimen.

### Don't default — offer three from different families

When the brief gives no shape, do not pick silently and do not offer three near-twins. Read the brief
for a **domain word** and offer three *categorically different* shapes — one grid-led, one
document-led, one poster-led:

| Domain in the brief | Offer these three |
| --- | --- |
| podcast, audio, music | Photographic · Quote-led · Letter |
| shop, store, product, commerce | Catalogue · Photographic · Bento grid |
| docs, CLI, SDK, API, open source | Workbench · Long document · Component playground |
| platform, infra, dashboard, B2B tool | Bento grid · Workbench · Stat-led |
| agency, studio, case studies | Portfolio grid · Split studio · Index-first |
| personal one-pager, about-me | Long document · Letter · Index-first |
| restaurant, café, menu | Photographic · Long document · Catalogue |
| fashion, apparel, lookbook | Photographic · Catalogue · Marquee hero |
| fintech, payments, investing | Stat-led · Workbench · Long document |
| campaign, cause, advocacy | Manifesto · Quote-led · Stat-led |
| editorial, foundry, magazine | Specimen · Long document · Type specimen |
| conference, event, speakers | Marquee hero · Manifesto · Photographic |
| genuinely no signal | Bento grid · Long document · Manifesto |

If the answer is a tone word ("modern", "clean", "professional"), that is not a shape — ask again
with the trio. If the brief is ambiguous on *intent* rather than domain (docs walkthrough vs.
marketing page; one-pager vs. case studies), ask **one** question first.

## 3 — Diversification: stamp it, then differ

1. **Before picking, look for a prior stamp** in the project's CSS/markup, e.g.
   `/* page shape: bento grid · nav: floating pill · footer: statement · 2026-07-25 */`.
2. **Your pick must differ from it** — categorically where possible (a document-led shape after a
   grid-led one, not two editorial variants).
3. **Stamp your own pick** at the top of the stylesheet, plus the nav and footer archetypes. The
   stamp is the durable record that makes rule 2 possible for the next build.
4. **State the pick in prose before coding**: *"Shape: workbench. Nav: terminal command. Footer:
   dense colophon. Differs from the last build on shape and nav."* Deciding on the page, not in your
   head, is what prevents the default attractor.

Diversification also covers **surface**: two builds can differ in shape and still feel identical if
both are light + serif display + warm accent. Make consecutive builds differ on at least one of —
**paper band** (dark / mid / light) · **display voice** (high-contrast serif / roman serif /
geometric sans / grotesk / mono / condensed display) · **accent hue family** (warm / cool / neutral /
other chromatic).

## 4 — Navigation archetypes (escape the AI nav)

The default — wordmark-left, 4–5 inline links, CTA-right, full width, sticky, white, bottom hairline
— is genre-blind: it lands the same on a wedding photographer's portfolio and a B2B platform. Pick a
shape that tells the reader what kind of site they're on:

| Archetype | Shape | Fits |
| --- | --- | --- |
| **Minimal two-link** | Wordmark + one or two links | Only when the site genuinely has two destinations |
| **Three-section** | Wordmark left · grouped links center · one action right, in a contained bar | Real product navs with several destinations |
| **Floating pill** | Detached rounded bar, inset from the top, backdrop-tinted | Modern-minimal, atmospheric |
| **Floating chip** | Tiny wordmark chip in one corner; nav opens from it | Portfolio, quiet sites |
| **Side rail** | Vertical rail of links along one edge | Reference, docs, almanac-style density |
| **Masthead** | Newspaper mast: name centered/oversized, rule under, links as a thin strip | Editorial, magazine, long-form |
| **Brutal slab** | Full-bleed solid block, heavy type, hard edges | Playful, poster, statement brands |
| **Terminal command** | Nav rendered as a prompt line (`> docs`, `> pricing`) | CLI tools, dev infra |
| **Edge-aligned minimal** | Items pushed hard to the outer margins, nothing centered | Luxury, quiet, atelier |
| **Scroll-morph** | Full-width at rest, condenses to a compact bar on scroll | Long marketing pages |
| **Mega-menu** | Hover/click panel with grouped destinations and descriptions | Genuinely large IA only |
| **Banner + retract** | Announcement strip above the nav that retracts on scroll | Launches, time-boxed news |
| **Inline command palette** | A ⌘K search pill *is* the nav's center | Search-first products, docs |
| **Hidden behind ⌘K** | No visible nav; a keyboard/search affordance only | Expert tools, experiments |

Rotate deliberately: if the last build shipped a floating pill, this one doesn't. State it —
*"Previous nav: floating pill. This build: masthead, because the shape is editorial."*

## 5 — Footer archetypes (escape the AI footer)

The four-column link farm plus social row plus tiny copyright belongs to a genuine hub or docs root
with a real sitemap — nowhere else. A footer should **close the page**, not catalogue an absent
sitemap.

- **Mast-headed** — the wordmark repeated large, a single line of essentials beneath.
- **Inline single line** — everything on one row: name · one or two links · year. Quiet and confident.
- **Dense colophon** — small-type block naming what built the page (typefaces, stack, credits, date).
- **Statement** — one oversized closing sentence; the design's last word.
- **Letter close** — a signature-style sign-off, matching a letter or long-document shape.
- **Newsletter-first** — the footer's job is one inline form; links are secondary.
- **Marquee** — a scrolling wordmark or slogan strip as the page's bottom edge.
- **Index columns** — the four-column form, used *only* where there is real IA to index, and even then
  without the social-row + tiny-copyright tail.

## 6 — Hero discipline

The hero is where shape decisions are most visible and most often wrong.

- **Fit the fold.** On a 1280×800 laptop (test that, not just 1440×900), the headline, lede and
  **primary action** must be visible without scrolling. When they aren't, the culprits are an
  oversized display `clamp()` max, display line-height set at 1.2 instead of 1.0–1.1, a lede running
  3+ lines, or bloated block padding. A deliberately tall art-directed hero is allowed — but the
  first screen must still read as a complete composition, never a headline sliced in half.
- **Weight the bottom.** Bottom padding ≥ ~1.3× top padding. Symmetric or top-heavy padding makes a
  hero float above the page instead of pulling into the next section's rhythm.
- **Break the axis.** At most two elements on the centered axis; let the eyebrow, the CTA or the
  visual sit off-axis (margin-aligned, right-flush, numeral-anchored).
- **Right-size the headline to its length.** ≤20 chars can go very large; 21–50 is the sweet spot at
  display size; 51–90 should step down a rung or split into eyebrow + headline; >90 chars at display
  size is itself a tell — rewrite it shorter. When you're writing the headline, aim for ≤7 words.
- **Decoration needs an anchor** (`anti-slop` §3): a caret inside a typed command, a numeral that
  names a version or issue, a stamp that names a date. Not a floating shape "for depth".

## 7 — Enrichment hierarchy: does this page need imagery at all?

Default is **typography-only**, and it is always an acceptable answer — better nothing than bad
something. Decide need *before* picking a treatment:

| Brief signal | Imagery strategy |
| --- | --- |
| shop, product, fashion, lookbook | Real product photography required — swappable placeholders until supplied |
| photography, portfolio, gallery | Imagery *is* the page — placeholders until supplied |
| food, restaurant, menu | Hero photo + crops — placeholders until supplied |
| team, careers, about-us | Portrait crops — placeholders until supplied |
| travel, hotel, property listing | Cover + tiles — placeholders until supplied |
| news, blog, magazine | One feature image per item |
| SaaS, agency, studio, manifesto | Optional: abstract washes/ornaments, kept subordinate |
| API, docs, CLI, SDK, library | **None.** Typography + code blocks |
| editorial, essay, letter, specimen | **None.** Display type is the design |
| anything vague | **None.** When in doubt, no images |

When imagery *is* warranted, reach for the highest tier you can actually ship — skipping tiers is
itself the tell:

1. **Typography only** — the strongest fail-state.
2. **Hand-built CSS art** — shapes, clip-paths, two-stop gradients, grain. Zero dependencies.
3. **Hand-built SVG** — anything CSS can't express cleanly; animate declaratively.
4. **Real screenshots / real photography** — in a `<figure>`, no redrawn chrome (`anti-slop` §2).
5. **Art-directed generated imagery** — reference-led, asymmetric crop, post-processed grain. Never
   raw output.
6. **Library illustration / Lottie** — last resort, and never for a spinning logo, a checkmark draw,
   or loading dots (those are CSS).

A placeholder must **look** like a placeholder, not like a confident decision.

## 8 — Section rhythm

- **Vary the vertical rhythm.** If every section has identical top/bottom/inline padding, the page is
  a template regardless of its content. Tighten one, open another.
- **Alternate treatments** — light/dark surface, full-bleed, split, oversized type — so consecutive
  sections don't read as the same band with new words.
- **Break the grid once.** One element crossing a column boundary (a pull-quote, a photo, a rule, a
  numeral) does more for a page than any amount of even spacing.
- **Don't subdivide with sub-rules.** The section break *is* the rhythm; a rule inside every section
  flattens it.
- **A marketing page still needs its content beats** — proof, features, pricing (with real prices),
  FAQ answered like a person, one closing action. The shape decides *how* each beat looks; skipping
  more than a couple of beats reads as unfinished.

## Checklist (before writing markup)

- [ ] A named page shape is picked and **stated in prose** — and it differs from the previous build's
      stamp (shape, nav, footer, and at least one surface axis).
- [ ] The shape came from the brief's domain, not from habit; Specimen only if the brief is editorial.
- [ ] Nav and footer archetypes are chosen deliberately — not the wordmark+4-links default, not the
      4-column link farm.
- [ ] Section-head placement is consistent and never eyebrow-left/heading-right; eyebrows off by
      default, ≤2 per page, only when the content is genuinely ordinal.
- [ ] Body composition, divider language, button voice, image treatment and reveal are each a choice,
      and they cohere as one voice.
- [ ] Hero fits 1280×800 with its primary action visible; bottom-weighted padding; ≤2 elements on the
      centered axis; headline sized to its length; any decoration has a semantic anchor.
- [ ] Imagery need was decided before treatment; the highest feasible enrichment tier is used;
      placeholders look like placeholders.
- [ ] Section rhythm varies; at least one deliberate grid-break; no two adjacent sections read as the
      same band.
- [ ] A stamp comment records shape · nav · footer for the next build to diverge from.

## Related

- **`anti-slop` (sibling)** — the tells this skill routes around (the AI nav, the AI footer, the
  centered `100vh` hero, the three-up grid, decoration without purpose) and the gate sweep.
- **`fundamentals` §0/§1/§9 (sibling)** — *structure carries meaning*, *compose don't stack*, and the
  hierarchy/responsive rules the shape has to satisfy.
- **`type-and-color` (sibling)** — the surface that sits on the shape; the diversification axes in §3
  reference its palette and display-voice vocabulary.
- `devkit:ui-ux-design` — the Dolle-MCP build workflow; its template catalog is where these shapes
  get built, and its brief step is where you offer the trio.
- `devkit:web-performance` — hero LCP and CLS are decided by the §6/§7 choices.

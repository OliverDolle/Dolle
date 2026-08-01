---
name: type-and-color
description: >-
  Typography and color at professional depth — read BEFORE picking a typeface or writing a palette.
  Type: the display+body(+one outlier) pairing rule, the default faces to avoid and a catalog of
  foundry-grade free alternatives by voice, ratio scales, display size caps by headline length, weight
  contrast, measure, numerals and punctuation. Color: OKLCH palette construction (paper/ink/tinted
  neutrals/one accent), the ≤5% accent rule, a dark-mode recipe, and the contrast pairs that fail most
  often (accent-ink, surface flips, muted-on-tinted). Plus themes as named bundles (anchor · paper band ·
  display voice · accent · radius/motion) you rotate rather than defaults you fall into. Deepens
  fundamentals §3/§4; pairs with anti-slop and surfaces-and-details.
---

# Type & color — the two decisions that give a design away

Type carries most of a design's personality before color does, and color is where AI-generated UI
fails most visibly. `fundamentals` §3–§4 sets the baseline (a small scale, semantic roles, AA
contrast). This skill is the depth: **which** faces, **which** values, and the specific pairings that
break.

Two claims drive everything below:

1. **A page is a pairing, not a font.** One family used for everything is a template.
2. **Neutrals do the work; one accent does the pointing.** If you feel the urge to use more accent,
   that urge *is* the default — use less.

## 1 — The pairing rule: display + body + at most one outlier

**Three families is the ceiling. Two is canonical. Four is slop.**

- **Display** — headings and hero. Where the personality lives.
- **Body** — prose and UI. Where readability lives.
- **Outlier** (optional) — a *register*, not a third surface: the wordmark, a hero figure, a pull
  quote, a masthead, or code. **At most two slots on the page.** A third slot means you have a third
  body font — collapse it back.

Same family at different weights is **one** family. A mono used anywhere outside code counts as a
family. If you find four, drop one back to the display or body face.

The wordmark **may** — and on tone-rich work **should** — use a different face than the body. A
page whose wordmark is just the body font at 600 reads as un-branded. Collapse them into one family
only when the body voice genuinely carries the brand (letters, manifestos, long documents).

## 2 — Faces to avoid as the display choice

These are on-distribution for every model. They are not bad faces — Inter is excellent UI body type —
but reaching for them unprompted is the tell:

- **Sans:** Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Raleway, Work Sans, DM Sans, Nunito,
  Source Sans, Arial, Helvetica, and a bare `system-ui` stack as the *only* stack.
- **Serif:** Merriweather, Lora, Source Serif and Georgia as unexamined defaults; Playfair Display as
  *body* (it is a display face only, and an overused one).
- **Mono:** Courier New, Consolas-by-default, system mono.

If the user asks for one, use it. Otherwise pick with intent from §3.

## 3 — A catalog of free, foundry-grade alternatives

All free for commercial use (Google Fonts / Fontshare). This is a starting set, not a canon — the
point is to choose by *voice*, not by habit.

**Display** — Fraunces (variable serif, expressive) · Newsreader (roman serif, optical size) ·
Instrument Serif (tight, intimate) · DM Serif Display (printed feel) · Bodoni Moda (dramatic
high-contrast) · Cormorant Garamond (classical, luxury) · Bricolage Grotesque (variable, condensable,
bold) · Space Grotesk (geometric, slightly quirky) · Anton / Tanker (heavy condensed poster) ·
Big Shoulders Display (industrial condensed) · Cabinet Grotesk (magazine display) · Clash Display
(ultra-condensed) · Erode (distressed, hand-set) · Sentient (soft variable serif) · Geist (modern
grotesque).

**Body** — Geist · Switzer · General Sans · IBM Plex Sans (engineering) · Newsreader · Source Serif 4
· EB Garamond · Crimson Pro · Spectral (screen-tuned slab-ish).

**Mono / outlier** — Geist Mono · JetBrains Mono · IBM Plex Mono · Commit Mono · Space Mono (retro,
playful).

**Pairings by tone** (display → body → outlier):

| Tone | A working pairing |
| --- | --- |
| Editorial | Fraunces → IBM Plex Sans → JetBrains Mono |
| Technical | Geist 700 (or JetBrains Mono) → Geist → Geist Mono |
| Brutalist | Bricolage Grotesque 800 / Anton → Switzer → Space Grotesk numerals |
| Soft | Sentient → Crimson Pro → Geist Mono labels |
| Luxury | Cormorant Garamond / Bodoni Moda → EB Garamond → small caps from the display family |
| Playful | Bricolage Grotesque / Satoshi → Geist → Space Mono |
| Austere | Geist 400 / Switzer → Switzer → Geist Mono |
| Atmospheric | Geist 600 / Tomorrow → Geist 400 → JetBrains Mono |

**Never name a paid/foundry face in code unless the user has confirmed the license** — the page falls
back to a system default and looks broken to them. If they ask for a specific foundry voice (Söhne,
Tiempos, Druk, Berkeley Mono), name it *and* say it needs a license.

## 4 — Scale, weight, measure

- **Pick a ratio, not increments.** 1.2, 1.25 (major third — a safe default), 1.333, 1.5, or 1.618.
  Build from a 16px body. Five or six sizes cover a page; if you need more hierarchy, use weight and
  color, not another size.
- **Cap the display size.** ≤ ~88px (5.5rem) for headlines; ~96px on genuinely poster-led shapes. A
  single short word (≤ ~12 characters) can go bigger. `clamp()` for the responsive range.
- **Size to the headline's length** — ≤20 chars can take the full display size; 21–50 is the sweet
  spot; 51–90 steps down a rung; over 90 characters at display size is one of the most reliable
  tells — rewrite it shorter.
- **Weight contrast ≥ 300 units.** Body 400 pairs with headings at 700 or 200 — *not* 500 or 600,
  which reads as a default setting. Load real weights; never synthesize bold or italic.
- **Line-height moves with size.** Body 1.5–1.65; display 1.05–1.2. **All-caps display has a hard
  floor of 1.0** (1.02–1.08 recommended) — caps have no descenders, so tighter leading makes wrapped
  lines collide, worst with condensed faces.
- **Tracking.** Tighten display (−0.02 to −0.04em); open small caps and labels (0.08–0.14em,
  uppercase, real small caps where the face has them). Never above 0.05em on body.
- **Measure 45–75 characters** (`max-width: ~65ch`). Left-align body; center only short moments.
- **Headings are roman.** No italic headings and no italicized emphasis word inside a heading
  (`anti-slop` §2). Italic is for body-copy emphasis.
- **Never** all-caps paragraphs, justified text without hyphenation, or body type under 16px
  (14px absolute floor, 10px anywhere).

**Mechanics that are part of the craft:** `font-display: swap` on every web font; match fallback
metrics (`size-adjust`, `ascent-override`, `descent-override`) so swapping doesn't shift layout;
`font-variant-numeric: tabular-nums` on any column of figures; oldstyle figures in body prose where
supported; real typographic punctuation (`“ ” ’ — – …`) and a non-breaking space before units.

## 5 — Build the palette in four layers (OKLCH)

Author in **OKLCH**: it is perceptually uniform, so lightness is predictable and a hue stays itself
across tints. `hsl()` and `rgb()` lie about brightness.

1. **Paper** — the base surface. Light: `oklch(96–98% 0.005–0.015 <anchor>)`. Dark:
   `oklch(12–16% 0.008–0.015 <anchor>)`.
2. **Ink** — primary text. Light: `oklch(16–22% …)`. Dark: `oklch(92–96% …)`.
3. **Neutrals** — 5–9 steps between paper and ink, each carrying a trace of the anchor's chroma
   (0.005–0.015).
4. **Accent** — *one* saturated hue (chroma 0.12–0.22) for links, active states, focus rings,
   highlights. Two at the absolute most.

```css
:root {                              /* warm anchor, hue ≈ 80 */
  --color-paper:      oklch(96% 0.012 80);
  --color-paper-2:    oklch(93% 0.014 80);   /* raised surface */
  --color-rule:       oklch(82% 0.010 80);   /* hairlines, borders */
  --color-neutral:    oklch(56% 0.008 80);
  --color-muted:      oklch(40% 0.008 70);   /* secondary text */
  --color-ink:        oklch(18% 0.010 60);
  --color-accent:     oklch(62% 0.19  45);
  --color-accent-ink: oklch(98% 0.01  45);   /* text ON the accent — see §7 */
  --color-focus:      oklch(55% 0.19  55);
}
```

**Tint every neutral.** Zero-chroma greys read flat and synthetic. A warm accent over cool greys looks
wrong in a way nobody can name — pull the neutrals toward the anchor hue.

**No pure extremes.** `#000` and `#fff` as base colors are a tell. Use a near-black ink and a tinted
paper. (A deliberately pure-white paper is defensible in a strictly monochrome, Swiss-minimal
direction — but choose it, don't default into it.)

## 6 — Accent discipline: ≤5% of any viewport

The accent is a **highlighter, not a color block**. Count it by area — solid fills, headings set in
accent, full-bleed accent sections. If it exceeds roughly 5% of a viewport, retreat.

Spend it on: the active nav item · a focus ring · a link underline on hover · the primary action's
fill, border or text · a small square or rule beside a heading. Not on: giant filled buttons
everywhere, whole sections, or decorative gradients.

60/30/10 is a reasonable starting balance (dominant neutral / secondary / ~10% accent-and-emphasis),
with the *saturated* accent itself sitting at the low end of that 10%.

**Gradient bans:** no purple→blue, cyan→magenta or orange→pink gradients (the signature AI palette);
no gradient text; no three-stop gradients — two stops only, the third is vanity. A single subtle
two-stop gradient plus SVG grain is the one respectable ambient background.

## 7 — Contrast: the pairs that actually fail

Gate **every** rendered `(text, background)` pair — WCAG 2.2 AA is the floor: **4.5:1** for body text,
**3:1** for large text (≥24px, or ≥18.66px bold), icons, and focus indicators. Aim 7:1 on body where
you can. APCA (Lc ≥ 60 body, ≥ 45 large/icons/rings) is the better perceptual check when available.
Quick pre-check: if two OKLCH lightnesses differ by less than ~50 points, assume it fails and compute.

The four failures that ship most often:

1. **Surface flip without a text flip.** `.section--dark { background: var(--color-ink); }` while the
   text still inherits ink → ink-on-ink. **Any rule that overrides `background-color` must also state
   `color` in the same rule.** Never rely on inheritance for surface-flipping classes.
2. **Text on the accent fill.** `background: var(--color-accent); color: white` only works if the
   accent is dark enough. Define a **`--color-accent-ink`** token, verified against the accent, and use
   it every time the accent carries text. Hard-coded `white` is the bug.
3. **Muted text on a tinted surface.** `--color-muted` on `--color-paper-2/3` — both mid-lightness,
   often under 4.5:1. Darken the text or lift the surface.
4. **A focus ring that vanishes.** If `--color-focus` equals the accent, the ring disappears on
   accent-filled buttons. The ring needs ≥3:1 against **both** the element and the page.

And the one that reads worst: **button text within ~5% lightness of its own fill** (the classic
black-on-black button). If text and fill are that close in OKLCH lightness and chroma, it's a bug, not
a style.

Also: never encode meaning in color alone (pair with an icon, label or shape — red/green as the only
signal fails for ~1 in 12 men); never grey text on a colored background (always reads washed out);
never treat alpha as a palette color (transparency modifies overlays and shadows — a named token is
opaque).

## 8 — Dark mode is a recipe, not an inversion

- **Paper** at 12–18% lightness (not `#000`); **ink** at 92–96% (not `#fff`).
- **Reduce body weight by ~50 units** (400 → 350): light-on-dark type gains optical weight.
- **Accent:** drop chroma 0.02–0.04, raise lightness 5–10% so it doesn't vibrate.
- **Elevation by lightness** — higher surfaces are *lighter* (~+3% per level), never darker, and
  never a colored glow (`anti-slop` §3).
- **Keep the anchor hue** across modes. Only lightness and chroma move; a hue shift between modes
  makes the two themes feel like different products.
- Support both modes through **semantic tokens that remap**, never per-element hex.

## 9 — Themes: bundle the decisions, then rotate them

A **theme** is not a palette — it's a bundle of five decisions that hang together: **anchor hue** ·
**paper band** (dark / mid / light) · **display voice** · **accent** · plus the radius/border language
(`surfaces-and-details` §2–§3) and a motion stance (moving or still). Naming the bundle is what makes
a design reproducible and, more importantly, what makes *variety* auditable — you can't tell whether
two builds look different until you can name what each one was.

Starting points, not defaults — a dozen coherent bundles worth keeping in mind:

| Theme | Paper | Display voice | Accent | Radius / motion |
| --- | --- | --- | --- | --- |
| **Specimen** | Light, warm-tinted | High-contrast serif, very large | Warm, tiny footprint | Square · still |
| **Newsprint** | Off-white, cool | Roman serif, mast-scale | Near-neutral, ink-led | Square · still |
| **Atelier** | Warm paper | Classical serif, restrained | Almost none (small caps do the work) | Square · still |
| **Editorial** | Light | Serif display + grotesque body | Single warm hue | Soft · one reveal |
| **Manifesto** | Deep ink or saturated field | Heavy geometric sans, all-caps | Bleed color *is* the accent | Square · sweep |
| **Brutal** | Bright field or paper | Condensed heavy display | High-chroma, blocky | Square · hard cuts |
| **Riso** | Warm off-register cream | Bold display, slight distress | Two flat inks | Square · still |
| **Terminal** | Near-black, cool | Mono throughout | Phosphor (green/amber) | Square · typewriter |
| **Midnight** | Dark, hue-tinted | Grotesque or mono | Cool, low chroma | Soft · minimal |
| **Cobalt** | Light, cool | Grotesk + mono pairing | Cool blue, disciplined | Soft · minimal |
| **Hum** | Warm mid-light | Rounded humanist sans | Soft warm | Round · gentle |
| **Garden** | Warm light | Hanging serif, marginalia | Leaf green | Soft · still |

Two rules make the bundle useful:

- **No theme is the default.** If one keeps showing up unprompted, that's the attractor, not a
  preference. (The editorial-serif-with-numbered-labels look is the usual culprit — it's excellent
  *when the brief is editorial* and an obvious tell on a pricing page.)
- **Consecutive builds must differ on at least one axis** — paper band, display voice, or accent hue
  family (warm / cool / neutral / other chromatic). Differing only on display voice while sharing a
  light paper and a warm accent is a color-swap, not variety. Record the axes in the stamp comment
  (`structural-variety` §3) so the next build can diverge.

A theme locks the *values*; the shape stays a separate decision. A dark mono terminal theme can carry
a bento grid or a long document — pairing a fresh theme with the same page shape as last time still
reads as repetition.

## 10 — Token discipline

Once the palette and faces are chosen, **every color and every `font-family` in the artifact goes
through a named token.** A single inline `#5b6cff` in a hover state is how a three-color page becomes
an eight-color page by the third edit — the reader won't see the token, but they will feel the
looseness. If you need a value that doesn't exist, add the token first, then reference it. (Structure
and tiers: `design-systems`.)

## Checklist

- [ ] Two faces (three max): display + body + at most one outlier used in ≤2 slots; same family at
      different weights counted as one.
- [ ] No default UI sans doing display duty; no paid face named without a confirmed license.
- [ ] One ratio-based scale, ≤6 sizes, display capped (~88px), headline sized to its character count.
- [ ] Weight contrast ≥300 units; real weights loaded; nothing synthesized.
- [ ] Body 16px+, line-height 1.5–1.65, measure 45–75ch, left-aligned; all-caps display ≥1.0.
- [ ] Headings roman — no italic heading, no italic emphasis word inside a heading.
- [ ] Tabular numerals on figure columns; curly quotes, em/en dashes, real ellipses.
- [ ] OKLCH palette in four layers; every neutral tinted toward the anchor; no `#000`/`#fff` base.
- [ ] One accent, ≤5% of any viewport, spent on emphasis and signals only.
- [ ] No purple/cyan signature gradients, no gradient text, no three-stop gradients.
- [ ] Every rendered text/background pair gated at AA; `--color-accent-ink` defined and used; every
      surface-flip rule sets `color`; focus ring ≥3:1 against element *and* page.
- [ ] Dark mode built by recipe (paper 12–18%, ink 92–96%, weight −50, elevation by lightness, same
      hue), through remapped tokens.
- [ ] The theme bundle is named (anchor · paper band · display voice · accent · radius/motion) and
      differs from the last build on at least one axis.
- [ ] No color or font outside the token block.

## Related

- **`fundamentals` §3/§4 (sibling)** — the baseline this deepens (small scale, semantic roles, AA
  contrast, never color alone).
- **`anti-slop` (sibling)** — the palette and type tells this skill's rules are the answer to, plus
  the gate sweep that checks them.
- **`design-systems` (sibling)** — turn these values into primitive → semantic → component tokens and
  a theme mapping so the discipline survives many screens.
- **`data-visualization` (sibling)** — categorical/sequential/diverging chart color resolved from
  these same tokens.
- `devkit:ui-ux-design` — Dolle-MCP's `find_palettes` / `color_palettes` / `color_info` /
  `color_contrast` tools are how you generate and gate these values instead of free-handing them.

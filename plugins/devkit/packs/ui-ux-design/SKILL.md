---
name: ui-ux-design
description: >-
  Method for designing distinctive web UI/UX on top of the Dolle-MCP design server. Load when
  building or reshaping a web page/site: it drives the dolle-mcp MCP tools (templates, curated
  color palettes, WCAG contrast, gradients, SVG segmentation/tracing, screenshots) and runs a
  short design brief first — asking the user for direction (menubar, page count, single-page vs
  separate entry points, colors/palette, animation, images/SVG, page structure) whenever it
  hasn't been given.
---

# UI/UX Design (Dolle-MCP)

You are the design lead. The client is paying for a point of view they could not get from a
template — so every color, type, and layout choice is made *for this brief*, and you have a
real, offline design library to pull from: the **Dolle-MCP** server. This skill layers a
concrete tool workflow on top of the general design craft in **`devkit:ui-design`**.

**Keep the design-craft base in mind — `devkit:ui-design` `fundamentals`, especially its §0
(aesthetic direction): ground the design in the subject, the hero-as-thesis, deliberate typography,
structure-as-information, restraint, and self-critique.** This skill does not repeat that craft; it
adds *how to execute it against Dolle-MCP* and *what to settle with the user before building*. (The
external `frontend-design` skill covers the same aesthetic ground if you happen to have it —
optional, never required.)

**Before you build a page here, read three ui-design skills — they decide the things this workflow
then executes:** `anti-slop` (the named AI-default tells, the escape moves, and the gate sweep to run
on the finished screenshot), `structural-variety` (pick and *state* a named page shape, a nav
archetype and a footer archetype before markup — and make them differ from the last build), and
`type-and-color` (a real display+body pairing rather than a default UI sans, an OKLCH palette with
tinted neutrals, one accent under ~5%, a named theme bundle). Add `surfaces-and-details` the moment the
design involves cards, panels, or a radius/shadow decision — the containment ladder there is what stops
every group becoming the same rounded bordered box, and its 1px layer is most of what "polished" means.
Everything in Step 1's brief below feeds those decisions.

## Step 0 — Confirm the Dolle-MCP server is available, then call `golden_rules` first

**Before anything else in this workflow, call `mcp__dolle-mcp__golden_rules()`.** It returns this
server's own ordered workflow plus the golden rules of UI design, each wired to the templates that
demonstrate it — it is the fastest way to get the craft *and* the tool sequence in one call, and it
stays in sync with the library automatically. Use `golden_rules(topic="…")` when you need one area
in full (colour, containment, motion, content, accessibility, …).

## Step 0b — Use the library before inventing

The design library is served by the **`dolle-mcp`** MCP server (sibling repo `Dolle-MCP`,
registered in Claude Code as `dolle-mcp`). Its tools are namespaced **`mcp__dolle-mcp__<tool>`**.
**Before writing any markup, hitting the web, or inventing a palette from scratch, reach for
these tools** — they are the source of truth for what this project already has.

If the server is not connected, say so and tell the user how to add it, then stop for their
call on whether to proceed without it:

```
claude mcp add dolle-mcp -s user -- uvx --from git+https://github.com/OliverDolle/Dolle-MCP dolle-mcp
# then: /mcp  → dolle-mcp should be "connected"
```

The surface you will actually use (call `list_templates` and read the server's own
`guide://templates` resource for the live, authoritative list):

| Tool (`mcp__dolle-mcp__…`) | Use it to |
| --- | --- |
| **`golden_rules(topic?, detail?)`** | **Call this first on any design work.** ~48 golden rules of UI design across process, structure, type, colour, containment, states, motion, content, accessibility, responsiveness and performance — each naming *the templates that demonstrate it* (resolved live, with what each one is), *the tool* that does the work, and *the tell* (what the failure looks like). Also returns the ordered workflow for this server and a pre-ship checklist. Compact by default; `topic="color"` for one area in full. Same content as the `guide://golden-rules` resource. |
| `list_templates(category?, theme?, component?, q?, detail?)` | **Then here.** Returns compact rows `{id, name, category, theme, summary}` for the ~50 offline templates. **Narrow instead of scanning:** filter by `category` / `theme` / `component`, or `q` (substring). `detail=True` gives full metadata. Read `guide://templates` for a grouped one-line pick map. |
| `get_template_source(id)` | Pull the real HTML/CSS/JS for a template to adapt — buttons, navbars, typography, charts, business pages, effects. |
| `list_segments(id)` | List a catalog template's **individually-copyable pieces** (id/title/group only) — grab one button/nav/chart/shape/grid/text-effect instead of a whole page. |
| `get_segment(id, seg)` | Return **one** self-contained snippet (`html`/`css`/`js` + a combined `code`) — far less to read than the full page. |
| `screenshot_template(id, width?, height?, dark?)` | **See** a template as pixels before recommending it, and screenshot your own result to self-critique. |
| `open_preview(id?, seg?)` / `start_preview(port?)` / `preview_url(id)` | Open the live gallery (and `/palettes`) in the user's browser — the friendliest way to show a non-technical client the options; pass `seg` to jump to one component. |
| `deeplink(id, seg?)` | Build a shareable URL that scrolls to a specific component and **blinks it green** — use it to confirm exactly which piece you mean. |
| `restart_preview(port?)` | Relaunch the preview on **another port** when the default (4321) is already taken (e.g. another running instance); `start_preview` also auto-falls-back to a free port. |
| `color_palettes(colors, size?)` | Harmony palettes **around 1–3 seed colors** (complementary, analogous, triadic, blend, …) with ready `gradient_css`. |
| `find_palettes(colors?, limit?)` | Search the **curated** 3-/4-color palette catalog nearest a seed — or browse with no seed for ideas. |
| `color_info(color)` | Any color in hex/rgb/hsl/hsv/oklch + nearest name + `best_text`. |
| `color_contrast(fg, bg)` | WCAG ratio + AA/AAA verdicts — **gate every text/background pair through this.** |
| `color_gradients(colors, angle?)` | Paste-ready CSS linear/radial/conic gradients. |
| **`generate_theme(brand_color?/anchor_hue?, paper_band?, accent_hue?, accent_chroma?, radius?)`** | **Use this instead of hand-writing colors.** Builds a complete, contrast-**verified** OKLCH token set: paper→ink ramp with every neutral tinted toward the anchor hue (never flat grey, never `#fff`/`#000`), one accent, a verified `--color-accent-ink` for text *on* the accent, and a focus ring that clears 3:1 against both the page and the accent (two-tone where no single tone can). Returns tokens, paste-ready CSS, a pass/fail contrast table, `failures` (empty = all passed), notes on every adjustment it made, a dark-mode remap, and a stamp comment. |
| `list_themes()` / `get_theme(name)` | The 12 named theme **bundles** — anchor · paper band · display voice · accent family · radius · motion — with the rotation rule and the font pairing each expects; `get_theme` returns one bundle's verified tokens. Browse them rendered side by side in the `themes` template. |
| `extract_palette(image_path, max_colors?)` | Read a reference image's palette as design **roles** (surface / lightest / darkest / accent) + a `suggested_recipe` for `generate_theme`. The honest way to answer "make it feel like this" — take the colour relationships, not the layout. |
| **`design_variation(kind?, avoid?, domain?)`** | **Run this before writing markup.** Returns a page shape / nav / footer / theme that *differs from the last build*: no args → a full structural fingerprint plus the stamp comment to paste; `kind=` → one axis with alternates; `domain=` → three shapes from categorically different families to offer the user. Pass `avoid=` with whatever the project's existing stamp records. |
| **`slop_check(target)`** | **Run this before handing work back.** Lints a file path or raw HTML/CSS for the mechanically-detectable AI-default tells with line numbers and severity (violet gradients, gradient headlines, `#000`/`#fff`, zero-chroma neutrals, `transition: all`, uniform hover-scale, overshoot easing, animated layout props, fade-in focus rings, missing `prefers-reduced-motion`, `100vw`, bare `1fr` with images, italic headings, emoji icons, ad-hoc z-index, banned copy, unsourced metrics). Also lists what still needs eyes. |
| `search_segments(q, limit?, template?)` | Search **every** template's copyable components at once — "masthead", "ticket", "stat", "focus", "containment" — instead of guessing which template holds it. |
| `segment_svg(svg, name?)` | Split an SVG into independently-animatable `.seg` groups + an animated preview. |
| `trace_image_to_svg(image_path, max_colors?, name?)` | Trace a raster logo/image to a segmented, animatable SVG. |
| `screenshot_preview(url, …)` | Screenshot any live preview URL (e.g. a generated SVG) so you can see the animated result. |

**Four reference sheets exist specifically to break the sameness — read them before you invent:**
**`themes`** (12 bundles rendering one module like-for-like, each printing its measured contrast),
**`page-shapes`** (12 whole-page shapes in 6 families as copyable skeletons — the fix for pages that
are visually distinct but structurally identical), **`details`** (19 before/after specimens of the
1px layer: focus geometry, `text-wrap`, reserved slots, OS preferences), and **`cards`**, whose
*first* row is the containment ladder — the alternatives that come before reaching for a rounded
bordered box.

The catalog is ~75 templates across ten categories (call `list_templates(category=…)` or read
`guide://templates` for the authoritative, current list — don't rely on this snapshot):
**Buttons & text** (`buttons`, `text-effects`, `kinetic-text`, `typography`), **Navigation**
(`navbars`, `nav-patterns`), **Data & charts** (`charts`, `charts-lab`, `diagrams`,
`data-relations`, `data-geo`), **3D** (`threed-css`, `threed-webgl`, `scroll-3d`, `gallery-wheel`,
`containers-3d`), **Motion & SVG** (`svg-segments`, `scroll-effects`, `gallery-scroll`,
`gallery-swipe`), **Effects & backgrounds** (`glitch`, `bg-transitions`, `mechanics`, `shapes`,
`interactive`, `bg-live`, `light-shadow`, `light-craft`, `visual-fx`), **Layout & grids** (`grids`,
`image-layouts`, `hierarchy`), **Components & sections** (`content-sections`, `cards`, `forms`,
`loaders`, `notifications`, `social-proof`, `time-counters`, `audio-players`), **Design styles**
(`design-styles` — 14 aesthetics on one module), and **Business pages** (`biz-saas`, `biz-agency`,
`biz-corporate`, `biz-luxury`, `biz-launch`, `biz-restaurant`, `biz-capital`, `biz-counsel`,
`biz-consult`). Read the source of the ones that fit — and for the **component-catalog** templates
(the Buttons & text, Navigation, Components & sections, `shapes`, `grids`, `image-layouts`,
`design-styles`, catalog charts) prefer `list_segments` + `get_segment` to pull one piece rather
than reinventing it, then adapt to the brief's palette and voice.

## Step 1 — Run the design brief (ask before you build)

If the user has already specified a direction, follow it exactly and skip the matching
questions. **For anything they left open, ask before building** — use the `AskUserQuestion`
tool so choices are cheap to make (one question per axis, sensible recommended option first,
grounded in what the MCP server can actually deliver). Do not silently pick defaults on these
axes; a wrong guess here wastes a whole build.

Cover these axes:

1. **Design type / mood.** What is this page and who is it for? What feeling — editorial,
   corporate/B2B, playful, cyber/technical, calm-minimal, maximalist? Map their answer to a
   starting template via `list_templates` (e.g. B2B → `biz-corporate`, SaaS / AI launch →
   `biz-saas` / `biz-launch`, agency/portfolio → `biz-agency`, luxury brand → `biz-luxury`,
   restaurant/hospitality → `biz-restaurant`, cyber → `glitch`). If they have no idea,
   `open_preview()` so they can browse the gallery and point. Also settle **three personality
   adjectives** and commit to them everywhere — they calibrate intensity (bold / editorial / warm
   vs. restrained / luxurious / quiet) — and ask for a **reference vibe** (a site or brand whose feel
   they like: "like Linear", "editorial like a magazine") to anchor the aesthetic fast.

2. **Menu bar / navigation (if the page needs one).** Does it need nav at all? If so, which
   shape — simple, centered, split, transparent-over-hero, sticky-shrink, glass, pill/floating,
   sidebar, bottom tab bar, hamburger drawer, or ⌘K command palette? All of these exist in the
   `navbars` template — offer from that set (`get_template_source("navbars")`).

3. **How many pages.** One-page (scrolling sections) or multiple distinct pages? This drives
   the whole structure.

4. **Single document vs separate API entry points.** Should the pages load as **one** document
   (in-page routing / anchored sections, one entry point) or as **separate** entry points
   (distinct HTML files / routes / API endpoints per page)? Confirm this explicitly — it
   changes how you wire navigation and how the app is served. State the trade-off: one entry =
   simpler, instant section transitions, heavier first load; separate entries = smaller pages,
   real URLs, a navigation cost between them.

5. **Colors & palette.** Ask for any brand colors or a mood. Then **generate options with the
   MCP tools, do not free-hand a palette**:
   - **A palette is not a theme.** Once a direction is picked, run
     **`generate_theme(brand_color="#…", paper_band=…, radius=…)`** (or `get_theme(name)` for a
     named bundle) and build from the tokens it returns. It is the only path that guarantees
     tinted neutrals, one accent, a verified accent-ink, and a focus ring that clears both the
     page and the accent — the four things hand-picked palettes get wrong. Check `failures` is
     empty, and paste its `stamp` at the top of the stylesheet.
   - Working from a reference image or screenshot? `extract_palette(path)` → feed its
     `suggested_recipe` into `generate_theme`. Take the colour relationships, never the layout.
   - Have a seed color / brand → `find_palettes(["#seed"])` for curated sets **and**
     `color_palettes(["#seed"])` for harmonies around it.
   - Only a mood, no color → `find_palettes()` (browse the curated catalog) or seed from a
     color drawn from the subject's own world.
   - Show 2–3 candidate palettes (swatches + names), or `open_preview()` → `/palettes` and let
     them point. Lock the winner, then `color_gradients(...)` for any gradient accents.
   - **Avoid defaulting to purple / violet / indigo.** Models are over-trained on it, so it
     reads as "AI-generated." Unless the brand *is* purple, seed the palette from the subject or
     the curated catalog (blue, teal, emerald, amber, rose, sunset, lime, cyan, …) — the library
     is deliberately varied for exactly this reason. Also steer clear of the other AI defaults
     called out in `devkit:ui-design` §0 (cream + serif + terracotta; near-black + one acid accent).

6. **Animation.** Do they want motion, and how much? Offer concrete, existing options rather
   than "some animations": advanced scroll mechanics — variable speed, horizontal, motion-blur,
   snap, scrub (`scroll-effects`), section-to-section **background transitions** (`bg-transitions`),
   **web mechanics** — sticky theme-switch, bento, marquee, count-up, scroll progress, magnetic
   cursor, scrollytelling (`mechanics`), a **loading-state** catalog — spinners, skeletons,
   stateful loaders (`loaders`), text animations (`text-effects`), kinetic / 3D / scroll-
   scrubbed / path text (`kinetic-text`), SVG animation — segment reveals, logo draw-ons, morphs
   (`svg-segments`), scroll-driven galleries & media transitions — arched/coverflow/cylinder
   wheels, shuffle, depth reel, full-bleed reveal, visibility-gated video, image swipes
   (`gallery-wheel`, `gallery-scroll`, `gallery-swipe`), pointer-interactive canvases & ambient
   backgrounds — water ripple, ASCII reveal, particle shatter, flow fields, aurora
   (`interactive`, `bg-live`), visual-effect filters — blur/glass, glow, grain, duotone
   (`visual-fx`), or cyber glitch (`glitch`). They can also ask for something not in the library — build it, but hold it to the
   same bar. Whatever is chosen: animate only `transform`/`opacity`, gate everything behind
   `prefers-reduced-motion`, and no-op pointer effects on touch. Prefer one orchestrated moment
   over scattered effects. A solid **baseline for a marketing/brand page**: a hero entrance,
   staggered section reveals as they enter the viewport, one scroll-linked / parallax moment, and
   hover micro-interactions on links/cards (~200–300ms, ease-out, a real curve like
   `cubic-bezier(0.22, 1, 0.36, 1)` — **never linear**). Keep it orchestrated: *everything*
   animating is as templated as nothing animating — motion should feel composed, not busy.

7. **Images / SVG assets.** Do they have images or SVGs to use? Do they want a raster
   logo/image **traced to SVG** so it can animate? If yes:
   - `trace_image_to_svg("C:/path/logo.png", max_colors=6)` → segmented, animatable SVG.
   - `segment_svg(svg)` for existing SVG markup/files.
   - `screenshot_preview(preview_url)` to see the animated result before committing.
   - **Text over imagery — do it deliberately.** Make the words legible and placed with intent: a
     gradient scrim / overlay behind text (never a headline floating on busy pixels), tasteful
     `mix-blend-mode` where it helps, and placement that follows the image's composition rather than
     dead-center by default. Treat photographic images so they don't look dropped-in — a
     duotone/tint, a grain/noise layer, or a soft hero parallax. The library already ships these:
     `visual-fx` (blur/glass, glow, grain, duotone), `light-craft` / `light-shadow`, `bg-live`, and
     `image-layouts` — pull from them rather than hand-rolling.
   - If they have none, decide with them whether the design leans on type/color/layout instead
     (often stronger than stock imagery); when a photographic hero is genuinely wanted, a
     subject-appropriate placeholder from a stock source (e.g. Unsplash) can stand in — but a strong
     type/color/layout system and the offline library usually read as less generic than stock.

8. **Page structure & layout.** **Start by calling `design_variation(domain="<what this is>")`**
   and offer the user the three page shapes it returns (they come from categorically different
   families — that contrast is what produces variety). If the project already has a stamp comment
   from a previous build, pass those values as `avoid=[…]` so this page can't repeat the last one.
   State the chosen shape, nav and footer in prose before writing markup, and browse
   `page-shapes` for the skeleton. Then: how is content organized — heavy on **containers/cards** (bento
   grids, feature cards, stat tiles, pricing tiers — see the business templates, `mechanics`
   bento, and the **`grids`** layout catalog: auto-fit, masonry, bento, justified, mosaic, areas,
   subgrid, plus warped / sidewall / isometric / radial / hex) or on **long-form text sections**
   (editorial, multi-column, article, sticky-aside — see the `typography` template)? Read the
   relevant template source to see the structural options the library already supports, and
   propose a concrete section skeleton (hero → … → footer) before writing code. Whichever it is,
   give the page **rhythm**: alternate section treatments (light/dark, full-bleed image, split,
   oversized type) and use asymmetry / an editorial grid instead of a stack of identical centered
   bands — see `devkit:ui-design` §0 (*compose, don't stack*). Every section should earn its place
   and look different from its neighbors.

If content/charts are involved, also read `guide://chart-libraries` (default: **ECharts**,
vendored, colors resolved from CSS custom properties) before picking a charting approach.

## Step 2 — Plan (brief → token system), then build

Once the axes are settled, plan in two passes (the aesthetic-direction discipline from
`devkit:ui-design` §0): first a compact token system (4–6 named hex values, 2+ type roles, a layout
concept with an ASCII wireframe, and one **signature** element), then critique it against the brief
to strip anything generic, then build —
adapting real template source where it fits and deriving every color/type decision from the
locked plan. Theme with **CSS custom properties** so palette and light/dark are swappable
(charts must resolve their colors from those variables at render time and re-apply on theme
change — never hardcode).

## Step 3 — Verify with your eyes and the tools

- `screenshot_template` / `screenshot_preview` your result and critique the pixels — a picture
  is worth 1000 tokens. Fix what looks templated or off-balance.
- Ask the hard question of that screenshot: *would this look at home in an award gallery, or like a
  template?* Name the single most generic thing (default display type, everything centered, a flat
  palette, no motion, text lost on an image) and fix it before shipping — the §0 self-critique.
- **Run `slop_check(<path>)` on every file you wrote** and fix what it names — it reports the
  mechanical gates with line numbers, so this is evidence rather than self-assessment. Then run
  `anti-slop`'s gate sweep against the screenshot and the source for the ones a regex can't judge — every answer must be "no":
  no gradient hero or gradient headline, no `100vh` all-centered hero, no three-up icon-card grid, no
  card-in-card, no wordmark+4-links nav or 4-column link-farm footer, no italic heading, no emoji
  icons or mixed icon sets, no `transition: all` or uniform hover-scale, no invented metrics or
  testimonials, no fake browser/phone/terminal chrome, no off-scale spacing or ad-hoc z-index. Score
  the six pre-emit axes (philosophy · hierarchy · execution · specificity · restraint · variety) and
  revise anything under 3 before you hand it back.
- **Check the hero fits the fold at 1280×800** — headline, lede and primary action visible without
  scrolling, bottom-weighted padding, at most two elements on the centered axis.
- Run **every** foreground/background pair through `color_contrast` and hit **WCAG 2.2 AA at
  minimum** (AAA for body text where you can). WCAG 2.2 is the current W3C Recommendation — also
  check its AA additions: targets ≥24×24px (44 comfortable), the focus ring never obscured by a
  sticky nav, any drag interaction has a single-pointer alternative, and login fields allow paste /
  password managers (see `devkit:ui-design` `fundamentals` §11).
- Check it responsive down to mobile, keyboard focus visible, and reduced-motion honored
  (motion freezes to a rich static state; loops never start; reveal content is never left
  hidden).
- **Heuristic evaluation (a quick design-QA pass).** Before shipping, walk the result once against
  **Nielsen's 10 usability heuristics** (visibility of system status; match to the real world;
  user control & freedom / easy undo; consistency & standards; error prevention; recognition over
  recall; flexibility & efficiency; aesthetic & minimalist design; help users recover from errors;
  help & documentation). Log each issue with a **severity rating** (0 = not a problem → 4 =
  usability catastrophe, must fix before ship) so fixes are prioritized, not just listed. It's a
  structured sweep *over* the per-skill checklists, not a replacement for them; **~3 independent
  evaluators surface roughly 60% of issues**, so a second and third pass (or reviewer) pays off.
- Confirm the single-document vs separate-entry-point decision is actually reflected in how the
  files/routes are wired.

## What to take into account (the standing bar)

- **Use the library before inventing.** Adapt template source and curated palettes; only
  hand-roll what the library genuinely lacks — then hold it to the same quality.
- **No purple-by-default**, and no cream/serif/terracotta or black/acid-accent auto-pilot.
  Choose from the subject or the curated catalog. Avoid the other AI defaults too — a default UI
  sans (Inter/Roboto/Open Sans) as the *display* face, the blue-grey "SaaS" palette, pure black on
  pure white, the dead-centered hero, and the identical three-up icon-card grid (the full catalog is
  `devkit:ui-design` `anti-slop`; direction is `fundamentals` §0).
- **State the page shape, nav and footer before markup**, and make them differ from the last page you
  built for this user — structural sameness survives every palette swap, so it's the fingerprint that
  matters most (`devkit:ui-design` `structural-variety`). Leave a stamp comment recording the picks.
- **One accent, under ~5% of any viewport; every neutral tinted toward the anchor hue; author color in
  OKLCH.** Define an accent-text token for any surface the accent fills, and make every rule that flips
  a background also state its `color` (`devkit:ui-design` `type-and-color`).
- **Never invent a metric, testimonial, logo or customer count.** Use a labelled placeholder or drop
  the section; fabricated proof discredits the real claims next to it.
- **Real copy, never lorem ipsum.** Write specific, confident text in the brand's voice; placeholder
  text hides whether the layout actually works and ships looking unfinished.
- **Accessibility is not optional:** WCAG 2.2 AA contrast, visible focus (never obscured), 24/44px
  targets, a single-pointer alternative to any drag, reduced-motion, touch no-ops, semantic structure.
- **SVG icons, never system emoji.** Don't drop OS emoji (🎉, ✅, 🚀) into markup as icons — they
  render differently per platform, can't be styled to the palette, and are screen-reader noise. Use
  SVG icons (inline or from the library) that inherit `currentColor`; label icon-only controls and
  `aria-hidden` decorative ones. Emoji only in real user content, never in chrome. See
  `devkit:ui-design` §12.
- **Motion is compositor-only** (`transform`/`opacity`) and always reversible under
  `prefers-reduced-motion`.
- **Spend boldness once.** One signature element; keep everything around it quiet.
- **Show, don't tell.** Prefer `open_preview()` and screenshots to walls of description when
  aligning with the user.

## Related

- `devkit:ui-design` — the design-craft base this skill layers on: `anti-slop` (tells, escape moves,
  gate sweep), `structural-variety` (page shape, nav/footer archetypes, hero fit), `type-and-color`
  (pairings, OKLCH palettes, contrast pairs), `fundamentals` (§0 aesthetic direction + the craft),
  `motion-and-interaction`, `data-visualization`, `design-systems`. The external `frontend-design`
  skill is an optional complement, not required.
- Dolle-MCP docs (sibling repo): `docs/templates.md`, `docs/color-tools.md`, `docs/svg-tools.md`,
  `docs/web-mechanics.md`, `docs/backgrounds-and-transitions.md`, `docs/chart-libraries.md`,
  `docs/mcp-tools.md`.
</content>
</invoke>

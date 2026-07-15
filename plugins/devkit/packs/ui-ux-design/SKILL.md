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
concrete tool workflow on top of the general design craft in the `frontend-design` skill.

**Load `frontend-design:frontend-design` first (or keep it in mind) and treat it as the base.**
It owns the craft — grounding the design in the subject, the hero-as-thesis, deliberate
typography, structure-as-information, restraint, and self-critique. This skill does not repeat
that; it adds *how to execute it against Dolle-MCP* and *what to settle with the user before
building*. When the two ever conflict, `frontend-design`'s craft wins on aesthetics, this skill
wins on the tool workflow.

## Step 0 — Confirm the Dolle-MCP server is available and use it first

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
`guide://chart-libraries` resource for the live, authoritative list):

| Tool (`mcp__dolle-mcp__…`) | Use it to |
| --- | --- |
| `list_templates()` | **Start here.** Discover the 19 offline, theme-driven templates (id, theme, category, components) so you propose from what exists, not from memory. |
| `get_template_source(id)` | Pull the real HTML/CSS/JS for a template to adapt — buttons, navbars, typography, charts, business pages, effects. |
| `screenshot_template(id, width?, height?, dark?)` | **See** a template as pixels before recommending it, and screenshot your own result to self-critique. |
| `open_preview(id?)` / `start_preview()` / `preview_url(id)` | Open the live gallery (and `/palettes`) in the user's browser — the friendliest way to show a non-technical client the options. |
| `color_palettes(colors, size?)` | Harmony palettes **around 1–3 seed colors** (complementary, analogous, triadic, blend, …) with ready `gradient_css`. |
| `find_palettes(colors?, limit?)` | Search the **curated** 3-/4-color palette catalog nearest a seed — or browse with no seed for ideas. |
| `color_info(color)` | Any color in hex/rgb/hsl/hsv/oklch + nearest name + `best_text`. |
| `color_contrast(fg, bg)` | WCAG ratio + AA/AAA verdicts — **gate every text/background pair through this.** |
| `color_gradients(colors, angle?)` | Paste-ready CSS linear/radial/conic gradients. |
| `segment_svg(svg, name?)` | Split an SVG into independently-animatable `.seg` groups + an animated preview. |
| `trace_image_to_svg(image_path, max_colors?, name?)` | Trace a raster logo/image to a segmented, animatable SVG. |
| `screenshot_preview(url, …)` | Screenshot any live preview URL (e.g. a generated SVG) so you can see the animated result. |

The template catalog spans: **starters** (`aurora-light/dark`), **components**
(`buttons`, `text-effects`, `typography`, `navbars`), **data/3D** (`charts`, `threed-css`,
`threed-webgl`), **motion & SVG** (`parallax`, `motion`, `svg-segments`, `svg-page`),
**effects/backgrounds** (`glitch`, `bg-transitions`, `mechanics`), and **business pages**
(`biz-saas`, `biz-agency`, `biz-corporate`). Read the source of the ones that fit rather than
reinventing components — then adapt them to the brief's palette and voice.

## Step 1 — Run the design brief (ask before you build)

If the user has already specified a direction, follow it exactly and skip the matching
questions. **For anything they left open, ask before building** — use the `AskUserQuestion`
tool so choices are cheap to make (one question per axis, sensible recommended option first,
grounded in what the MCP server can actually deliver). Do not silently pick defaults on these
axes; a wrong guess here wastes a whole build.

Cover these axes:

1. **Design type / mood.** What is this page and who is it for? What feeling — editorial,
   corporate/B2B, playful, cyber/technical, calm-minimal, maximalist? Map their answer to a
   starting template via `list_templates` (e.g. B2B → `biz-corporate`, SaaS landing →
   `biz-saas`, agency/portfolio → `biz-agency`, cyber → `glitch`). If they have no idea,
   `open_preview()` so they can browse the gallery and point.

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
     `frontend-design` calls out (cream + serif + terracotta; near-black + one acid accent).

6. **Animation.** Do they want motion, and how much? Offer concrete, existing options rather
   than "some animations": scroll-reveal & parallax (`parallax`), a reusable entrance/hover/
   loader catalog (`motion`), section-to-section **background transitions** (`bg-transitions`),
   **web mechanics** — sticky theme-switch, bento, marquee, count-up, scroll progress, magnetic
   cursor, scrollytelling (`mechanics`), text animations (`text-effects`), or cyber glitch
   (`glitch`). They can also ask for something not in the library — build it, but hold it to the
   same bar. Whatever is chosen: animate only `transform`/`opacity`, gate everything behind
   `prefers-reduced-motion`, and no-op pointer effects on touch. Prefer one orchestrated moment
   over scattered effects.

7. **Images / SVG assets.** Do they have images or SVGs to use? Do they want a raster
   logo/image **traced to SVG** so it can animate? If yes:
   - `trace_image_to_svg("C:/path/logo.png", max_colors=6)` → segmented, animatable SVG.
   - `segment_svg(svg)` for existing SVG markup/files.
   - `screenshot_preview(preview_url)` to see the animated result before committing.
   - If they have none, decide with them whether the design leans on type/color/layout instead
     (often stronger than stock imagery).

8. **Page structure.** How is content organized — heavy on **containers/cards** (bento grids,
   feature cards, stat tiles, pricing tiers — see the business templates and `mechanics` bento)
   or on **long-form text sections** (editorial, multi-column, article, sticky-aside — see the
   `typography` template)? Read the relevant template source to see the structural options the
   library already supports, and propose a concrete section skeleton (hero → … → footer) before
   writing code.

If content/charts are involved, also read `guide://chart-libraries` (default: **ECharts**,
vendored, colors resolved from CSS custom properties) before picking a charting approach.

## Step 2 — Plan (brief → token system), then build

Once the axes are settled, do the `frontend-design` two-pass planning: a compact token system
(4–6 named hex values, 2+ type roles, a layout concept with an ASCII wireframe, and one
**signature** element), critique it against the brief to strip anything generic, then build —
adapting real template source where it fits and deriving every color/type decision from the
locked plan. Theme with **CSS custom properties** so palette and light/dark are swappable
(charts must resolve their colors from those variables at render time and re-apply on theme
change — never hardcode).

## Step 3 — Verify with your eyes and the tools

- `screenshot_template` / `screenshot_preview` your result and critique the pixels — a picture
  is worth 1000 tokens. Fix what looks templated or off-balance.
- Run **every** foreground/background pair through `color_contrast` and hit **AA at minimum**
  (AAA for body text where you can).
- Check it responsive down to mobile, keyboard focus visible, and reduced-motion honored
  (motion freezes to a rich static state; loops never start; reveal content is never left
  hidden).
- Confirm the single-document vs separate-entry-point decision is actually reflected in how the
  files/routes are wired.

## What to take into account (the standing bar)

- **Use the library before inventing.** Adapt template source and curated palettes; only
  hand-roll what the library genuinely lacks — then hold it to the same quality.
- **No purple-by-default**, and no cream/serif/terracotta or black/acid-accent auto-pilot.
  Choose from the subject or the curated catalog.
- **Accessibility is not optional:** WCAG AA contrast, visible focus, reduced-motion, touch
  no-ops, semantic structure.
- **Motion is compositor-only** (`transform`/`opacity`) and always reversible under
  `prefers-reduced-motion`.
- **Spend boldness once.** One signature element; keep everything around it quiet.
- **Show, don't tell.** Prefer `open_preview()` and screenshots to walls of description when
  aligning with the user.

## Related

- `frontend-design:frontend-design` — the design-craft base this skill layers on.
- Dolle-MCP docs (sibling repo): `docs/templates.md`, `docs/color-tools.md`, `docs/svg-tools.md`,
  `docs/web-mechanics.md`, `docs/backgrounds-and-transitions.md`, `docs/chart-libraries.md`,
  `docs/mcp-tools.md`.
</content>
</invoke>

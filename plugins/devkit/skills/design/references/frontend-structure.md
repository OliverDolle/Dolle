# Front-end file structure — small files, one concern each

A page that lives in one 900-line `index.html` works, but nobody can read it in parts: a person
reviewing a change to one button and an AI agent asked to fix one state both have to load the
whole file. Split the code so **every file answers one question** — "where are the colours?",
"what draws the results pane?" — and both humans and agents can open just that file. This is the
same idea as this plugin's routers and references, applied to UI code.

## §0 Why it pays

- **Agents read segments.** An agent's context is the cost. With a module map it opens
  `results.js` (150 lines) instead of the page (900+), and an edit cannot collide with unrelated
  code. Smaller files also give tools exact targets: `slop_check` per file reports line numbers
  in the file you actually change; `contrast_audit tokens.css` checks every colour in one call.
- **Reviews and diffs stay local.** A colour change touches `tokens.css` only; a new state touches
  one component file.
- **One source per decision.** Colours, fonts and spacing live in exactly one file, so a theme
  swap or a contrast fix cannot miss a stray literal.

## §1 The layout

```text
static/
  index.html          markup only: landmarks, labels, empty containers the modules fill
  icons.svg           one icon sprite (one grid, one stroke), used via <use href="icons.svg#i-name">
  fonts/              self-hosted woff2 (no CDN for anything that must render)
  css/
    tokens.css        every colour, font, spacing step and radius; light + dark theme blocks
    base.css          reset, type, page layout (the shape of the page)
    controls.css      form fields, buttons, segmented controls, dropzones
    <part>.css        one file per part of the page (sheet.css, results.css, editor.css ...)
  js/
    main.js           entry point: wires modules, loads data, and documents the module map
    api.js            every network call, one place for errors and status codes
    state.js          the shared state object
    dom.js            tiny helpers ($, escape, icon, number format)
    <part>.js         one ES module per part of the page (status, files, sheet, editor, results ...)
```

`<link>` order is the cascade order: tokens → base → controls → parts. Use `<script type="module">`
— native ES modules need no build step, and imports make the dependency graph explicit.

## §2 Rules

1. **`index.html` is markup.** No `<style>` blocks, no inline `<script>`, no `style=""` — except a
   custom property that carries data (`style="--v:0.83"` on a bar), which is content, not styling.
2. **Literals live in `tokens.css` only.** Every other stylesheet uses `var(--…)`. Generate the
   tokens (`generate_theme`) and audit them where they live (`contrast_audit`).
3. **Split by part of the page, not by technique.** `sheet.js` and `sheet.css`, not `utils2.js`
   and `misc.css`. Motion belongs in the file of the part it moves, inside
   `prefers-reduced-motion`.
4. **One concern per file, roughly 50–250 lines.** When a file starts serving two parts of the
   page, split it. When two files always change together, merge them.
5. **Every file opens with a one-line comment saying what it owns.** Agents route on the first
   lines; `main.js` carries the full module map.
6. **One way out to the network** (`api.js`) and **one shared state** (`state.js`). Modules do
   not `fetch` on their own or keep hidden copies of shared data.
7. **No side effects at import time** outside `main.js`. Modules export functions; `main.js`
   calls the `init…()` ones. Then import cycles between parts (editor ↔ sheet) are harmless,
   because functions are only called after every module has loaded.
8. **Escape at the boundary.** One `esc()` helper for every value interpolated into HTML strings,
   or build nodes with the DOM API.
9. **Same origin, no CDN.** Fonts, icons and scripts are served by the app itself, so the page
   works offline and behind a firewall.

## §3 When to keep one file

Some deliverables must be self-contained: a published artifact, an HTML email, a one-off demo,
a copy-paste component (Dolle-MCP segments are deliberately single snippets). Keep those in one
file, but order the sections the same way (tokens → base → parts; then markup; then scripts by
part) with a comment header per section, so they can be split later without rethinking them.

## §4 Checklist

- [ ] `index.html` holds markup only; no inline styles or scripts beyond data custom properties.
- [ ] All colour/font/spacing literals are in `tokens.css`; `contrast_audit` ran on it.
- [ ] CSS and JS are split by part of the page; each file states its concern on line 1.
- [ ] `main.js` documents the module map and is the only module with import-time effects.
- [ ] Network calls go through `api.js`; shared data through `state.js`.
- [ ] `slop_check` ran on every stylesheet and module, not just the HTML.
- [ ] Icons from one sprite; fonts self-hosted; nothing that must render comes from a CDN.

## Related

- `design-systems.md` — the token tiers that `tokens.css` holds.
- `web-dolle-mcp.md` — `generate_theme`, `contrast_audit` and `slop_check` per file.
- `devkit:engineering` → `references/extensible-architecture.md` — module boundaries beyond the UI.

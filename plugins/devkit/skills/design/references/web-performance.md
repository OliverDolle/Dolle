# Web Performance (Core Web Vitals)

Performance is a feature, and it is measurable — so **measure first, change one thing, measure
again.** Never optimize by vibes. The user-facing target is Google's Core Web Vitals, judged at
the **75th percentile** of real visits (field data), not your fast laptop on localhost.

## The metrics and their thresholds

| Metric | What it measures | Good | Needs work | Poor |
| --- | --- | --- | --- | --- |
| **LCP** (Largest Contentful Paint) | Time until the largest above-the-fold element renders | ≤ 2.5 s | ≤ 4.0 s | > 4.0 s |
| **CLS** (Cumulative Layout Shift) | Unexpected layout movement (unitless) | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| **INP** (Interaction to Next Paint) | Worst-case input→paint latency across the visit (replaced FID in 2024) | ≤ 200 ms | ≤ 500 ms | > 500 ms |

Supporting diagnostics (not scored, but they explain the above): **TTFB** (server response),
**FCP** (first content), total **JS execution time**, and transfer sizes.

## Step 1 — Measure (lab, then field)

- **Lab (repeatable, in your control):** Lighthouse (Chrome DevTools → Lighthouse, or
  `npx lighthouse <url> --view`, or CI via `@lhci/cli`). Throttle to **mobile + slow 4G + 4×
  CPU** — the default fast desktop run hides real problems.
- **Trace the runtime:** DevTools **Performance** panel for long tasks (any task > 50 ms blocks
  input and inflates INP) and layout-shift markers.
- **Field (the truth):** real-user monitoring with the [`web-vitals`](https://github.com/GoogleChrome/web-vitals)
  library (tiny; reports LCP/CLS/INP/TTFB from actual visits), or the Chrome UX Report (CrUX) /
  PageSpeed Insights for your origin. Lab can pass while the field fails — trust the field for
  the verdict.
- **Scriptable checks:** Playwright (already in this stack via Dolle-MCP's screenshot pipeline)
  can drive a page and pull `performance` timings / `PerformanceObserver` entries for a repeatable
  gate in CI.

Record the baseline numbers before touching anything.

## Step 2 — Fix by metric (biggest wins first)

### LCP — usually images, fonts, or a slow server
- Identify the LCP element in the Lighthouse "Largest Contentful Paint element" audit.
- If it's an **image**: serve modern formats (AVIF/WebP), size it to its displayed dimensions
  (`srcset`/`sizes`), and set `fetchpriority="high"` + `loading="eager"` on the hero image only.
  **Never lazy-load the LCP image.** `preload` it if it's discovered late (e.g. a CSS background).
- **Fonts:** `font-display: swap` (or `optional`), `preload` the one weight used above the fold,
  and self-host — third-party font CSS adds a render-blocking round trip.
- **Server/TTFB:** cache HTML/edge-cache, cut redirect chains, and prefer static/SSG or streamed
  SSR over blocking server work.
- **Render-blocking resources:** inline critical CSS, defer the rest; `defer`/`async` scripts.

### CLS — reserve space for anything that arrives late
- Give **every image/video/iframe explicit `width`+`height`** (or `aspect-ratio`) so the box is
  reserved before the asset loads.
- Reserve space for ads/embeds/banners with min-heights; never inject content above existing
  content after load.
- Fonts: match fallback metrics (`size-adjust`/`ascent-override`, or `font-display: optional`) to
  avoid reflow when the web font swaps in.
- Animate only `transform`/`opacity` — animating layout properties (top/left/width/height)
  causes shift and misses the compositor.

### INP — stop blocking the main thread
- Break up **long tasks**: yield with `await scheduler.yield()` / `setTimeout` / `isInputPending`,
  chunk heavy loops, and move non-UI CPU work to a **Web Worker**.
- Debounce/throttle high-frequency handlers; do expensive work off the input's critical path
  (update UI first, compute after paint).
- Ship less JS (see budgets) — hydration and framework overhead are common INP culprits;
  code-split and defer non-critical bundles.
- Use CSS for what CSS can do (`:hover`, `content-visibility`, accordions) instead of JS.

## Step 3 — Hold a budget

Set explicit budgets and fail CI when they're exceeded (`lighthouserc` assertions or a bundle-size
gate). Sensible mobile starting points — tighten per project:

- **JavaScript:** ≤ ~170 KB gzipped on the critical path; code-split the rest.
- **Total initial transfer:** ≤ ~1 MB; hero image ≤ ~150 KB (AVIF/WebP).
- **Fonts:** ≤ 2 weights above the fold, self-hosted, subset to the glyphs used.
- **Third parties:** each one is a liability — `async`/`defer`, lazy-load on interaction, and
  question whether it's needed. Third-party scripts are the most common cause of both poor INP
  and surprise CLS.
- **Requests:** avoid long dependency chains; preconnect to required origins only.

## Standing rules

- Optimize for **mobile + throttled CPU/network**; that's where the 75th percentile lives.
- **One change at a time, re-measure.** Attribute every win to a specific change.
- Don't lazy-load or defer above-the-fold content; do lazy-load below-the-fold images/iframes
  (`loading="lazy"`) and offscreen work (`content-visibility: auto`).
- Cache aggressively with correct headers (immutable hashed assets, revalidated HTML).
- Performance and accessibility reinforce each other — reserving layout space, not blocking
  input, and less JS all help both. Coordinate with the `ui-ux-design` section (reduced-motion,
  compositor-only animation) rather than fighting it.

## Related

- `web-dolle-mcp.md` — design workflow driven by the Dolle-MCP server (its motion rules —
  `transform`/`opacity`, reduced-motion — are the same ones that protect CLS/INP here).
- `web-vitals` library and Chrome UX Report / PageSpeed Insights for field data.
</content>

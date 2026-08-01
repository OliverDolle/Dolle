---
name: data-visualization
description: >-
  The craft of turning data into charts and dashboards people read at a glance — chart-type
  selection by the question asked, dashboard layout & hierarchy, categorical/sequential/diverging
  color, declarative titles & direct labeling, honest non-deceptive scales, chart states, and
  accessible/responsive charts. Load when building any chart, KPI tile, or dashboard; pairs with
  design-systems color tokens. Triggers: 'data visualization', 'dashboard', 'chart', 'chart type',
  'kpi', 'graph', 'analytics', 'chartjunk'.
---

# Data visualization (the craft)

A chart is an **argument made in pixels** — its job is to answer one question faster than a table
could. This section is the craft of getting the answer across at a glance: picking the mark from
the question, laying out a dashboard so the eye lands on the point, coloring data honestly, and
never lying with an axis. It is tool-agnostic (D3, Recharts, Vega, matplotlib, a BI tool, or the
Dolle-MCP chart templates) and goes *deeper* than `fundamentals` on the one thing charts add:
encoding quantity in position, length, and hue.

The neighbors own the rest. `fundamentals` owns hierarchy, type, states, and accessibility in
general; `design-systems` owns the color *tokens* you resolve chart colors from. Don't re-derive
those here — **resolve, don't invent.**

## 0 — Pick the chart from the question, not the data

Decide *what question the reader is asking* first; the question names the mark. Do not start from
"what chart looks nice" — start from the sentence the chart must let someone finish.

| The question is about… | Reader wants to… | Use | Avoid |
| --- | --- | --- | --- |
| **Comparison** (A vs B vs C) | Rank / compare magnitudes | Bar (horizontal if labels are long or >7 categories) | Pie for comparison |
| **Trend** (change over time) | See direction & rate | Line; area only when the total is the point | Bar for a long time series |
| **Part-to-whole** | Read shares of a total | Stacked bar, or a single 100% bar; pie **only** for 2–3 slices | Pie/donut with many slices |
| **Distribution** | See spread, shape, outliers | Histogram, box plot, or beeswarm | A single mean with no spread |
| **Relationship** (X vs Y) | See correlation / clusters | Scatter (add trend line); bubble for a 3rd dim | Dual-axis line (misleads) |
| **Geographic** | Read a value by place | Choropleth (rates, not counts) or symbol map | Map when a bar would rank better |
| **Flow / breakdown** | Trace a process or funnel | Sankey, funnel, waterfall | Stacked bar for sequential flow |

- **Table vs chart.** A chart shows a *shape* (trend, comparison, outlier); a **table** is right for
  precise lookup, mixed units, or ≤ ~5 numbers people need to read exactly. When in doubt and the
  reader will look up specific values, ship a table with the numbers right-aligned and tabular figures.
- **The single-number KPI.** One metric = a big **number**, not a chart. Show value, unit, the
  comparison that makes it mean something (vs target / prior period, as **Δ + direction, colored and
  labeled**), and a sparkline for context. A number with no baseline answers nothing.
- **Bars start at zero — always.** Bar length *is* the value, so a truncated baseline lies. Lines may
  use a non-zero axis (they encode position, not length) — but label it (§4).
- **Fewer, better charts.** Two charts that each answer a question beat six that decorate one. If a
  chart doesn't change a decision, cut it.

## 1 — Dashboard layout & hierarchy

A dashboard is not a chart dump — it's a **screen that answers one job** for one audience. Design it
as an inverted pyramid: the headline answer on top, the supporting detail below.

- **One decision per view.** Name the audience and the decision the dashboard exists to support
  (exec "are we on track?" vs analyst "why did it drop?"). If two audiences need two things, that's
  two dashboards.
- **KPI row → detail.** Top band: the 3–5 headline numbers with their deltas. Middle: the trend and
  comparison charts that explain them. Bottom: the granular table for the person who needs the row.
  The eye reads top-left first (§1 of `fundamentals`) — put the most important tile there.
- **Group by question, with headings and whitespace** — not one undifferentiated grid. Whitespace is
  the grouping; don't box every chart. Align to a grid so edges line up.
- **Never ship a blank canvas.** The default view must tell the story on its own; filters and
  drill-down are for *deeper* self-service, not a prerequisite to reading it.
- **Consistent chart chrome** across the board: same fonts, same color meaning, same date format,
  same number precision. A dashboard where "blue" means a different thing in two tiles is broken.

## 2 — Declarative titles & direct labeling

The words on a chart carry as much meaning as the marks. Make them do work.

- **Titles state the finding, not the fields.** "Revenue fell 12% after the March price change," not
  "Revenue by month." A declarative title tells the reader what to see; a descriptive one makes them
  work it out. Keep a short descriptive subtitle if the finding needs the *what* spelled out.
- **Label directly; kill the legend when you can.** Put the series name at the **end of its line** or
  on its bar instead of in a separate legend the eye must round-trip to. A legend is a lookup tax —
  reserve it for when direct labels would collide.
- **Units and context, once and unmistakably.** State the unit ($, %, ms, k/M) in the axis or title,
  not on every tick. Say the timeframe and any filter ("Q1 2026, US only") so the number can't be
  misread. Format numbers for humans (`$1.2M`, `12%`), right-align, tabular figures.
- **Annotate the "why."** A callout on the spike ("outage") or a target line turns a chart into an
  explanation. Annotation is the cheapest way to make a chart self-explaining.

## 3 — Color for data

Chart color is **encoding**, not decoration — it means something, so spend it precisely and resolve
values from the design-system tokens (`design-systems` §2), never hand-picked hex.

- **Categorical (qualitative)** — distinct hues for unordered groups. Cap at **~6**; beyond that,
  hues stop being distinguishable — group the tail into "Other," use direct labels, or switch to
  small multiples. Order and meaning must be stable across every chart on the page.
- **Sequential** — one hue, light→dark, for ordered/continuous magnitude (heatmap, choropleth).
  Prefer a **perceptually uniform** ramp (Viridis / Blues / Greens) so equal value steps look equal.
- **Diverging** — two hues meeting at a neutral midpoint, for data with a meaningful center (±, above/
  below target). Use a blue↔red (or blue↔orange) ramp through light grey; anchor the midpoint at the
  true zero/target, not the data mean.
- **Semantic status** reuses the system's `success`/`warning`/`danger`/`info` roles so green/red mean
  the same as everywhere else — don't spend a categorical hue on a status.
- **Colorblind-safe by default** (~8% of men have CVD): prefer CVD-safe ramps (Viridis, Cividis, or a
  ColorBrewer safe set), and **never rely on color alone** — pair with direct labels, patterns,
  shapes, or dashed/solid lines. Red-vs-green as the *only* signal fails for the most common CVD.
- **Grey is a color.** Mute everything that isn't the point and let one accent carry the finding —
  the same 60/30/10 restraint as `fundamentals` §4. Check every text-on-fill pair for AA contrast.

## 4 — Reduce ink, no chartjunk

Every pixel that isn't data or a label is a candidate for deletion. Maximize the share of ink that
encodes information.

- **No 3D, ever.** 3D bars/pies distort the very lengths and angles they're meant to encode. No drop
  shadows, bevels, gradients-for-decoration, or textured fills.
- **Honest axes.** Bars from zero (§0); consistent, linear scales unless a log scale is labeled and
  justified; don't invert an axis or cherry-pick a range to manufacture a trend. A dual y-axis can
  imply a correlation that isn't there — avoid it or make both scales explicit.
- **Strip the frame.** Drop heavy gridlines, chart borders, and tick marks to faint or gone; keep
  gridlines only where the reader must read a value off the axis, and then keep them light.
- **Fewer gridlines and ticks, rounded to human numbers** (0, 25, 50, 75, 100 — not 23.7). Sort bars
  by value (not alphabetically) unless the category has a natural order.
- **Data-ink test:** could you erase this and lose no information? Then erase it. Legends,
  redundant labels, and decorative imagery usually fail the test.

## 5 — Chart states & interaction

A chart is a data view, so it inherits the **four content states** (`fundamentals` §6) — design them,
don't assume the happy 3-point demo.

- **Empty / no-data / no-match.** Say *why* it's empty ("no sales in this range") and offer the fix
  (widen the filter). Distinguish "nothing yet" from "filtered to nothing." Never render axes around
  a void with no explanation.
- **Loading.** Skeleton the chart area at its final size so the layout doesn't jump; prefer a shaped
  placeholder over a bare spinner. Reserve the space (CLS — `web-performance`).
- **Error / partial / stale.** Say what failed with a **Retry**; flag partial or stale data
  explicitly ("through yesterday") rather than showing a wrong-looking chart as if it were complete.
- **Interaction earns its keep.** Add only what answers a follow-up question: **tooltips** (show the
  exact value + label on hover *and* keyboard focus), **filters** (reflect the active filter in the
  title), **cross-filter** (a click in one chart filters the rest — powerful, but show the selection
  and give a clear way to clear it), and **drill-down** (from summary to detail; keep a breadcrumb
  back). Don't hide the primary finding behind a hover — the default, static view must already read.

## 6 — Accessible & responsive charts

A chart that only works as a mouse-over picture excludes people and breaks on a phone. Build both in.

- **A table is the alternative text.** Every non-trivial chart needs its data reachable as a real
  (optionally visually-hidden) `<table>` or a download — this is the screen-reader path and doubles as
  the precise-lookup path. A one-line text summary of the finding helps everyone.
- **Don't encode by color alone** (§3) and clear **AA contrast** on text, labels, and against
  adjacent fills (`fundamentals` §4).
- **Keyboard & semantics.** Interactive elements (legend toggles, filters, data points with tooltips)
  are focusable in a logical order with visible focus; label the chart (`aria-label`/`role="img"` +
  description for a static chart, or an accessible name for an interactive one). SVG marks that carry
  meaning get accessible names; purely decorative ones are `aria-hidden`.
- **Responsive by reflow, not shrink.** Don't squeeze a 12-series line chart onto a phone — **reduce**
  (fewer series, aggregate to a coarser period), rotate a vertical bar to horizontal, or swap to a
  table. Let long category labels wrap or move to horizontal bars rather than rendering diagonally.
  Keep touch targets ≥ 44px and tooltips tap-dismissible.
- **Respect `prefers-reduced-motion`** on any load/transition animation — animate to reveal, never as
  a gate to reading (see `motion-and-interaction`). Don't animate axes on every filter change.

## Review checklist (run before calling a chart or dashboard done)

- [ ] Chart type is driven by the **question** (comparison/trend/part-to-whole/distribution/
      relationship/geo); a table used where lookup beats a picture.
- [ ] Bars start at zero; axes/scales are honest; no dual-axis correlation trap.
- [ ] Title states the **finding**; series are directly labeled; units, timeframe, and filters stated.
- [ ] Single-number KPIs show a labeled, colored delta vs a baseline — never a bare number.
- [ ] Color is by role: categorical ≤ ~6, perceptual sequential, centered diverging, semantic status —
      resolved from tokens, **CVD-safe**, never color alone. AA contrast on every pair.
- [ ] No 3D/decoration; low data-ink stripped; gridlines/ticks faint and human-rounded; bars sorted.
- [ ] Empty, loading, error/stale states designed; interaction (tooltip/filter/cross-filter/drill)
      shows selection and a way back — the static view already reads.
- [ ] Data reachable as a table/download; chart focusable and labeled for screen readers.
- [ ] Reflows (not shrinks) on mobile; motion behind `prefers-reduced-motion`; no layout jump on load.

## Related

- **`fundamentals` (sibling)** — the general craft charts inherit: hierarchy (§1), semantic color +
  WCAG contrast (§4), the four content states (§6), and accessibility (§11). This skill adds only
  what's specific to encoding data.
- **`design-systems` (sibling)** — resolve chart colors from the **color tokens/ramps** defined there
  (§2); categorical/sequential/diverging sets belong in the token layer so every chart matches.
- `devkit:web-performance` — reserving chart space (CLS) and compositor-only, reduced-motion chart
  transitions (INP) are governed by the same rules.
- `devkit:ui-ux-design` — build charts and dashboards on the **Dolle-MCP** server (chart/dashboard
  templates, curated palettes, `color_contrast`) and screenshot to self-critique.

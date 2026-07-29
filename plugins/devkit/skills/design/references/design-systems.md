# Design systems (the professional setup)

`fundamentals.md` gets *one* screen right. A design system is what makes that decision
**once and reusable** — so the tenth screen, the second engineer, and the dark theme all come out
consistent without anyone re-deciding. This reference is the *setup*: the token architecture, the
component library, the theming model, the governance, and the handoff that a professional stands
up before building at scale.

**When you actually need one.** A system is infrastructure, not decoration — it earns its cost
when the work is *repeated*: a product (not a one-off page), more than one designer or engineer, a
component reused across screens, or a foreseeable rebrand / dark mode / new platform. For a single
landing page, don't build a system — apply `fundamentals` and ship. **Grow the system out of real
components; never boil the ocean up front.** An unused token is a liability.

## 1 — Tokens: three tiers, one source of truth

A **design token** is a named design decision (`color.text.primary`, `space.4`,
`radius.md`) — not a raw value scattered through the code. Tokens are the atoms of the system;
everything else references them. Architect them in **three tiers**, each referencing the tier
below — this is the single most important structural choice:

```
1. PRIMITIVE (a.k.a. reference/global) — the raw, context-free palette & scales.
   color.blue.500 = #2f6fed   space.4 = 16px   font.size.400 = 1rem
   → Names describe WHAT IT IS. Never referenced directly by components.

2. SEMANTIC (a.k.a. alias/system) — decisions with meaning, mapped onto primitives.
   color.action.bg      → color.blue.500
   color.text.primary   → color.neutral.900   (light)  /  color.neutral.50 (dark)
   color.border.default → color.neutral.200
   → Names describe THE JOB. This tier is the theme contract — this is what themes swap.

3. COMPONENT (optional) — a component's own hooks, mapped onto semantics.
   button.primary.bg    → color.action.bg
   button.primary.bg-hover → color.action.bg-hover
   → Names describe WHERE. Add only when a component needs to vary independently.
```

Rules that make the tiers pay off:

- **Components consume semantic (or component) tokens only — never primitives.** A button that
  uses `color.blue.500` directly cannot be re-themed; one that uses `color.action.bg` re-themes
  for free. This single rule is what makes dark mode and rebrands a config change instead of a
  find-and-replace.
- **One source of truth**, machine-readable (a JSON/YAML token file or the
  [W3C DTCG](https://tr.designtokens.org/) format), from which *both* design tool and code are
  generated — see §7. Don't maintain the palette twice.
- **Name by role, not by look.** `color.text.danger`, not `color.text.red` — the value can change,
  the role shouldn't. A token named after its current value is a lie waiting to happen.
- **Pick a naming scheme and hold it:** `category.role.variant.state`
  (`color.action.bg-hover`, `space.inset.md`). Consistency here is what makes the system
  learnable.

## 2 — Build the scales into tokens (not one value at a time)

`fundamentals` says *use a scale*; the system's job is to **define each scale once as primitives**
so no one free-hands a value again.

- **Color ramps.** For each hue, generate a full **perceptual ramp** (e.g. 50→950) so you have
  tints and shades to map semantics onto; work in **OKLCH** for even lightness steps. Then map
  semantic roles (`bg`, `surface`, `text`, `text-muted`, `border`, `action`, `success`/`warning`/
  `danger`/`info`) onto ramp stops. **Bake contrast into the mapping:** every text-on-surface and
  control pair a theme produces must clear WCAG **AA** (4.5:1 text, 3:1 large/UI) — verify the
  pairs the *semantic* tier can produce, in every theme.
- **Type scale.** Families, a modular size ramp (1.2–1.25 ratio), weight tokens, line-height and
  measure tokens, and named **roles** (`display`, `heading`, `body`, `caption`). Prefer **fluid
  type** so the scale flexes without a breakpoint per size:
  `font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem)`.
- **Spacing & sizing.** One base scale (4/8-point) as `space.*` primitives; express component
  padding/gap as **inset/stack/inline** semantic spacing tokens on top.
- **The rest of the taxonomy** — don't stop at color/type/space. Tokenize **radii**, **border
  widths**, **elevation** (shadow ramp), **z-index** layers, **motion** (duration + easing tokens),
  **breakpoints**, and **opacity**. Anything a component hardcodes today is a token you're missing.

## 3 — Theming: a swap, not a rewrite

Because components read *semantic* tokens, a theme is just a **different mapping of semantic →
primitive**. Design the contract so themes are interchangeable:

- **Light/dark:** the same semantic names resolve to different ramp stops. In CSS, expose semantic
  tokens as custom properties and flip them under `:root` / `[data-theme="dark"]` (and honor
  `prefers-color-scheme`). Don't hardcode a hex per element — that's the trap dark mode exposes.
- **Multi-brand / white-label:** swap the *primitive* palette (or the primitive→semantic mapping);
  the component layer never changes.
- **Density / size modes** (comfortable vs compact) and **platform themes** are the same trick on
  the spacing/size tiers.
- **Keep the semantic contract stable.** Adding a role is cheap; renaming or removing one breaks
  every consumer. Treat the semantic token names as a public API — version and deprecate them,
  don't churn them (§6).

## 4 — The component library

Tokens make things *consistent*; a component library makes them *reusable*. One canonical,
accessible implementation of each component, consumed everywhere — **never re-styled or forked in
place.**

- **Separate variants from states.** *Variants* are intentional flavors chosen by the author
  (`primary` / `secondary` / `ghost`; `sm` / `md` / `lg`). *States* are runtime conditions
  (hover / focus / active / disabled / loading / error / selected — the set from `fundamentals`).
  A component's spec is the **matrix of variants × states**, all designed and all tokenized.
- **Build accessibility into the component, once.** Focus ring, ARIA roles/labels, keyboard
  behavior, and touch-target size live *in the component* so every use inherits them — that's the
  whole point of a shared build (see `fundamentals` §5/§11).
- **Compose, don't multiply.** Prefer slots/children and a few props over a new component per
  layout. A `Card` with a slot beats `CardWithImage`, `CardWithImageAndButton`, …
- **Tier the library:** primitives/atoms (Button, Input, Icon) → composites (Field = Label + Input
  + error) → patterns (a Form, a data Table) → page templates. Higher tiers compose lower ones.
- **One source of truth for the build too.** The component in the code and the component in the
  design tool must be the same thing (same name, same variants, same tokens) — divergence here is
  where design systems quietly die.

## 5 — Foundations & content, systematized

Beyond tokens and components, a mature system also owns the shared **foundations**: an icon set
(one grid, one stroke weight, consistent metaphors), an illustration/imagery style, an elevation/
layering model, a layout grid, and a **content/voice** layer — capitalization (sentence vs title
case), terminology, number/date formats, and the wording of empty/error/confirmation states. These
are decisions you make *once* for the brand; leaving them per-screen is how a product starts to
feel like several products.

## 6 — Governance: how a system survives contact with a team

A design system's failure mode is **drift** — people work around it faster than it grows, and it
rots into a museum. Governance is what prevents that:

- **Document every component** with its purpose, when *not* to use it, do/don't examples, props,
  and the tokens it consumes. An undocumented component won't be adopted correctly.
- **Version it** (semver): patch = fix, minor = additive/backward-compatible, major = breaking.
  **Deprecate, don't delete** — mark a token/component deprecated, provide the replacement and a
  codemod/migration note, then remove after a grace period.
- **Have a contribution model.** Decide who can add/change what, how a new pattern gets promoted
  from a one-off into the system, and where the backlog lives. A system with no intake either
  ossifies or forks.
- **Track adoption.** Coverage (% of UI using system components/tokens) and off-system usage
  (hardcoded values, one-off overrides) tell you whether it's actually working.
- **Prune.** Kill unused tokens and components. Fewer, well-understood pieces beat a sprawling
  catalog no one trusts.

## 7 — The design-to-dev handoff: tokens are the contract

The classic handoff (redline specs, "pixel-perfect" copies of pixel values into CSS) is obsolete
when **the same token source feeds both sides**:

- Keep tokens in a **single machine-readable source** and *transform* it to every target — CSS
  custom properties, Sass/JS, iOS/Android, and the design tool — with a build step
  (**Style Dictionary**, the DTCG format, or a Figma-variables sync). Designer and engineer
  reference the *same names*.
- **Names carry meaning across the boundary.** When the mock says `color.action.bg` and the code
  says `var(--color-action-bg)`, there's nothing to eyeball — the handoff is a lookup, not a
  measurement.
- Pair it with a **living component catalog** (Storybook or equivalent) that renders the real,
  code components with their variants/states and docs — so "what does the system have?" is
  answered by running code, not a stale library file.
- **Guard it in CI:** lint for hardcoded values that should be tokens, run **visual-regression**
  tests on the catalog, and check contrast on the token pairs. The system is only real if the
  pipeline enforces it.

## 8 — Pragmatics (don't over-engineer)

- **Adopt before you invent.** If a mature system fits (Material, a component library, or the
  Dolle-MCP template set for the web), theme *that* via tokens rather than build from zero.
- **Start with what you'll reuse in the next month**, not a hypothetical full catalog. Two tiers
  of tokens and five components you actually use beat a 300-token spec no one references.
- **Let real screens pull components into the system** — build the button when the second screen
  needs it, not before.
- **The three-tier token split is the one thing worth doing early**, even small — it's what makes
  everything later (dark mode, rebrand, handoff) cheap. The rest can grow.

## Review checklist (before calling a design system done — or reviewing one)

- [ ] Tokens exist in a single machine-readable source, split **primitive → semantic → component**.
- [ ] Components/screens reference **semantic** tokens only — no primitive or raw values in the UI.
- [ ] Every scale is a token set (color ramps, type, spacing, **radii, elevation, z-index, motion,
      breakpoints, opacity**) — nothing routinely hardcoded.
- [ ] Theming is a semantic-mapping swap: light **and** dark defined, contract names stable; AA
      contrast holds on every pair each theme can produce.
- [ ] Each component has a variants × states matrix, one canonical accessible build, and composes
      rather than multiplies.
- [ ] Foundations (icons, grid, elevation) and content/voice rules are decided once, not per-screen.
- [ ] Components are documented (purpose, when-not-to, tokens used) and versioned with a deprecation
      path; adoption/off-system usage is visible.
- [ ] One token source transforms to both design tool and code; a living catalog renders the real
      components; CI lints hardcoded values, visual-regresses, and checks contrast.
- [ ] Scope matches need — no unused tokens/components; the system grew from real work.

## Related

- **`fundamentals.md` (sibling reference)** — the per-screen craft this one makes repeatable.
  Get one screen right there first; the system just stops you from re-deciding on the next screen.
- `frontend-design:frontend-design` — aesthetic *direction*; a system encodes a direction into
  tokens, it doesn't choose one. Decide the feel there, then tokenize it here.
- `web-dolle-mcp.md` — on the web, the **Dolle-MCP** server is a ready component/token source:
  theme its templates via CSS custom properties and gate pairs through `color_contrast` instead of
  building a library from scratch.
- `desktop-native.md` — the same token/component thinking on native toolkits (Qt QSS variables,
  GTK CSS, platform theme APIs).
- `web-performance.md` — tokenizing motion/elevation is also where you enforce the
  compositor-only, reduced-motion rules that protect CLS/INP.

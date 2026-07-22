---
name: motion-and-interaction
description: >-
  The craft of motion and micro-interactions — what to animate and why, easing/duration intent,
  choreography and staggered reveals, state & page transitions, gesture/pointer feedback, and
  motion as a tokenized system. Every rule ships with prefers-reduced-motion. Load when designing
  transitions, micro-interactions, loading choreography, or a motion system. Triggers: 'animation',
  'motion', 'micro-interaction', 'transition', 'easing', 'page transition', 'hover effect', 'stagger'.
---

# Motion & interaction (the craft)

Good motion is **felt, not noticed** — it explains where things came from, confirms that an action
landed, and keeps the eye oriented across a change. This section goes deeper than `fundamentals` §8
on the one thing motion adds: *timing and continuity*. It is tool-agnostic (CSS transitions/
keyframes, the Web Animations API, Framer Motion, GSAP, or native toolkit animators) and every rule
here ends the same way it must in code: **paired with `prefers-reduced-motion`.**

The premise from `fundamentals` §8 holds throughout: motion has a job, it's fast, it animates
`transform`/`opacity` only, and it's gated. This skill is *how* to make it good, not permission to
add more of it.

## 0 — Motion has a job (never decoration)

Before animating anything, name the job. Motion earns its place only when it does one of these:

- **Orient** — show where a thing came from or went, so a change reads as a *move*, not a *replace*
  (a panel slides from the button that opened it; a deleted row collapses rather than vanishing).
- **Feedback** — confirm an action landed within ~100ms (press, toggle, submit), so the interface
  never feels dead or double-tapped.
- **Continuity** — carry the eye across a state or route change so the user doesn't re-orient from
  scratch (a shared element persists; layout shifts settle instead of teleporting).

If a proposed animation isn't doing one of those three, **cut it.** Looping, autoplaying, slow, or
attention-grabbing motion with no task is friction — it delays the content and, done wrong, triggers
vestibular discomfort. The bar is "would removing it lose meaning?" If no, remove it.

## 1 — Duration & easing with intent

Timing is the whole craft. Too slow feels sluggish; linear feels robotic; the wrong curve feels
wrong even when users can't say why. Tier your durations and pick curves by *what the motion is
doing*.

| Tier | Range | Use for |
| --- | --- | --- |
| **Instant** | ≤100ms | Hover, press, small toggles — must feel immediate |
| **Fast** | 100–200ms | Most micro-interactions, small enter/exit |
| **Base** | 200–300ms | Panels, dropdowns, modals, cards moving |
| **Slow** | 300–500ms | Full-screen / route transitions, large travel |

- **Ease-out on enter, ease-in on exit.** Things arriving decelerate into place (fast start, soft
  landing — feels responsive); things leaving accelerate away. **ease-in-out** for moves that both
  start and end on-screen. Never `linear` for UI (only for continuous things like spinners/marquees).
- **Real curves, not the defaults.** CSS `ease` is bland; author a `cubic-bezier` with intent (a
  standard decelerate like `cubic-bezier(0.2, 0, 0, 1)`). Bigger travel wants slightly longer
  duration and a softer landing.
- **Spring physics for anything interactive/gestural.** Motion the user is *dragging* or flicking
  should be driven by physics (stiffness/damping/mass), not a fixed duration — it settles naturally
  and can be interrupted mid-flight. Keep damping high enough that UI springs *settle*, not bounce;
  save visible bounce for one playful moment, not every element.
- **Distance scales duration, within reason** — but cap it; nothing in a UI should take longer than
  ~500ms or it reads as lag.

## 2 — Micro-interaction anatomy

A micro-interaction is a single, contained moment — a toggle, a like, a copy button. Design its four
parts explicitly (trigger → feedback → loop → mode):

- **Trigger** — what starts it (user click/hover/focus, or a system event). Every interactive element
  needs distinct **hover**, **press/active**, and **focus** feedback (the state set from
  `fundamentals` §5) — motion makes those states legible, it doesn't replace them.
- **Feedback** — the immediate visible response. Press should give a small, instant depression/scale;
  a toggle should *travel* between states so the change is readable, not a hard cut.
- **Loop / ongoing** — what happens if the action takes time (the button shows progress in place —
  see §5) and whether anything repeats. Repeats are a red flag: most micro-interactions fire once.
- **Mode / end** — the resting state after it completes, and how it returns to default. The exit is
  part of the design; don't animate in and hard-cut out.

Keep them **subtle and fast** (Instant/Fast tier) — a micro-interaction that demands attention has
failed. The point is to make the UI feel *alive and responsive*, not to perform.

## 3 — Choreography

When more than one thing moves, sequence it — simultaneous motion everywhere is noise.

- **Stagger reveals** so a list/grid enters as a readable cascade, not a wall: a small delay per item
  (~30–60ms, e.g. 0 / 0.05 / 0.10s), capped so long lists don't crawl (stagger the first several,
  then reveal the rest together). Direction of the stagger should follow reading order.
- **Shared-element continuity.** When the same object exists before and after a change (a thumbnail
  that becomes a header, a card that expands to a page), animate it as *one element moving*, not a
  fade-out/fade-in of two. This is the single most effective way to keep the user oriented.
- **One orchestrated moment.** Like `fundamentals` §0's "spend boldness once" — pick **one** hero
  moment to choreograph (a page's entrance, the key state change) and keep everything else quiet.
  Competing animations fight for the eye and cancel out.
- **Overlap, don't queue serially.** Natural sequences overlap (the outgoing element is ~60% gone
  before the incoming settles); fully serial in-then-out feels slow.

## 4 — State & page/route transitions

Transitions between states and views are where continuity (§0) pays off — animate the *difference*,
not a blanket fade.

- **List add/remove/reorder.** New items fade+slide in; removed items collapse their space as they
  leave (don't let siblings teleport into the gap); reorders animate to their new position. Animating
  layout changes is what makes a list feel like objects, not a re-render.
- **Layout animation (FLIP).** When an element changes size/position because of a layout change,
  animate from its First to its Last position using transforms (the FLIP technique) so it *moves*
  instead of jumping — cheap on the compositor, no reflow per frame.
- **Page / route transitions** are the Slow tier: a brief, directional move that implies hierarchy
  (forward pushes in, back pops out). Keep them short and skippable — a transition the user waits
  through twice is too long. On the web, prefer the **View Transitions API** for shared-element and
  cross-document continuity; keep a non-animated fallback.
- **Never block interaction on a transition.** The destination must be usable immediately; motion
  decorates the arrival, it doesn't gate it.

## 5 — Loading choreography

Loading is a transition too — from unknown to known. Design it so content *arrives*, never lurches.

- **Skeleton, then reveal** for content areas: show a skeleton at the final layout's shape and size,
  then cross-fade to real content. This previews structure and cuts perceived wait (`fundamentals`
  §5/§6). Reserve the exact space so nothing shifts when data lands (CLS — `web-performance`).
- **No spinner-then-jump.** A spinner that's replaced by content of a different size causes a layout
  jump — the worst loading feel. Either skeleton the real shape, or keep the trigger's space stable.
- **Match wait to treatment.** Under ~1s, an inline state change is enough — don't flash a skeleton
  that appears and vanishes. Over ~1s, show determinate progress where possible; over ~10s, show what
  it's doing. Disable the trigger while in flight to prevent double-submit.
- **Optimistic UI** where the action almost always succeeds: show the result immediately, reconcile on
  response, and animate a graceful revert if it fails — so the common path feels instant.

## 6 — Motion as a system

Motion drifts into inconsistency faster than color does. Tokenize it so every animation in the
product shares a vocabulary (this is `design-systems` §2's motion tier, applied).

- **Duration, easing, and spring tokens → CSS vars.** `--motion-duration-fast: 150ms`,
  `--motion-ease-out: cubic-bezier(0.2,0,0,1)`, a spring preset (stiffness/damping). Components read
  the tokens; nobody hand-picks `237ms`. A named set of curves is what makes the product feel like
  one hand animated it.
- **Compositor-only.** Animate **`transform` and `opacity`** only — they run on the GPU with no
  layout/paint per frame (60fps, 16.7ms budget). Animating `width`, `height`, `top`, `left`,
  `margin`, or `box-shadow` thrashes layout and drops frames; use transforms (and a shadow *layer*
  you fade) instead. Promote a heavy animated layer with `will-change` sparingly, and remove it after.
- **The INP/CLS link.** Motion is a performance surface, not just an aesthetic one. Janky, main-thread
  animation hurts **INP**; content that jumps in on load hurts **CLS**. Reserve space (§5), keep
  animation off the main thread, and keep durations short — the craft rule and the Core Web Vitals
  rule are the same rule (`web-performance`).
- **Reduced-motion is a first-class mapping, not an afterthought.** Under
  `@media (prefers-reduced-motion: reduce)`, replace *movement* with an instant change or a plain
  opacity fade, drop parallax/auto-play/large travel entirely, and keep only motion that conveys
  essential meaning (and even then, minimal). Build it as the token layer's alternate mapping so it's
  automatic, and test the interface with it on — it must stay fully usable and legible.

## Review checklist (run before calling motion done)

- [ ] Every animation has a job — orient, feedback, or continuity; nothing decorative/looping/autoplay.
- [ ] Durations sit in the tiers (instant/fast/base/slow); nothing over ~500ms; ease-out enter,
      ease-in exit, real `cubic-bezier` (never `linear` for UI); springs for gesture.
- [ ] Micro-interactions are subtle, fast, and cover hover/press/**focus** plus the exit.
- [ ] Multi-element motion is choreographed (capped stagger, shared-element continuity, one hero
      moment, overlapping not serial).
- [ ] State/route changes animate the difference (list add/remove/reorder, FLIP layout); destination
      is usable immediately, transition is skippable.
- [ ] Loading uses skeleton-then-reveal at final size — no spinner-then-jump; trigger disabled in flight.
- [ ] Motion is tokenized (duration/easing/spring → CSS vars); animates **`transform`/`opacity` only**
      at 60fps; space reserved so nothing shifts (CLS); no main-thread jank (INP).
- [ ] `prefers-reduced-motion` is a real mapping — movement replaced by instant/fade, essential
      meaning preserved, tested with it on.

## Related

- **`fundamentals` §8 (sibling)** — the baseline motion rules this skill deepens (fast, eased,
  `transform`/`opacity`, gated); also §5/§6 for the states and skeletons motion animates between.
- **`design-systems` (sibling)** — put duration/easing/spring in the **motion tokens** (§2) and expose
  the reduced-motion alternate as part of the token contract, so every component animates consistently.
- `devkit:web-performance` — the CLS (reserve space) and INP (compositor-only, off the main thread)
  rules are the performance face of §5/§6 here; measure motion cost there.
- `devkit:ui-ux-design` — apply this motion on the **Dolle-MCP** template build, and screenshot/
  preview to check the choreography reads.

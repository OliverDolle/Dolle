---
name: extensible-architecture
description: >-
  Method for writing code that is easy to extend and adapt without rewrites — module boundaries,
  separation of concerns, dependency inversion, extension points/plugins, stable contracts, and
  safe incremental change. Load BEFORE designing a module's structure, adding a feature to rigid
  code, or planning for pluggability. Covers open-closed & dependency inversion in practice,
  hexagonal ports-and-adapters, package-by-feature, coupling/cohesion, refactoring toward seams,
  semantic-versioned contracts, and feature flags. Triggers: 'make this extensible', 'plugin
  architecture', 'decouple this', 'dependency injection', 'refactor toward seams', 'module
  boundaries', 'stable API/contract', 'open-closed'.
---

# Extensible Architecture (adapt without rewrites)

The measure of a design is **how cheaply it absorbs the next change you didn't foresee.** Rigid
code forces a rewrite for every new case; extensible code lets you *add* a case. Not a "clean code"
lecture — the spine is one property: extend and adapt without touching what already works.

## §0 The goal: adapt without rewrites

You can't predict *which* change comes next, so optimize for the *cost* of change, not a guessed
feature. Two forces are the whole game:

| Force | Want | Smell when wrong |
| --- | --- | --- |
| **Coupling** (how much one module must know about another) | **low** — talk through narrow, stable interfaces | change one file, ten unrelated files break |
| **Cohesion** (how related the things inside a module are) | **high** — one module, one reason to change | a "utils" grab-bag; changes for unrelated reasons land in one file |

Every technique below moves the same two dials: **coupling down, cohesion up.** If a change makes
one worse without buying the other, it's not an improvement. The concrete target: a new
requirement should be satisfiable by *adding* a module/implementation and *wiring* it, editing few
or zero existing files.

## §1 Module boundaries & separation of concerns

A boundary is a promise: "everything outside talks to me only through this surface." Draw
boundaries around **reasons to change**, not around technical layers.

- **Package-by-feature, not by-layer.** `checkout/`, `billing/`, `search/` — each owning its own
  handler, service, and data access — beats `controllers/`, `services/`, `repositories/` where one
  feature is smeared across every folder. By-feature keeps a change local; by-layer forces every
  feature to touch every layer directory.
- **One public entry per module**; keep internals private (unexported / `_name` / `internal/`).
  Consumers depend on the surface, never on internals, so you can rewrite internals freely.
- **Dependencies point one way.** No cycles between modules — a cycle means neither can change or
  be tested alone. Enforce with a linter (dependency-cruiser, import-linter, ArchUnit) so the rule
  survives contact with a deadline.
- **Separate the stable from the volatile.** Business rules change on a different clock than the
  database driver or the HTTP framework. Put them in different modules so a framework bump can't
  ripple into domain logic.

## §2 Dependency inversion & injection

**Dependency Inversion Principle:** high-level policy must not depend on low-level detail; both
depend on an abstraction the *high level* owns. Invert the arrow so the volatile thing (DB, queue,
clock) plugs into the stable thing (your logic), not the reverse.

**Injection** is how you deliver it: pass collaborators in; never `new` them deep inside.

```python
# depend on an abstraction the high level owns
class OrderRepo(Protocol):
    def save(self, order: Order) -> None: ...

class PlaceOrder:                      # high-level policy, knows only the port
    def __init__(self, repo: OrderRepo):   # injected, not constructed here
        self._repo = repo
    def handle(self, order): self._repo.save(order)

class PostgresOrderRepo:               # low-level detail, depends on the abstraction
    def save(self, order): ...         # swap for InMemoryOrderRepo in tests, DynamoOrderRepo later
```

- **Constructor injection** is the default — dependencies are explicit and the object is valid once
  built. Reserve setter/optional injection for genuinely optional collaborators.
- **Depend on the narrowest interface you actually use** (Interface Segregation): a consumer that
  only reads shouldn't depend on an interface that also writes.
- You rarely need a DI *framework*. Manual wiring in one composition point is simpler and traceable;
  reach for a container only when wiring becomes genuinely painful.

## §3 Open-closed in practice

**Open for extension, closed for modification:** add behavior by adding code, not by editing code
that already works and is already tested. The tell-tale of a violation is a growing
`switch`/`if-else` on a type or kind — every new kind edits that block and risks the old ones.

```typescript
// Closed: adding PayPal edits this function and re-risks card + wire paths.
function fee(kind: string, amt: number) {
  if (kind === "card") return amt * 0.029;
  if (kind === "wire") return 15;
  // ...every new method edits here
}

// Open: adding PayPal = add one class, register it. Nothing above changes.
interface FeePolicy { fee(amt: number): number; }
const registry: Record<string, FeePolicy> = {};
function feeFor(kind: string, amt: number) { return registry[kind].fee(amt); }
```

- Replace type-switches with **polymorphism / the Strategy pattern**: one implementation per case,
  selected by a map or registry (§5).
- Don't apply it everywhere — abstract a variation point only once a *second* real case appears (or
  is imminent). Speculative open-closed is just speculative generality (§9). The Rule of Three: two
  cases duplicate, three earns the abstraction.

## §4 Ports & adapters / hexagonal

Alistair Cockburn's **hexagonal architecture** (ports and adapters) keeps the core application
free of I/O. The core defines **ports** (interfaces in its own terms); the outside world plugs in
via **adapters**.

- **Driving side (left):** what calls the app — HTTP controller, CLI, test — drives an inbound port
  (a use-case interface).
- **Driven side (right):** what the app calls — DB, message bus, payment API — is a driven port
  implemented by an outbound adapter.
- **The dependency rule:** adapters depend on the core; the core depends on nothing external. All
  arrows point *inward*. The domain imports no framework, no ORM, no SDK.

Payoff: the same core runs behind REST today and gRPC tomorrow; the real DB in prod and an
in-memory fake in tests — by swapping adapters, not editing the core. If your domain file imports
your web framework, the hexagon is already broken. (Clean/Onion architectures are the same idea
with more rings.)

## §5 Extension points & plugin/registry design

An **extension point** is a place you deliberately leave open for code you haven't written yet.
Three mechanisms, cheapest first:

1. **Hooks / callbacks / events** — publish an event ("order.placed"); new features subscribe
   without the emitter knowing they exist. Best when extensions only *react*.
2. **Registry + self-registration** — plugins register a capability against a key; the host looks
   them up. Best when extensions *provide* a variant (the fee example, exporters, renderers).
3. **Discovery** — enumerate plugins at startup via entry points (Python `importlib.metadata`), a
   manifest scan, or a service loader — so dropping in a package adds a capability with no host
   edit.

```python
EXPORTERS: dict[str, type[Exporter]] = {}
def register(fmt):                          # decorator = self-registration
    def deco(cls): EXPORTERS[fmt] = cls; return cls
    return deco

@register("csv")
class CsvExporter(Exporter): ...            # a new format never edits the host
```

Design rules: give plugins a **narrow, versioned contract** (§6) and a **capability-discovery**
call so the host can ask "what can you do?" rather than hard-coding assumptions. Fail loudly on a
missing/duplicate key. Keep host→plugin the only dependency direction; plugins never reach back
into host internals.

## §6 Contracts & versioning

A boundary is only stable if its **contract** is stable. The contract is the interface *plus* the
behavior, error shapes, and data schema — not just the type signature.

- **Semantic Versioning** communicates change to consumers: `MAJOR.MINOR.PATCH`.

  | Bump | When | Consumer impact |
  | --- | --- | --- |
  | **MAJOR** | incompatible/breaking change | must update their code |
  | **MINOR** | new functionality, backward-compatible | safe to adopt |
  | **PATCH** | backward-compatible bug fix | safe, transparent |

  Removing a field, renaming, tightening validation, or changing an error type is **MAJOR**. Adding
  an *optional* field or a new endpoint is MINOR. Pre-1.0 (`0.y.z`) anything may break — get to 1.0
  before others depend on you.
- **Contract tests** pin the promise: a test suite the *consumer* owns runs against the provider so
  a breaking change fails CI on both sides (Pact-style, or a shared fixture).
- **Tolerant reader** (Postel's law): consumers ignore unknown fields and don't over-validate, so
  the provider can add fields without a MAJOR bump. This one habit converts many would-be breaking
  changes into additive ones.
- **Additive-first evolution:** add the new field/method alongside the old, migrate consumers, then
  deprecate (announce → grace period → remove at the next MAJOR). Never repurpose a field's meaning.

## §7 Refactoring toward seams

You rarely design extensibility on a blank page; you carve it into working code. Michael Feathers:
a **seam** is a place where you can change behavior without editing there — and legacy code is hard
precisely because it has none.

- **Sense & separate.** To get a class under test you need to *sense* (observe effects) and
  *separate* (get it running off its real dependencies). Introducing a seam does both: extract an
  interface for the hard collaborator, inject it, pass a fake in the test.
- **Characterization tests first.** Before changing untested code, pin current behavior with tests
  that document what it *does* (not what it should). They're your safety net while you carve seams.
- **Sprout / wrap** rather than edit-in-place: add the new behavior in a fresh method/class (a
  "sprout") and call it, instead of hacking the tangle.
- **Strangler-fig** (Martin Fowler) for large replacement: stand the new implementation beside the
  old, route a slice of traffic/calls through a façade to the new path, migrate slice by slice,
  delete the old once nothing routes to it. Incremental, reversible, never a big-bang rewrite.

## §8 Feature flags for safe extension

Flags let you merge and deploy an extension **dark**, then turn it on independently of release —
decoupling deploy from launch. Match the flag's lifetime and audience to its category:

| Category | Purpose | Lifetime |
| --- | --- | --- |
| **Release toggle** | hide unfinished work in trunk | short — delete once shipped |
| **Ops toggle** | kill-switch / circuit breaker for a risky path | medium — some stay as controls |
| **Experiment** | A/B, percentage rollout | short — remove after the decision |
| **Permission** | gate by plan/entitlement/cohort | long-lived — it's a product feature |

- **Keystone the interface:** build behind the flag and only flip it on once the whole path is
  wired, so a half-built extension never shows.
- **Minimize the flag point.** Decide once, at the edge, and inject the chosen implementation
  (ties back to §2/§3) — don't sprinkle `if flag` through the codebase.
- **Retire toggles aggressively.** A stale flag is a hidden branch and a combinatorial test burden.
  Put an expiry/owner on every short-lived flag; the flag inventory is tech debt with a timer.

## §9 Anti-patterns

| Anti-pattern | What it looks like | Cost |
| --- | --- | --- |
| **Premature abstraction** | interface with one implementation, "just in case" | indirection with no payoff; the seam is usually wrong when the 2nd case arrives |
| **Speculative generality** | config, hooks, generics for imagined futures | dead flexibility you still must maintain and read around |
| **God module** | one class/file that knows everything (low cohesion, high coupling) | every change touches it; nothing testable in isolation |
| **Distributed monolith** | services split physically but coupled by shared DB / lockstep deploys | worst of both: network cost *and* rewrite-to-change |
| **Leaky abstraction** | port exposes DB/framework types (SQL, HTTP status) | swapping the adapter breaks the core anyway |

Through-line: abstraction has a carrying cost. Add a seam when a *real* second case pays for it —
and delete a seam that never earned its keep.

## §10 "Make-it-extensible" review checklist

- [ ] Can the next likely change be an **addition** (new class/module + wiring), not an edit to
      tested code? If not, where's the missing seam?
- [ ] Is there a **growing type-switch** that should be polymorphism/registry (§3)?
- [ ] Do high-level policies depend on **abstractions**, with details injected at the edge (§2)?
- [ ] Does the **domain/core import any framework, ORM, or SDK**? It shouldn't (§4).
- [ ] Are modules **package-by-feature** with one public surface and **no dependency cycles** (§1)?
- [ ] Do extension points have a **narrow, versioned contract** and capability discovery (§5, §6)?
- [ ] Is every public contract change classified **MAJOR/MINOR/PATCH** and covered by a contract
      test (§6)?
- [ ] Before changing legacy code, are there **characterization tests** and a plan to carve seams
      or strangle incrementally (§7)?
- [ ] Does each **feature flag** have a category, an owner, and an expiry (§8)?
- [ ] Is any abstraction here **speculative** — one implementation, imagined future? Cut it (§9).

## Related

- `devkit:agent-development` — workflow-design section: the same coupling/cohesion and
  ports-and-adapters thinking applied to agent/graph nodes and tool boundaries.
- `devkit:app-prompt` — settle the feature axes and MVP scope first; a clear spec is what lets you
  place module boundaries around real reasons to change rather than guesses.
- `devkit:subagents` — decomposing a large extensibility refactor (explore → plan → carve seams →
  verify) across subagents instead of one context.

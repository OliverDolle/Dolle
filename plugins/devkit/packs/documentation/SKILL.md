---
name: documentation
description: Method for documenting a project so it is easy to navigate — a short README hub whose index is auto-generated from each doc's description frontmatter, one doc per major section, and a code map of where large subsystems live. Load when creating or updating project documentation.
---

# Documentation Method

The goal is **navigability**. A reader understands what the project is in seconds from the
README, then reaches any detail in one click. Achieve this with a deliberate split, and make
the index maintain itself:

- The **README is a hub, not a manual.** It says what the project is, how to start, and links
  to everything else.
- **Details live in `docs/`,** one file per major section of the program.
- Each doc carries a **`description`** in its frontmatter (2-3 sentences). The README's
  documentation index is **generated automatically** from those descriptions — you never
  hand-write it.
- One doc is a **code map**: where the large parts of the codebase live.

## The rules

1. **README stays short.** State what the project is in ~1 short paragraph, add a minimal
   quickstart, then link out via the generated index.
2. **One doc per section.** Split along the program's real seams (subsystems, layers,
   features), not arbitrarily. Each `docs/<section>.md` is self-contained.
3. **Every doc has a `description` frontmatter of 2-3 sentences.** This is the single source of
   truth for what the doc covers; the README index is built from it.
4. **The README index is generated, not edited.** It lives between marker comments and is
   rewritten by a script (run by a GitHub Action). Never edit between the markers by hand.
5. **Include a code map.** A `docs/code-map.md` states where major subsystems live in the repo.
6. **Cross-link, don't duplicate.** State a fact in exactly one doc; link to it elsewhere.

## Doc frontmatter (the description contract)

Every file in `docs/` starts with YAML frontmatter. `description` is required and must be 2-3
sentences — it is pasted verbatim into the README index:

```markdown
---
title: Configuration
description: >-
  Every configuration setting, its default, and when you'd change it. Covers environment
  variables, the config file format, and precedence rules. Read this before deploying.
order: 20        # optional integer; lower sorts first in the index
---

# Configuration
...
```

Keep the description self-contained (it's read out of context in the index) and free of raw
`|` characters (they're escaped for you, but avoid relying on it).

## The auto-generated README index

The README contains a generated region:

```markdown
## Documentation

<!-- DOC-INDEX:START -->
<!-- DOC-INDEX:END -->
```

A script scans `docs/`, reads each `description`, and rewrites the table between the markers:
one row per doc, `| [Title](path) | description |`, sorted by `order` then title. A GitHub
Action runs it automatically so the index is never stale.

### Setting up the automation

Two ways to wire up the GitHub Action; both regenerate the index on push.

**Option A — reference the reusable workflow (recommended when you control several repos).**
The repo keeps no generator script. Copy
`${CLAUDE_PLUGIN_ROOT}/packs/documentation/assets/docs-index.caller.yml` to
`<repo>/.github/workflows/docs-index.yml`. It calls the reusable workflow in devkit
(`OliverDolle/Dolle/.github/workflows/docs-index.reusable.yml@main`), which fetches the
generator at run time. Pin `@main` to a tag/SHA for stability. Regenerate locally with
`npx github:OliverDolle/Dolle` from the repo root.

**Option B — copy the script + Action in (self-contained / portable).**
For a repo that must not depend on the devkit repo. Copy:
- `${CLAUDE_PLUGIN_ROOT}/packs/documentation/assets/generate-doc-index.mjs` → `<repo>/scripts/`
- `${CLAUDE_PLUGIN_ROOT}/packs/documentation/assets/docs-index.yml` → `<repo>/.github/workflows/`

Regenerate locally with `node scripts/generate-doc-index.mjs` (`--check` in CI to fail when out
of date).

Either way, the README needs the DOC-INDEX markers and each doc a `description`. The devkit repo
itself uses Option B as a live reference and hosts the reusable workflow at
`.github/workflows/docs-index.reusable.yml`.

## The code map

One doc — `docs/code-map.md` — answers "where do I find X in the code?" for the **large
entities** of the system. Point to directories/modules and describe their responsibility.

Cover big things, for example:
- Persistence / database writes (where data is read and written)
- API / routing layer (where requests enter)
- Auth / authorization
- Background jobs / queues / schedulers
- Domain/business logic core
- External integrations / clients
- Configuration and entry points (startup, CLI, main)

**Do not** map fine-grained details — a single parser, one helper function, where a specific
string is formatted. If it's not a subsystem a newcomer would go looking for, leave it out. The
code map is a directory of neighborhoods, not a street index.

## Process

1. **Refresh the README top:** the one-paragraph "what is this" and a minimal quickstart. Keep
   the generated `<!-- DOC-INDEX -->` region in place.
2. **Install the automation** (first time): copy the two assets above into the repo, and ensure
   the README has the index markers.
3. **Map the sections.** Identify the program's major parts; keep the list small and honest.
4. **Write/update the code map** (`docs/code-map.md`) — large subsystems and their locations.
5. **Write each `docs/<section>.md`** from the template, always including a 2-3 sentence
   `description`.
6. **Regenerate the index:** `node scripts/generate-doc-index.mjs` (or let the Action do it).
7. **Verify navigation:** from the README, can a newcomer reach each area in one hop and know
   what they'll find before clicking?

## README template

```markdown
# <Project Name>

<One short paragraph: what this project is and the problem it solves.>

## Quickstart

    <install>
    <run the smallest useful command>

## Documentation

<!-- DOC-INDEX:START -->
<!-- DOC-INDEX:END -->

## License

<if any>
```

## Per-section doc template

```markdown
---
title: <Section Name>
description: >-
  2-3 sentences on what this doc covers. This is what appears in the README index.
order: <n>
---

# <Section Name>

> One line: what this section is responsible for.

## Overview
<What it does and why it exists. 2-4 sentences.>

## Where it lives in the code
<The directories/modules for this section (link to the code map for the big picture).>

## Key concepts
<Terms, components, or files a reader must know.>

## How it works
<The flow, in the order things happen.>

## Usage / Examples
<The most common things a reader will actually do.>

## Gotchas
<Non-obvious constraints, edge cases, and footguns.>

## Related
<Links to the other docs this connects to.>
```

## Style

- Write for a newcomer who is competent but has never seen this project.
- Lead with the answer; put caveats after.
- Prefer short sections and concrete examples over prose.
- In the code map, reference directories/modules; elsewhere, reference `path:line` where a
  precise pointer helps.
- Match the existing docs' tone and formatting when extending.

## Maintenance

- When a subsystem changes materially, update its doc (and the code map if paths moved) in the
  same change.
- When you add or remove a doc, just set/adjust its `description`; the index regenerates —
  don't touch the markers' contents.
- Periodically re-read the index as a newcomer: is every description accurate, and is anything
  important missing an entry?

## Checklist

- [ ] README opens with a one-paragraph "what is this project" and a quickstart.
- [ ] README index lives between `DOC-INDEX` markers and is generated (not hand-edited).
- [ ] The doc-index Action is set up — the reusable caller workflow (Option A) or the copied
      script + Action (Option B).
- [ ] Every doc has a 2-3 sentence `description` in its frontmatter.
- [ ] A `docs/code-map.md` maps the large subsystems to their locations.
- [ ] The code map covers big entities only — no line-level detail.
- [ ] Facts live in one place; other docs link rather than repeat.
- [ ] No dead links; `node scripts/generate-doc-index.mjs --check` passes.

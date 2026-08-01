---
description: "Use when designing a module's structure, adding a feature to rigid code, or planning for pluggability — BEFORE shaping the code. Covers module boundaries & separation of concerns, dependency inversion, open-closed in practice, hexagonal ports-and-adapters, extension points/plugins, stable semantic-versioned contracts, refactoring toward seams, and feature flags. Triggers: 'make this extensible', 'plugin architecture', 'decouple this', 'dependency injection', 'refactor toward seams', 'module boundaries', 'stable API', 'open-closed'."
argument-hint: "[optional: the module/feature to make extensible]"
---

**A code-structure / extensibility task matches this command — load it before shaping the code;
do not improvise the architecture from memory.** Read the file
`${CLAUDE_PLUGIN_ROOT}/packs/extensible-architecture/SKILL.md` in full and follow it as the active
method for this work.

Then:
1. Confirm in one line that the **extensible-architecture** section is loaded.
2. Summarize the method in 3–5 bullets: measure by coupling↓/cohesion↑; depend on abstractions
   (dependency inversion) and wire at the edge; extend via new implementations, not edits
   (open-closed); keep the core free of I/O behind ports & adapters; evolve behind stable
   semantic-versioned contracts and retire feature flags promptly.
3. If the user described a module or feature below, start there — locate the current seams and
   boundaries before proposing a structure.

User task (optional): $ARGUMENTS

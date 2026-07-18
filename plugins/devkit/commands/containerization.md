---
description: Load the containerization skill — Docker & Compose done right (multi-stage builds, small non-root images, layer caching, Compose stacks, and a size/security checklist).
argument-hint: "[optional: what you're containerizing, or a Dockerfile/compose issue]"
---

Read the file `${CLAUDE_PLUGIN_ROOT}/packs/containerization/SKILL.md` in full and adopt it as
active guidance for the rest of this session.

Then:
1. Confirm in one line that the **containerization** section is loaded.
2. Summarize the method in 3–5 bullets: multi-stage build (ship the artifact, not the toolchain);
   small pinned base + non-root user + exec-form entrypoint + HEALTHCHECK + `.dockerignore`; order
   layers cheap→volatile so the cache survives code edits; secrets at runtime/BuildKit, never in
   `ENV`/`ARG`/layers; Compose for local multi-service dev, Kubernetes for prod; verify size + scan
   for CVEs.
3. If the user described what they're containerizing (or a build/run problem) below, start there —
   inspect the existing Dockerfile/compose if present before proposing changes.

User task (optional): $ARGUMENTS

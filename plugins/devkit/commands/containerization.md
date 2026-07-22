---
description: "Use when writing or fixing a Dockerfile or Compose stack, or shrinking/securing an image — BEFORE hand-writing container config. Covers multi-stage builds, small non-root images, layer-cache ordering, .dockerignore, healthchecks, and a size/security checklist. Triggers: 'write a Dockerfile', 'dockerize this', 'docker compose', 'image too big', 'containerize the app'."
argument-hint: "[optional: what you're containerizing, or a Dockerfile/compose issue]"
---

**A Dockerfile / Compose / container-image request matches this command — load it before writing
container config; do not hand-write it from memory.** Read the file
`${CLAUDE_PLUGIN_ROOT}/packs/containerization/SKILL.md` in full and follow it as the active method
for this work.

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

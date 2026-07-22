---
description: "Use when authoring a production CI/CD pipeline on GitHub Actions or Azure DevOps — BEFORE hand-writing workflow YAML. Two skills: github-actions and azure-devops. Covers OIDC/workload-identity keyless auth, least-privilege, environments & approvals, deployment strategies, reuse (reusable workflows/templates), speed (matrix/cache), and supply-chain hardening (SHA-pinning, attestation). Triggers: 'github actions workflow', 'azure pipelines', 'azure devops', 'reusable workflow', 'service connection', 'deployment environment', 'pin actions'."
argument-hint: "[optional task, or a skill: github-actions | azure-devops]"
---

**A CI/CD pipeline-authoring task matches this command — load it before writing workflow YAML;
do not hand-write it from memory.** First read the section index at
`${CLAUDE_PLUGIN_ROOT}/packs/deployment-pipelines/INDEX.md`, then read the platform skill the task
needs:

- `github-actions/SKILL.md` — `.github/workflows`, reusable workflows/composite actions, OIDC to
  cloud, environments & required reviewers, matrix/cache/concurrency, least-privilege
  `GITHUB_TOKEN`, SHA-pinning, build attestation/SLSA, dependabot.
- `azure-devops/SKILL.md` — `azure-pipelines.yml`, multi-stage YAML, templates, deployment jobs &
  strategies, environments & approvals/checks, variable groups + Key Vault, workload-identity
  service connections.

Read `${CLAUDE_PLUGIN_ROOT}/packs/cloud-infrastructure/SKILL.md` first if you need the
vendor-neutral *why* (build-once, OIDC rationale, strategy tradeoffs) — this section is the
platform mechanics. A starter template lives at
`${CLAUDE_PLUGIN_ROOT}/packs/deployment-pipelines/templates/cicd-starters/` (copy via `/scaffold`).

Then:
1. Confirm in one line which skill(s) you loaded.
2. Summarize the method in 3–5 bullets.
3. If the user provided a task below, start on it — inspect any existing pipeline before changing it.

User task / focus (optional): $ARGUMENTS

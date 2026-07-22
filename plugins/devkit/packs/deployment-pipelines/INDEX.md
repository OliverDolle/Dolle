---
name: deployment-pipelines
description: Section index for production CI/CD pipelines on the two platforms most teams actually ship on — GitHub Actions and Azure DevOps Pipelines. The platform-specific field manuals (keyless OIDC auth, environments & gated approvals, deployment strategies, reuse, supply-chain hardening) plus a copy-ready scaffold. Read the platform you ship on; read cloud-infrastructure first for the vendor-neutral why.
---

# Deployment pipelines — section index

This section is the **platform-specific field manual** for CI/CD: concrete, current YAML for the
two systems most teams live in. It is the *mechanics* layer — how each platform actually spells
keyless cloud auth, gated environments, deployment strategies, and supply-chain hardening.

It deliberately does **not** re-explain the vendor-neutral *why* (build-once-promote, OIDC over
long-lived keys, plan-before-apply, rolling vs blue-green vs canary as concepts, observability).
That lives in `devkit:cloud-infrastructure` — **read it first**, then come here for the platform you
actually ship on.

## Skills in this section

| Skill | Read it for | File |
| --- | --- | --- |
| **GitHub Actions** | Writing `.github/workflows`, reusable workflows & composite actions, OIDC to a cloud, environments & required reviewers, matrix/cache/concurrency, least-privilege `GITHUB_TOKEN`, SHA-pinning, build attestation/SLSA, Dependabot. | `github-actions/SKILL.md` |
| **Azure DevOps** | Writing `azure-pipelines.yml`, multi-stage YAML & templates, `deployment` jobs with runOnce/rolling/canary strategies, environments + approvals/checks, variable groups linked to Key Vault, service connections with workload identity federation (OIDC). | `azure-devops/SKILL.md` |

Paths are relative to this section folder
(`${CLAUDE_PLUGIN_ROOT}/packs/deployment-pipelines/`).

There is also a scaffold under `templates/cicd-starters/` — a minimal, valid `deploy.yml` (GitHub
Actions) and `azure-pipelines.yml` (Azure DevOps), both keyless-OIDC with a gated prod stage, ready
to copy and fill in. See its `TEMPLATE.md` manifest for placeholders and after-copying steps.

## How to use this section

- **Read `devkit:cloud-infrastructure` first** for the platform-agnostic pipeline model, IaC, and
  the reasoning behind OIDC, build-once-promote, and gated prod. This section assumes it.
- **Then read the one platform you ship on** — `github-actions` *or* `azure-devops`. You almost
  never need both; the concepts map 1:1, only the YAML differs.
- **Starting from zero?** Copy `templates/cicd-starters/` for your platform and follow its
  `TEMPLATE.md`.
- **Deploying the built artifact to a runtime?** Pair with `devkit:containerization` (the image the
  pipeline builds/scans/pushes) and `devkit:kubernetes` (a common deploy target; GitOps is the
  K8s-native form of the deploy stage).

## Related

- `devkit:cloud-infrastructure` — the vendor-neutral pipeline/IaC/OIDC/observability concepts this
  section makes platform-concrete. Prerequisite reading.
- `devkit:containerization` — the OCI image these pipelines build, scan, push, and promote.
- `devkit:kubernetes` — a frequent deploy target for the deploy stage; safe rollouts and probes.

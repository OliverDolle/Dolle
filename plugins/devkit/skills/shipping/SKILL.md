---
name: shipping
description: Call before writing a Dockerfile, Kubernetes manifest, CI/CD pipeline, or Terraform — or when a build, deploy, or pod fails.
---

# Shipping — router

> Read only the reference(s) below that the task needs. Name which one in a line, then work from it.

| Reference | Read it when |
| --- | --- |
| `containerization` | Writing or fixing a Dockerfile or Compose stack; shrinking or securing an image; a broken build. |
| `kubernetes` | Writing or fixing manifests, config/secrets, probes, autoscaling — or a pod that won't run. |
| `kubernetes-gitops` | Rolling out on K8s safely — canary/blue-green (Argo Rollouts, Flagger), GitOps (Argo CD, Flux). |
| `cloud-infrastructure` | CI/CD concepts, Terraform/IaC, choosing a compute target, OIDC, observability. **Read before** the two below. |
| `github-actions` | Writing `.github/workflows` — OIDC, environments, reusable workflows, SHA-pinning. |
| `azure-devops` | Writing `azure-pipelines.yml` — templates, deployment jobs, service connections. |

Paths: `references/<name>.md`. They chain — image → cluster → pipeline. Read the one you're in; add
the next only when the task crosses that line. Pipeline starters: `/scaffold cicd-starters`.

**Binds regardless:** no secrets in an image, repo, or manifest — inject at runtime from a managed
store, and base64 in a K8s Secret is encoding, not encryption. No long-lived cloud keys in CI — use
short-lived OIDC federation.

---
name: shipping
description: >-
  Packaging and deploying an app — BEFORE hand-writing container config, Kubernetes manifests, a
  pipeline, or IaC. Docker & Compose, Kubernetes workloads, and CI/CD + Terraform on AWS/GCP/Azure.
  Triggers: 'write a Dockerfile', 'dockerize this', 'docker compose', 'image too big', 'deploy to
  kubernetes', 'k8s manifest', 'my pod is crashing', 'CrashLoopBackOff', 'set up an ingress', 'helm
  chart', 'set up CI/CD', 'github actions pipeline', 'write terraform', 'infrastructure as code',
  'deploy to cloud run', 'serverless'.
---

# Shipping — router

> Read only the reference(s) below that the task needs. Name which one in a line, then work from it.

| Reference | Read it when |
| --- | --- |
| `containerization` | Writing or fixing a Dockerfile or Compose stack; shrinking or securing an image; a broken build. |
| `kubernetes` | Deploying or configuring on K8s, or a pod that won't run. |
| `cloud-infrastructure` | A CI/CD pipeline, Terraform/IaC, choosing a cloud compute target, or observability. |

Paths: `references/<name>.md`. They chain — image → cluster → pipeline. Read the one you're in; add
the next only when the task crosses that line.

**Binds regardless:** no secrets in an image, repo, or manifest — inject at runtime from a managed
store, and base64 in a K8s Secret is encoding, not encryption. No long-lived cloud keys in CI — use
short-lived OIDC federation.

---
name: kubernetes
description: Section index for running services on Kubernetes. Two skills — workloads (defining/configuring the workload: Deployments/Services/Ingress, config/secrets, resources, probes, HPA, security context, Kustomize/Helm, pod debugging) and deployment-and-gitops (getting it deployed: the rollout loop, progressive delivery with Argo Rollouts/Flagger, and GitOps with Argo CD/Flux). Read workloads to define the app; add deployment-and-gitops for how it ships and rolls out.
---

# Kubernetes — section index

This section covers running services on Kubernetes in two stacked skills: **`workloads`** gets the
workload *defined and configured correctly*, and **`deployment-and-gitops`** gets it *deployed,
rolled out safely, and kept in sync with git*.

## Skills in this section

| Skill | Read it for | File |
| --- | --- | --- |
| **workloads** | Defining/configuring the workload — choosing the controller, a production-grade Deployment (resources, liveness/readiness/startup probes, non-root security context, digest-pinned image), config via ConfigMaps/Secrets, exposing with Services/Ingress/Gateway API, autoscaling (HPA) and availability (PDB, topology spread), packaging with Kustomize/Helm, and a pod-failure debug playbook. | `workloads/SKILL.md` |
| **deployment-and-gitops** | Getting it deployed as a workflow — the deploy loop (`apply`, `kubectl rollout status/undo`, image digest strategy), rollout strategy (RollingUpdate vs Recreate), progressive delivery (canary/blue-green via Argo Rollouts or Flagger with metric-gated promotion), GitOps (Argo CD / Flux: declarative, pull-based, drift-corrected), and multi-environment promotion. | `deployment-and-gitops/SKILL.md` |

Paths are relative to this section folder (`${CLAUDE_PLUGIN_ROOT}/packs/kubernetes/`).

## How to use this section

- **Writing or fixing a manifest, or a pod won't run:** read `workloads`.
- **Deciding how the app ships and rolls out** (canary/blue-green, GitOps, rollback): also read
  `deployment-and-gitops`.
- **Building the image first:** that's `devkit:containerization` (its non-root user, `HEALTHCHECK`,
  and `SIGTERM` handling are what these probes and rollouts depend on).
- **The surrounding CI/CD and platform:** `devkit:cloud-infrastructure` (vendor-neutral concepts)
  and `devkit:deployment-pipelines` (GitHub Actions / Azure DevOps that push to the cluster or drive
  GitOps).

## How the skills relate

**workloads** (define the workload) → **deployment-and-gitops** (ship & roll it out). GitOps
(deployment-and-gitops) reads the very manifests `workloads` produces as its declarative desired
state. `containerization` feeds the image in; `deployment-pipelines`/`cloud-infrastructure` wrap the
pipeline around it.

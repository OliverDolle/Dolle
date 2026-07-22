---
description: "Use when deploying or configuring a service on Kubernetes, or debugging a pod that won't run — BEFORE hand-writing manifests. Two skills: workloads (Deployments/Services/Ingress, config/secrets, resources, probes, autoscaling, Kustomize/Helm, pod debugging) and deployment-and-gitops (rollout loop, canary/blue-green via Argo Rollouts/Flagger, GitOps with Argo CD/Flux). Triggers: 'deploy to kubernetes', 'k8s manifest', 'my pod is crashing', 'set up an ingress', 'helm chart', 'gitops', 'argocd', 'canary on k8s'."
argument-hint: "[optional task, or a skill: workloads | deployment-and-gitops]"
---

**A Kubernetes deploy / config / pod-debug request matches this command — load it before writing
manifests; do not hand-write them from memory.** First read the section index at
`${CLAUDE_PLUGIN_ROOT}/packs/kubernetes/INDEX.md`, then read the skill(s) the task needs:

- `workloads/SKILL.md` — defining/configuring the workload: controller choice, a production-grade
  Deployment (resources, probes, non-root security context, digest-pinned image), ConfigMaps/Secrets,
  Services/Ingress/Gateway API, HPA/PDB, Kustomize/Helm, and the pod-failure debug playbook.
- `deployment-and-gitops/SKILL.md` — getting it deployed: the rollout loop (`apply`,
  `kubectl rollout status/undo`, image digests), RollingUpdate vs Recreate, progressive delivery
  (Argo Rollouts/Flagger canary & blue-green with metric gates), and GitOps (Argo CD / Flux).

Read `deployment-pipelines` / `cloud-infrastructure` for the surrounding CI/CD, and
`containerization` for the image the workload runs.

Then:
1. Confirm in one line which skill(s) you loaded.
2. Summarize the method in 3–5 bullets: pick the right controller (Deployment by default); set
   resource requests, distinct readiness/liveness/startup probes, non-root securityContext, and a
   digest-pinned image; safe rollouts (`maxUnavailable: 0`, PDB, `rollout undo`) and, for risky
   changes, metric-gated canary; secrets aren't encrypted by default (SOPS/Sealed/External Secrets);
   prefer declarative GitOps (Argo CD/Flux) over imperative `kubectl`.
3. If the user described a workload or a failing pod below, start there — read the reason
   (`kubectl describe` events / logs) before proposing manifest changes.

User task / focus (optional): $ARGUMENTS

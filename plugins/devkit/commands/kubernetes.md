---
description: "Use when deploying or configuring a service on Kubernetes, or debugging a pod that won't run — BEFORE hand-writing manifests. Covers Deployments/Services/Ingress, config/secrets, resource requests/limits, probes, autoscaling, safe rollouts, and Kustomize/Helm. Triggers: 'deploy to kubernetes', 'k8s manifest', 'my pod is crashing', 'set up an ingress', 'helm chart'."
argument-hint: "[optional: what you're deploying, or a pod/manifest problem]"
---

Read the file `${CLAUDE_PLUGIN_ROOT}/packs/kubernetes/SKILL.md` in full and adopt it as active
guidance for the rest of this session.

Then:
1. Confirm in one line that the **kubernetes** section is loaded.
2. Summarize the method in 3–5 bullets: pick the right controller (Deployment by default); every
   workload sets resource requests (memory request≈limit), distinct readiness+liveness+startup
   probes, non-root securityContext, image pinned by digest; liveness never depends on downstream
   deps; safe rollouts (`maxUnavailable: 0`, PDB, `rollout undo`); secrets aren't encrypted by
   default (SOPS/Sealed/External Secrets); one packaging tool (Kustomize *or* Helm) across
   environments.
3. If the user described a workload or a failing pod below, start there — read the reason
   (`kubectl describe` events / logs) before proposing manifest changes.

User task (optional): $ARGUMENTS

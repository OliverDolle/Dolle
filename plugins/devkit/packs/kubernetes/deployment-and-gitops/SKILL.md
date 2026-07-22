---
name: deployment-and-gitops
description: >-
  Use when deploying to Kubernetes as a workflow — the deploy loop (apply, kubectl rollout status/undo, image/tag/digest strategy), Deployment rollout strategy (RollingUpdate vs Recreate), progressive delivery (canary/blue-green with Argo Rollouts or Flagger, metric-gated promotion), GitOps (Argo CD / Flux: declarative, pull-based, drift-corrected, app-of-apps), and multi-environment promotion. Triggers: 'deploy to kubernetes', 'gitops', 'argocd', 'flux', 'argo rollouts', 'flagger', 'canary on k8s', 'kubectl rollout', 'progressive delivery'.
---

# Kubernetes delivery (deploy loop, progressive delivery & GitOps)

The `workloads` skill gets a *correct manifest* onto the cluster. This skill is the layer on top:
**how change reaches the cluster and how you keep it safe** — the deploy loop, controlling the
rollout, gating promotion on live metrics, and making git the source of truth instead of a laptop.
The maturity path is push → pull: imperative `kubectl` → CI that pushes → **GitOps** where the
cluster pulls its own desired state.

## §0 — Push vs pull delivery

| Model | How change lands | Where it breaks |
| --- | --- | --- |
| **Imperative** (`kubectl apply`/`set image` from a shell) | A human/laptop mutates live state | No audit trail, drifts instantly, unrepeatable, needs cluster creds handed out |
| **CI push** (pipeline runs `kubectl`/`helm` after build) | Pipeline holds cluster creds and pushes | Cluster credentials live in CI; cluster state ≠ any single git commit; drift is invisible |
| **GitOps pull** (agent in-cluster reconciles git → cluster) | Commit to git *is* the deploy; the cluster pulls | Requires an operator (Argo CD/Flux); the learning curve is the cost |

**Why GitOps.** Desired state is a git commit, so every change is reviewed, audited, and revertible
by `git revert`. The reconciler runs *inside* the cluster and pulls, so no external system holds
cluster credentials (smaller blast radius). It continuously compares live vs desired and **corrects
drift** — a hand-hacked `kubectl edit` gets reverted, not silently kept. Use imperative `kubectl`
for *dev/debug only*; use CI-push as a stepping stone; land on GitOps for anything shared.

## §1 — The deploy loop & rollout control

Even under GitOps you must understand the underlying loop the reconciler drives.

```
kubectl diff  -k overlays/prod          # preview: what will change vs live (run this first)
kubectl apply -k overlays/prod          # declarative apply (or: helm upgrade --install)
kubectl rollout status deploy/api       # BLOCKS until new ReplicaSet is healthy or times out
kubectl rollout undo   deploy/api        # roll back to previous ReplicaSet (add --to-revision=N)
kubectl rollout history deploy/api       # revisions available to undo to
```

- `rollout status` is the gate — in CI, a non-zero exit means the deploy failed; don't fire-and-forget.
- Prefer `kubectl apply` (declarative, diffable) over `kubectl set image` (imperative — fast for a
  hotfix but the change isn't in git and will be reverted by GitOps drift-correction).

**Rollout strategy** on the Deployment governs *how pods are replaced*:

| Strategy | Behavior | Use when |
| --- | --- | --- |
| **RollingUpdate** (default) | Incrementally replaces old pods with new, bounded by `maxSurge`/`maxUnavailable` | Stateless services — the normal case |
| **Recreate** | Kills all old pods, then starts new | Incompatible schema/versions can't run concurrently; brief downtime is acceptable |

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0    # never drop below desired capacity during the roll
    maxSurge: 1          # add at most one extra pod at a time (needs headroom for +1)
```

- `maxUnavailable: 0` + `maxSurge: 1` = zero-downtime at the cost of temporary +1 capacity.
  Larger `maxSurge` (e.g. `25%`) rolls faster if you have the room.
- A correct **readinessProbe** is what makes RollingUpdate safe — a pod joins the Service only when
  ready, so traffic never hits a booting replica. (Probe details live in the `workloads` skill.)

**Image identity — pin by digest, never `:latest`.** A tag is mutable; `:latest` (or any reused
tag) means "what the manifest deploys" changes under you, breaks rollback, and defeats GitOps (the
git SHA no longer determines what runs). Deploy an immutable reference:

- Best: **content digest** — `registry/api@sha256:…`. Byte-identical, reproducible, cache-safe.
- Acceptable: an **immutable, unique tag** per build (git SHA / semver / build number), never
  reused. Set repo tag-immutability so a tag can't be overwritten.
- The build produces the digest; the deploy step (or a promotion PR) writes that digest into the
  manifest.

## §2 — Progressive delivery (canary & blue-green)

A rolling update shifts *all* traffic once pods are Ready — it can't tell a healthy pod from one
serving 500s. **Progressive delivery** shifts traffic in steps and **gates promotion on live
metrics**, rolling back automatically when they regress. Two controllers dominate; verify current
feature support before choosing.

| | **Argo Rollouts** | **Flagger** |
| --- | --- | --- |
| Workload | Replaces `Deployment` with a `Rollout` CRD | Keeps standard `Deployment`; wraps it in a `Canary` CR |
| Control model | Explicit, step-based (`setWeight`/`pause`), optional manual approval gates | Automatic, metric-driven promotion with minimal manifest change |
| Traffic shaping | Ingress/mesh/SMI or replica-count | Service mesh / ingress (Linkerd, Istio, NGINX, …) |
| Fits | Greenfield, especially alongside **Argo CD**; you want hands-on step control | **Flux** shops, or "zero-touch" fully automated promotion |

**Strategies.** *Canary* — route a small slice (5% → 25% → 50% → 100%) to the new version, watch
metrics at each step, promote or abort. *Blue-green* — bring the new version up fully in parallel,
smoke-test it, then flip 100% of traffic at once (instant rollback = flip back).

**Analysis / metric gates.** Define an analysis that queries your metrics backend (Prometheus,
Datadog, etc.) between steps. Gate on **both success rate AND latency** — error-rate alone misses
performance regressions. If a metric breaches its threshold, the controller **halts and rolls back
automatically**; no page, no human. Require the canary to pass several consecutive analysis windows
before full promotion so a lucky sample can't promote a bad build.

```yaml
# Argo Rollouts — canary skeleton (analysis template referenced, not shown)
strategy:
  canary:
    steps:
      - setWeight: 20
      - pause: { duration: 5m }        # window for analysis to observe
      - analysis: { templates: [{ templateName: success-rate-and-latency }] }
      - setWeight: 50
      - pause: { duration: 5m }
      # implicit final promotion to 100% once steps pass
```

Progressive delivery composes with GitOps: Argo CD manages the `Rollout`/`Canary` object; the
controller runs the analysis. Keep them separate — GitOps owns *desired state*, the rollout
controller owns *how traffic gets there*.

## §3 — GitOps (Argo CD / Flux)

Principle: **declarative desired state lives in git; an in-cluster operator continuously pulls and
reconciles it.** The four tenets — declarative, versioned/immutable (git), pulled automatically,
continuously reconciled.

| | **Argo CD** | **Flux** |
| --- | --- | --- |
| Shape | App-centric; first-class `Application` CRD; built-in **UI**, RBAC, SSO | Lightweight, CLI/CRD-driven set of controllers; no bundled UI (use Weave GitOps/Capacitor) |
| Drift correction | Watch-backed live cache; near-real-time detect + `selfHeal: true` revert | Interval-based reconcile; `prune: true` + reconcile interval |
| Multi-app scale | **app-of-apps** / ApplicationSets | Kustomization/HelmRelease composition |
| Fits | Teams wanting a console + strong multi-app management | Minimal, composable, air-gapped/resource-tight setups |

Core mechanics to get right:

- **Drift detection & self-heal.** With self-heal on, a manual `kubectl edit` to a managed resource
  is detected and reverted to the git state. This is a feature (git is truth) — put the fix in git,
  not the cluster. Mark genuinely runtime-mutated fields as ignored so the operator doesn't fight
  them (e.g. HPA-managed `replicas`).
- **App-of-apps / ApplicationSets** (Argo CD): a root `Application` points at a directory of child
  `Application`s, so onboarding an app or a cluster is one commit. ApplicationSets generate apps
  across many clusters/environments from a single template.
- **Sync waves & hooks** (Argo CD): annotate resources with a wave so ordering is deterministic —
  CRDs and namespaces before the workloads that need them, migrations (pre-sync hook) before the new
  version, smoke tests (post-sync). Argo CD ordering phases are pre-sync → sync → post-sync.
- **Secrets never in plaintext git.** Commit only *encrypted* or *referenced* secrets:
  **SOPS** (encrypt values in-repo, decrypt in-cluster), **Sealed Secrets** (a public-key-encrypted
  `SealedSecret` CRD only the cluster controller can open), or **External Secrets Operator** /
  cluster secret store (git holds a *reference*; the real value stays in Vault/cloud secret manager).
  See the `workloads` skill for why a raw `Secret` is only base64.
- **Repo split.** Keep the *app source* repo separate from the *config/manifests* repo the operator
  watches, so a config bump (image digest) doesn't rebuild the app and CI pushing config doesn't
  loop.

## §4 — Multi-environment promotion

One build artifact (a pinned digest) moves dev → staging → prod; **only config differs**, and every
promotion is a reviewable git change.

| Layout | How environments differ | Notes |
| --- | --- | --- |
| **Directory/overlay per env** (recommended) | `base/` + `overlays/{dev,staging,prod}/` (Kustomize) or per-env Helm values | All envs on one branch; diffs are visible side-by-side; the mainstream default |
| **Branch per env** | Each env tracks its own branch; promote by merge | Simple mental model but drift between branches and messy cherry-picks are common — prefer directories |

- **Promote by PR.** Open a pull request that bumps the **image digest** in the next environment's
  overlay/values — never hand-edit a shared file. The PR is the audit trail, the review gate, and
  (once merged) the trigger for the GitOps operator to sync that environment.
- Automate the chain with a promotion tool (e.g. GitOps Promoter / Argo CD ApplicationSets) that
  opens the next-env PR once the current env's gates pass — verify current tooling.
- Never build per-environment images. Same digest everywhere; environment = config only (twelve-factor).

## §5 — Rollback & incident response

- **Imperative, right now:** `kubectl rollout undo deploy/api` (optionally `--to-revision=N`) — the
  fastest stop-the-bleeding. Under GitOps this is *temporary*: the operator will re-sync to git, so
  immediately follow with the durable fix below.
- **Durable / GitOps:** `git revert` the bad commit (config repo). The operator syncs the cluster
  back to the known-good state; the revert is itself an audited change.
- **Progressive delivery:** a breached metric gate already rolled back automatically — investigate
  the failed analysis run rather than re-deploying blindly.
- **Blue-green:** flip the Service selector back to the previous (still-running) version — instant.
- Roll back the *artifact*, not by hot-patching live pods (that's drift). Then diagnose with the
  `workloads` skill's pod-debugging loop.

## §6 — Checklist

- Deploys are declarative (`apply`/GitOps), never ad-hoc `kubectl edit` on shared clusters.
- Images pinned by **digest** (or immutable unique tag); `:latest` banned.
- `rollout status` gates CI; `rollout undo` and `git revert` paths both known.
- RollingUpdate `maxUnavailable: 0`; Recreate only for incompatible-version workloads.
- Anything user-facing and risky goes out via **canary/blue-green with metric gates + auto-rollback**.
- GitOps operator installed with **self-heal + prune**; drift is corrected, not tolerated.
- Ordering handled by sync waves/hooks (CRDs/migrations before workloads).
- Secrets encrypted (SOPS/Sealed Secrets) or referenced (External Secrets) — never plaintext in git.
- One artifact promoted dev→prod by **PR**; environments differ only by config.

## Related

- `devkit:kubernetes` (workloads) — the manifests this skill ships: Deployments/Services/Ingress,
  probes (the readiness gate that makes rollouts safe), resources, security context, Kustomize/Helm,
  and the pod-debugging loop referenced in §5.
- `devkit:deployment-pipelines` (github-actions / azure-devops) — the CI that *builds and pushes the
  image and opens the promotion PR* feeding this delivery layer.
- `devkit:cloud-infrastructure` — provisioning the cluster and the vendor-neutral CI/CD and
  twelve-factor baseline this builds on.
- `devkit:containerization` — producing the immutable, digest-addressed image that gets promoted.

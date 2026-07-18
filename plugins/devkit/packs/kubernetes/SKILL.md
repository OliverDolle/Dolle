---
name: kubernetes
description: >-
  Method for deploying and configuring services on Kubernetes correctly. Load when writing or
  fixing manifests, wiring config/secrets, exposing a service, setting resources/probes/autoscaling,
  or debugging a pod that won't run. Covers Deployments/Services/Ingress, ConfigMaps & Secrets,
  requests/limits, liveness/readiness/startup probes, HPA, rollouts, security context, and
  Kustomize/Helm. Pairs with the containerization and cloud-infrastructure sections.
---

# Kubernetes (deploy & configure)

Kubernetes runs the images the `containerization` section builds. The job here is a **declarative,
self-healing, safely-updatable** deployment: the cluster should know when a pod is healthy, how
much it may consume, and how to roll forward or back without dropping traffic. Everything is YAML
under version control — never `kubectl edit` production and walk away.

## Step 0 — Model the workload

Pick the right controller before writing YAML:

| Workload | Controller |
| --- | --- |
| Stateless service (most web/API apps) | **Deployment** |
| Stable identity / ordered / per-pod storage (DBs, brokers) | **StatefulSet** |
| One pod per node (agents, log/metric collectors) | **DaemonSet** |
| Run-to-completion / scheduled | **Job** / **CronJob** |

Default to a **Deployment**. Reach for StatefulSet only when you genuinely need stable network IDs
or per-replica volumes — it's more to operate.

## Step 1 — A Deployment worth shipping

The mistakes that cause 3am pages are almost always missing here: no resources, no probes, no
rollout safety, running as root. This template has them all.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  labels: { app: api }
spec:
  replicas: 3
  selector:
    matchLabels: { app: api }
  strategy:
    type: RollingUpdate
    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }   # never drop below desired during rollout
  template:
    metadata:
      labels: { app: api }
    spec:
      securityContext:
        runAsNonRoot: true
        seccompProfile: { type: RuntimeDefault }
      containers:
        - name: api
          image: registry.example.com/api@sha256:...     # pin by digest, not :latest
          ports: [{ containerPort: 8080 }]
          resources:
            requests: { cpu: "100m", memory: "128Mi" }    # what the scheduler reserves
            limits:   {              memory: "256Mi" }    # cap memory; usually DO NOT cap CPU
          readinessProbe:                                  # gates traffic
            httpGet: { path: /readyz, port: 8080 }
            periodSeconds: 5
          livenessProbe:                                   # restarts a wedged pod
            httpGet: { path: /healthz, port: 8080 }
            periodSeconds: 10
          startupProbe:                                    # protects slow starts from liveness
            httpGet: { path: /healthz, port: 8080 }
            failureThreshold: 30
            periodSeconds: 2
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities: { drop: ["ALL"] }
          envFrom:
            - configMapRef: { name: api-config }
            - secretRef:    { name: api-secrets }
      terminationGracePeriodSeconds: 30
```

## Step 2 — The knobs that matter, and how to set them

**Resources — requests vs limits.** `requests` is what the scheduler reserves and what
autoscaling/bin-packing reason about; `limits` is the hard ceiling. Rules that hold in practice:

- **Always set memory request = limit** (or close). Memory is incompressible — over a memory limit
  the pod is **OOMKilled**, not throttled.
- **Set a CPU request; usually omit the CPU limit.** CPU is compressible (throttled, not killed);
  a low CPU limit causes mysterious latency under load. Set one only for hard multi-tenant
  isolation.
- No requests at all → the pod lands in *BestEffort* QoS and is first to be evicted under
  pressure. Set them.

**Probes — three different jobs, don't conflate them.**

- **readiness** — "should this pod receive traffic *right now*?" Failing pulls it out of the
  Service endpoints without restarting it. This is what makes rollouts and dependency blips
  graceful.
- **liveness** — "is this pod wedged and needs a restart?" Keep it cheap and *independent of
  downstream deps* — a liveness probe that checks the database will cascade-kill every pod when the
  DB hiccups. Point it at a local `/healthz`.
- **startup** — buys a slow-booting app time before liveness starts, so a long cold start isn't
  mistaken for a hang.

**Graceful shutdown.** On delete, K8s sends `SIGTERM`, waits `terminationGracePeriodSeconds`, then
`SIGKILL`. The app must catch `SIGTERM` and drain (stop accepting, finish in-flight). Endpoint
removal and SIGTERM race — a short `preStop: sleep 5` (or holding readiness=false briefly) avoids
sending traffic to a pod that's already shutting down.

## Step 3 — Config and secrets

- **ConfigMap** for non-sensitive config; **Secret** for credentials. Consume via `envFrom` or
  mounted files. Prefer **mounted files** for anything that should hot-reload (env vars are frozen
  at process start).
- **A base64 Secret is *encoded, not encrypted*.** Anyone with read access decodes it, and it's in
  etcd. Do **not** commit real Secrets to git. Use one of: a sealed/encrypted secret
  (**Sealed Secrets**, **SOPS**), or pull from an external store (**External Secrets Operator**,
  cloud secret manager, Vault). Enable **encryption-at-rest** for etcd and lock down RBAC on
  Secrets.
- A ConfigMap/Secret change does **not** restart pods by itself. Either mount as files and let the
  app reload, or roll the deployment (`kubectl rollout restart deploy/api`, or a checksum
  annotation that changes with the content — Helm's classic pattern).

## Step 4 — Expose it

- **Service** `ClusterIP` for in-cluster traffic (the default; use this between services).
- **Ingress** (+ an ingress controller like nginx/Traefik) or the newer **Gateway API** for HTTP(S)
  from outside — one entry point, host/path routing, TLS termination (pair with **cert-manager**
  for automatic Let's Encrypt certs).
- `type: LoadBalancer` only when you truly need a raw L4 external IP; on cloud it provisions (and
  bills for) a load balancer per Service.
- **NetworkPolicy**: default-deny ingress/egress, then allow only the flows you need. Without one,
  every pod can reach every other pod.

## Step 5 — Scale and stay available

- **HPA** scales replicas on CPU/memory or custom/external metrics. It needs resource **requests**
  set to work.

  ```yaml
  apiVersion: autoscaling/v2
  kind: HorizontalPodAutoscaler
  metadata: { name: api }
  spec:
    scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: api }
    minReplicas: 3
    maxReplicas: 20
    metrics:
      - type: Resource
        resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } }
  ```

- **PodDisruptionBudget** so voluntary disruptions (node drains, upgrades) can't take the whole
  service down: `minAvailable: 2` (or a %).
- Spread replicas across nodes/zones with **topologySpreadConstraints** so one node/zone failure
  isn't total.

## Step 6 — Package & environments (Kustomize or Helm)

Don't copy-paste manifests per environment.

- **Kustomize** (built into `kubectl -k`) — a plain `base/` plus per-env `overlays/` that patch
  images, replica counts, and config. Best when you own the manifests and want no templating
  language. Default for first-party apps.
- **Helm** — templated, versioned, parameterized *charts* with `values.yaml`. Best for packaging
  something reusable/installable, or consuming third-party charts. `helm upgrade --install`,
  `helm rollback` for release history.

Pick one and be consistent; don't nest a Helm chart inside a Kustomize overlay unless you must.

## Step 7 — Verify & debug

Rollout and health:

```
kubectl apply -k overlays/prod          # or: helm upgrade --install
kubectl rollout status deploy/api       # watch it converge; blocks until healthy or times out
kubectl get pods -l app=api             # Running/Ready counts
kubectl rollout undo deploy/api         # instant rollback if it went bad
```

Debugging the common failures — read the *reason*, don't guess:

- `kubectl describe pod <p>` → **Events** at the bottom explain most failures
  (FailedScheduling = no room / bad requests; ImagePullBackOff = wrong image/creds; CrashLoopBackOff
  = app exits — read logs).
- `kubectl logs <p> [-p]` (`-p` = previous crashed container), `--tail`, `-f`.
- `CrashLoopBackOff` → app-level crash or failing liveness; `OOMKilled` (in `describe`) → raise
  memory limit or fix the leak; `Pending` → unschedulable (resources/taints/PVC); `ImagePullBackOff`
  → image name/tag/registry auth.
- `kubectl exec -it <p> -- sh` or `kubectl debug` (ephemeral container) for a distroless image with
  no shell.
- Validate before applying: `kubectl apply --dry-run=server -f -`, and lint with `kubeconform` /
  `kubectl kustomize` in CI.

## Standing rules

- Every workload: resource **requests** set, memory request≈limit, readiness+liveness distinct,
  non-root securityContext, image pinned by digest.
- Liveness never depends on downstream services. Readiness gates traffic; liveness restarts hangs.
- Secrets are not encrypted by default — never commit them; use SOPS/Sealed Secrets/External
  Secrets and lock RBAC.
- Rollouts use `maxUnavailable: 0`; keep a PDB; know `rollout undo`.
- Declarative + GitOps: manifests in git are the source of truth, not `kubectl edit`.
- One packaging tool (Kustomize *or* Helm) per repo, applied consistently across environments.

## Related

- `devkit:containerization` — the image these manifests run: its non-root user, `HEALTHCHECK`, and
  `SIGTERM` handling are what the securityContext, probes, and graceful termination here depend on.
- `devkit:cloud-infrastructure` — provisioning the cluster (Terraform/EKS/GKE/AKS), CI that builds
  and deploys, GitOps (Argo CD / Flux), and observability.

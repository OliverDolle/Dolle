---
name: cloud-infrastructure
description: >-
  Method for provisioning and shipping to cloud platforms the right way. Load when writing a CI/CD
  pipeline, authoring Infrastructure-as-Code (Terraform), choosing a compute target
  (containers/serverless/PaaS on AWS, GCP, or Azure), managing secrets/config across environments,
  or adding observability. Covers pipeline stages, Terraform state & structure, deployment
  strategies, cloud auth (OIDC, no long-lived keys), and the twelve-factor baseline. Pairs with
  the containerization and kubernetes sections.
---

# Cloud infrastructure (CI/CD, IaC & platforms)

The goal is **reproducible, automated, least-privilege** delivery: infrastructure defined as code,
changes shipped by a pipeline (not a laptop), secrets never in the repo, and every environment
built from the same definitions with only values differing. Manual clicks in a cloud console don't
survive contact with a second engineer or a 3am recovery.

## Step 0 — Baseline: make the app deployable (twelve-factor)

Before any platform choice, the app must obey the parts of twelve-factor that make deployment sane:

- **Config in the environment**, not in code — one build artifact promoted across dev→staging→prod,
  differing only by injected config/secrets. No per-env branches or builds.
- **Stateless processes**; persist state in backing services (DB, object store, cache). Anything on
  local disk is lost on redeploy.
- **Logs to stdout/stderr** as event streams — the platform captures them; the app doesn't manage
  log files.
- Treat backing services (DB, queue, cache) as **attached resources** addressed by URL/credential
  from config, swappable without code change.
- **Fast startup + graceful shutdown** (handle `SIGTERM`) so scaling and rollouts are clean.

## Step 1 — Pick the compute target

Match the platform to the workload; don't reach for Kubernetes reflexively.

| Need | Reach for |
| --- | --- |
| Event/HTTP, spiky or low traffic, scale-to-zero | **Serverless functions** (AWS Lambda, Cloud Functions, Azure Functions) |
| A container, no cluster to run | **Serverless containers** (Cloud Run, AWS App Runner, ECS Fargate, Azure Container Apps) |
| Many services, complex networking/scheduling, portability | **Kubernetes** (EKS/GKE/AKS) — see `kubernetes` |
| A web app + managed add-ons, minimal ops | **PaaS** (Fly.io, Render, Railway, App Service, Elastic Beanstalk) |
| Static site / SPA + edge functions | **Static host + CDN** (CloudFront/S3, Cloud CDN, Vercel/Netlify) |

Bias to the **most managed option that fits** — a cluster you don't need is ongoing toil. Cloud Run
/ Fargate / App Runner run the same OCI image the `containerization` section builds, with far less
to operate than K8s.

## Step 2 — Infrastructure as Code (Terraform / OpenTofu)

Provision everything through code so it's reviewable, reproducible, and destroyable. Terraform (or
its fork **OpenTofu**) is the portable default; cloud-native options (CloudFormation/CDK, Bicep,
Pulumi) are fine if the team already lives there.

Non-negotiables:

- **Remote, locked state.** Never local `terraform.tfstate` on a laptop. Use a backend with locking
  (S3 + DynamoDB lock, GCS, Azure Blob, or Terraform Cloud). State often contains secrets — encrypt
  it and restrict access.
- **State is not code — treat it as sensitive.** Don't commit it; don't hand-edit it.
- **Structure:** a small set of reusable **modules**, composed per environment. Isolate
  environments by **separate state** (workspaces or, better, separate state files per env) so a
  `prod` mistake can't ride in on a `dev` apply.
- **Pin provider and module versions**; commit a lockfile. Reproducibility beats "latest".
- **Plan in CI on PRs, apply on merge.** `terraform plan` output is the review artifact — a human
  approves the diff before `apply`. Never `apply` unreviewed from a laptop against prod.
- **Prefer data sources and outputs over hardcoded IDs.** Tag everything (owner, env, cost-center).

```hcl
terraform {
  required_version = "~> 1.9"
  backend "s3" {
    bucket         = "acme-tfstate"
    key            = "prod/app.tfstate"
    region         = "eu-north-1"
    dynamodb_table = "tf-locks"      # state locking
    encrypt        = true
  }
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.60" }
  }
}
```

## Step 3 — CI/CD pipeline

One pipeline, clear stages, fail fast, and a human gate before prod. A sane default order:

1. **Lint & typecheck** → 2. **Test** (unit, then integration) → 3. **Build** the artifact/image
   **once** (tag by immutable commit SHA) → 4. **Scan** (image CVEs via Trivy/Scout, dependency
   audit, IaC scan via `tfsec`/`checkov`, secret scan via gitleaks) → 5. **Push** to registry →
   6. **Deploy to staging** automatically → 7. **Smoke/e2e** against staging →
   8. **Promote to prod** (manual approval or protected environment) → 9. **Post-deploy verify**.

Rules that keep it trustworthy:

- **Build once, promote the same artifact.** Rebuilding per environment means prod runs code
  staging never saw. Tag with the commit SHA, deploy that exact digest onward.
- **Authenticate to the cloud with short-lived OIDC**, not long-lived access keys stored as repo
  secrets. GitHub Actions / GitLab CI both federate into AWS/GCP/Azure via OIDC → assume a role
  scoped to least privilege. Rotate is automatic; nothing to leak.
- **Least-privilege CI identity** — the deploy role can touch only what it deploys.
- **Cache dependencies and layers** for speed; make steps idempotent and re-runnable.
- **Environments as protected gates** with required reviewers for prod; keep a fast, safe rollback
  (redeploy previous digest / `terraform apply` previous, or blue-green switch).

Minimal GitHub Actions shape with OIDC (no stored cloud keys):

```yaml
permissions:
  id-token: write        # enables OIDC
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/ci-deploy   # scoped, short-lived
          aws-region: eu-north-1
      # build → scan → push → deploy the pinned SHA
```

## Step 4 — Deployment strategy

- **Rolling** — default; replace instances gradually. Fine for most stateless services.
- **Blue-green** — stand up the new version alongside old, switch traffic at once, keep old warm for
  instant rollback. Costs double briefly; safest cutover.
- **Canary** — shift a small % of traffic to the new version, watch metrics/error rates, then ramp.
  Best when you have good observability to judge the canary.
- Always know the **rollback path** and that it's fast — a deploy you can't reverse in minutes is a
  liability. Decouple deploy from release with **feature flags** where risk is high.
- **Migrations:** run DB migrations as a separate, backward-compatible step (expand → deploy →
  contract) so a rollback doesn't hit a schema the old code can't read.

## Step 5 — Secrets & configuration

- Secrets live in a **managed store** (AWS Secrets Manager/SSM Parameter Store, GCP Secret Manager,
  Azure Key Vault, or Vault) and are injected at deploy/run time. Never in the repo, image, or
  Terraform state in plaintext.
- **Scan for leaked secrets in CI** (gitleaks/trufflehog); rotate anything that ever touched a
  commit.
- Per-environment values, one mechanism — don't hand-maintain parallel `.env` files that drift.
- Least-privilege IAM everywhere: each service/role gets only the permissions it uses; no
  wildcard `*` in production policies.

## Step 6 — Observability (you can't operate what you can't see)

Wire these in from day one, not after the first incident:

- **Logs** — structured (JSON), to stdout, aggregated (CloudWatch, Cloud Logging, Loki, etc.),
  correlated by a request/trace id.
- **Metrics** — the RED method for services (Rate, Errors, Duration) and USE for resources
  (Utilization, Saturation, Errors); Prometheus/CloudWatch + dashboards.
- **Traces** — **OpenTelemetry** for distributed tracing across services (vendor-neutral;
  export to Tempo/Jaeger/X-Ray/Cloud Trace).
- **Alerts on symptoms, tied to SLOs** (latency/error-rate/availability), not on every raw metric —
  page on user-visible pain, not CPU at 60%.
- **Health endpoints** (`/healthz`, `/readyz`) the platform and probes consume (see `kubernetes`).

## Step 7 — Verify

- `terraform plan` is clean/empty after apply (no drift); a fresh `plan` from a clean checkout
  matches reality.
- The pipeline is green end-to-end and deploys the **same digest** built in CI.
- Cloud auth uses OIDC/short-lived creds — grep the repo/secrets for long-lived keys and remove
  them.
- Rollback tested: you can revert the last deploy in minutes.
- Logs/metrics/traces show up for a test request; an alert fires on an induced failure.
- IaC and image scans pass in CI; no secrets in the repo (secret scan clean).

## Standing rules

- Everything reproducible from code: IaC + pipeline, no console clicks that aren't captured.
- Build once, promote the same artifact across environments.
- Short-lived OIDC cloud auth, least-privilege roles — no long-lived keys in CI.
- Remote locked encrypted Terraform state; separate state per environment.
- Secrets in a managed store, injected at runtime; scanned out of the repo.
- Plan/diff reviewed by a human before prod apply; prod deploys gated; rollback fast and known.
- Observability (logs/metrics/traces) and SLO-based alerting from the start.
- Most-managed platform that fits the workload — don't run a cluster you don't need.

## Related

- `devkit:containerization` — the image CI builds, scans, and pushes; the artifact promoted through
  the pipeline.
- `devkit:kubernetes` — one compute target; provision the cluster with the IaC here and deploy via
  the pipeline (GitOps with Argo CD / Flux is the K8s-native form of Step 3).
- `devkit:web-performance` — field metrics (CrUX/RUM) feed the observability picture for anything
  user-facing.

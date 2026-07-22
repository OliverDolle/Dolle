---
name: github-actions
description: >-
  Field manual for production GitHub Actions CI/CD. Load when writing .github/workflows, reusable
  workflows/composite actions, OIDC cloud auth, environments & required reviewers, matrix/cache/
  concurrency, least-privilege GITHUB_TOKEN, SHA-pinning, build attestation/SLSA, or dependabot.
  Triggers: 'github actions workflow', 'reusable workflow', 'gha oidc', 'deployment environment',
  'pin actions'.
---

# GitHub Actions (production CI/CD)

The platform-specific mechanics of shipping with GitHub Actions. The vendor-neutral *why*
(build-once-promote, OIDC over long-lived keys, gated prod, rolling/canary/blue-green as concepts)
lives in `devkit:cloud-infrastructure` — read it first. This is the field manual for the YAML.

## Platform model & when to use

- A **workflow** (`.github/workflows/*.yml`) is triggered by events (`push`, `pull_request`,
  `workflow_dispatch`, `schedule`, `workflow_call`). It contains **jobs**; jobs contain **steps**.
- **Jobs run on separate runners** and in parallel by default. They share nothing but declared
  `needs:` order, `outputs`, and uploaded artifacts. A later job cannot see an earlier job's files
  unless you `upload-artifact`/`download-artifact`.
- Reach for Actions when the repo lives on GitHub and you want CI/CD co-located with code and PRs.
  For cross-repo org pipelines, factor shared logic into **reusable workflows** (below).

## Pipeline skeleton (annotated)

```yaml
name: ci-cd
on:
  push: { branches: [main] }
  pull_request:

concurrency:                          # one run per ref; cancel superseded PR runs
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

permissions:                          # least privilege at the TOP, then widen per-job
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262   # v4.4.0
      - uses: actions/setup-node@... # SHA-pinned; see Supply chain
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run build && docker build -t "$IMAGE:${{ github.sha }}" .   # tag by immutable SHA

  deploy-prod:
    needs: build
    runs-on: ubuntu-latest
    environment: production           # gate: required reviewers live on the ENV, not here
    permissions:
      id-token: write                 # OIDC — mint a token, no stored cloud keys
      contents: read
    steps:
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262   # v4.4.0
      # cloud login via OIDC, then deploy the exact digest built above
```

Key rule carried from `cloud-infrastructure`: **build the artifact once, promote the same digest**;
tag by `github.sha`, never rebuild per environment.

## Auth: OIDC to cloud (keyless)

Stop storing long-lived cloud keys as repo secrets. GitHub's OIDC provider mints a short-lived JWT
per job; the cloud trusts it via a federated identity and returns temporary credentials.

- Requires `permissions: id-token: write` **on the job** (plus `contents: read`).
- On the cloud side, scope the trust policy to your repo/ref (e.g. `repo:org/name:ref:refs/heads/main`
  or `:environment:production`) so only the intended workflow can assume the role.

```yaml
permissions:
  id-token: write
  contents: read
steps:
  # AWS
  - uses: aws-actions/configure-aws-credentials@7474bc4690e29a8392af63c5b98e7449536d5c3a  # v4.3.1
    with:
      role-to-assume: {{ AWS_DEPLOY_ROLE_ARN }}   # scoped, short-lived
      aws-region: {{ AWS_REGION }}
  # Azure: azure/login@<sha> with client-id/tenant-id/subscription-id (federated credential)
  # GCP:   google-github-actions/auth@<sha> with workload_identity_provider + service_account
```

## Least-privilege `permissions:` & secrets

- **Default the whole workflow to `contents: read`**, then grant only what a job needs
  (`packages: write` to push to GHCR, `id-token: write` for OIDC, `attestations: write` to attest).
  A missing scope fails loudly; an over-broad `GITHUB_TOKEN` is a standing risk. Set
  org/repo default token permissions to read-only.
- **Secrets:** repo/org/environment-scoped. **Environment secrets** are the strong ones — they're
  only readable by jobs that name that `environment:` and pass its protection rules, so prod
  credentials never load on a PR run.
- Never `echo` a secret; they're masked in logs but don't rely on it. Secrets are **not** passed to
  workflows triggered by `pull_request` from forks — by design.

## Environments, gates & required reviewers

- An **environment** (`environment: production` on a job) is the gate. **Required reviewers, wait
  timers, and branch/tag deployment rules are configured on the environment in repo settings — not
  in YAML.** The job blocks until reviewers approve.
- Scope prod secrets to the prod environment so approval is genuinely load-bearing.
- Use environments per target (`staging`, `production`); auto-deploy staging, gate production.

## Deployment strategies (rolling / canary / blue-green)

Actions orchestrates; the **target platform** executes the strategy. Actions itself has no
built-in traffic-shifting — you drive the target's mechanism:

| Strategy | How to drive it from a workflow |
| --- | --- |
| **Rolling** | `kubectl rollout` / `helm upgrade` (K8s does the gradual replace), or ECS rolling update. See `devkit:kubernetes`. |
| **Blue-green** | Deploy to the idle slot/target group, smoke-test, then flip: App Service **slot swap**, ELB target-group switch, or two K8s Services. |
| **Canary** | Shift a small traffic % (service mesh, weighted DNS/LB, or Argo Rollouts), watch metrics, ramp. Gate the ramp behind a `deployment` reviewer or a metrics check. |

Always keep the rollback fast: re-deploy the previous digest, or flip the slot back.

## Reuse (reusable workflows vs composite actions)

Two different tools — pick by scope:

| | Reusable workflow | Composite action |
| --- | --- | --- |
| Unit of reuse | **Whole jobs** (multi-job, matrices, `environment:`) | **Steps within one job** |
| Defined as | `on: workflow_call` with `inputs`/`secrets` | `action.yml` with `runs.using: composite` |
| Called by | `uses: org/repo/.github/workflows/x.yml@sha` | `uses: org/repo/.github/actions/x@sha` |
| Can gate an environment / run its own jobs | **Yes** | No |

Rule of thumb: **reusable workflow** for a shared *pipeline* (build+scan+deploy across many repos);
**composite action** for a repeated *step sequence* (setup + auth + cache). Pin the callee by SHA
just like any other action; pass secrets explicitly with `secrets: inherit` or named `secrets:`.

## Speed (matrix / cache / concurrency)

- **Matrix** fans one job across versions/OSes; add `fail-fast: false` to see all failures, and
  `max-parallel` to cap runners.
- **Cache**: prefer the language setup action's built-in cache (`setup-node` `cache: npm`,
  `setup-python` `cache: pip`) over hand-rolling `actions/cache`. Key on a lockfile hash; a stale or
  unkeyed cache is worse than none. For Docker, use `cache-from`/`cache-to` (GHA cache backend).
- **Concurrency** (top of skeleton) cancels superseded runs on the same ref so PR pushes don't queue
  up — but scope the group so you never cancel an in-flight *production* deploy.

## Supply chain (SHA-pin, attest / SLSA, dependabot)

- **Pin third-party actions by full commit SHA, not a tag.** A tag (`@v4`) is mutable — the owner (or
  an attacker who compromises them) can move it. Pin `@<40-char-sha>` with a `# vX.Y.Z` comment.
  First-party `actions/*` are lower-risk but pin them too for reproducibility. Enforce with a tool
  like `pinact` or `zizmor` in CI.
- **Build provenance / SLSA:** attest what you built so consumers can verify it came from your
  workflow. Needs `id-token: write`, `attestations: write`, `contents: read`.

  ```yaml
  permissions: { id-token: write, attestations: write, contents: read }
  steps:
    - uses: actions/attest-build-provenance@0f67c3f4856b2e3261c31976d6725780e5e4c373  # v4.1.1
      with:
        subject-name: {{ IMAGE_NAME }}
        subject-digest: sha256:{{ IMAGE_DIGEST }}
        push-to-registry: true
  ```

  It signs a SLSA provenance predicate with a short-lived Sigstore cert; verify downstream with
  `gh attestation verify` (or `cosign`/`slsa-verifier`).
- **Dependabot** keeps actions and deps patched — including the pinned SHAs (it bumps SHA + comment):

  ```yaml
  # .github/dependabot.yml
  version: 2
  updates:
    - package-ecosystem: github-actions
      directory: "/"
      schedule: { interval: weekly }
  ```

## Verify checklist

- [ ] Workflow defaults to `permissions: contents: read`; each job widens only what it needs.
- [ ] Cloud auth is OIDC (`id-token: write` + federated role) — no long-lived keys in secrets.
- [ ] Prod job uses `environment:` with required reviewers configured in settings; prod secrets
      scoped to that environment.
- [ ] Artifact built once, deployed by immutable `github.sha`/digest across environments.
- [ ] All third-party actions pinned by full commit SHA with a version comment.
- [ ] `concurrency` set; it never cancels an in-flight prod deploy.
- [ ] Build provenance attested (`attest-build-provenance`); Dependabot enabled for `github-actions`.
- [ ] Rollback path is known and fast (redeploy previous digest / flip slot).

## Related

- `devkit:cloud-infrastructure` — the vendor-neutral pipeline/IaC/OIDC/observability concepts this
  field manual makes GitHub-concrete. Prerequisite.
- `devkit:containerization` — the image this workflow builds, scans, pushes, and attests.
- `devkit:kubernetes` — a common deploy target; `kubectl rollout`/Helm execute the rollout the
  deploy job triggers.

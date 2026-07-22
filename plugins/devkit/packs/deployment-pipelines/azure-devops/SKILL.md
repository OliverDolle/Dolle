---
name: azure-devops
description: >-
  Field manual for production Azure DevOps Pipelines. Load when writing azure-pipelines.yml,
  multi-stage YAML, templates, deployment jobs & strategies (canary/blue-green/rolling), environments
  & approvals/checks, variable groups + Key Vault, or service connections with workload identity
  federation (OIDC). Triggers: 'azure pipelines', 'azure devops', 'service connection',
  'variable group', 'deployment job'.
---

# Azure DevOps Pipelines (production CI/CD)

The platform-specific mechanics of shipping with Azure Pipelines. The vendor-neutral *why*
(build-once-promote, OIDC over long-lived keys, gated prod, rolling/canary/blue-green as concepts)
lives in `devkit:cloud-infrastructure` — read it first. This is the field manual for the YAML.

## Platform model & when to use

- One `azure-pipelines.yml` describes the pipeline. The hierarchy is **stages → jobs → steps
  (tasks)**. Stages are the promotion boundary (CI → staging → prod); jobs within a stage run in
  parallel unless ordered with `dependsOn`.
- Two job kinds: a plain **`job`** (build/test on an agent) and a **`deployment` job** (deploys to an
  `environment`, records deployment history, and applies a strategy). Use `deployment` for anything
  that ships.
- Reach for Azure Pipelines when code/work items live in Azure DevOps or you deploy heavily into
  Azure — Azure tasks + workload-identity service connections are first-class.

## Pipeline skeleton (annotated, multi-stage)

```yaml
trigger: [main]

variables:
  - group: prod-secrets          # linked to Key Vault in Library (see below)
  - name: vmImage
    value: ubuntu-latest

stages:
  - stage: Build
    jobs:
      - job: build
        pool: { vmImage: $(vmImage) }
        steps:
          - script: npm ci && npm test && npm run build
          - task: Docker@2           # build once; tag by immutable commit
            inputs: { command: buildAndPush, repository: app, tags: $(Build.SourceVersion) }
          - publish: $(Build.ArtifactStagingDirectory)   # hand artifact to later stages
            artifact: drop

  - stage: DeployProd
    dependsOn: Build
    condition: succeeded()
    jobs:
      - deployment: deployProd
        environment: production      # gate: approvals/checks live on the ENV, not here
        pool: { vmImage: $(vmImage) }
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureCLI@2
                  inputs:
                    azureSubscription: {{ SERVICE_CONNECTION }}   # workload-identity conn, no secret
                    scriptType: bash
                    scriptLocation: inlineScript
                    inlineScript: az webapp deploy --name {{ APP_NAME }} --src-path drop/app.zip
```

Carry the `cloud-infrastructure` rule: **build once, promote the same artifact** across stages via
`publish`/`download`; tag by `$(Build.SourceVersion)`.

## Auth: OIDC to Azure (workload identity federation)

Don't store service-principal secrets/certs in service connections — they expire and can leak.
**Workload identity federation** (GA) makes the Azure Resource Manager service connection keyless:
Azure DevOps mints an OIDC token, Microsoft Entra trusts it via a federated credential and returns a
short-lived token.

- Create the ARM service connection with **Identity type = App registration (or Managed identity)**,
  **Credential = Workload identity federation** (automatic or manual). No secret is stored.
- Every built-in Azure task (`AzureCLI@2`, `AzureWebApp@1`, `AzureResourceManagerTemplateDeployment@3`,
  …) authenticates just by referencing the connection via `azureSubscription:`. Marketplace/custom
  tasks may not support it yet.

```yaml
- task: AzureCLI@2
  inputs:
    azureSubscription: {{ SERVICE_CONNECTION }}   # keyless; the task federates automatically
    scriptType: bash
    scriptLocation: inlineScript
    inlineScript: az deployment group create -g {{ RESOURCE_GROUP }} --template-file infra/main.bicep
```

## Least-privilege config & secrets (variable groups + Key Vault)

- **Variable group** = shared named values in **Pipelines → Library**, referenced with
  `variables: - group: <name>`. A YAML pipeline must be **authorized** to use a group (Pipeline
  permissions), or anyone who can push could exfiltrate its secrets.
- **Link the group to Azure Key Vault** (toggle in the Library UI) so only secret *names* map into
  the group — values are fetched from the vault at runtime, and rotations flow through with no
  pipeline edit. The connection needs **Get + List** on the vault (or the *Key Vault Secrets User*
  RBAC role).
- **Secret variables aren't auto-injected into scripts** — pass them explicitly as task
  `env:`/arguments; `$(secret)` won't expand inside an inline script otherwise.
- Scope the deploy service connection to least privilege (Contributor on the target resource group,
  not the subscription).

## Environments, gates & approvals/checks

- An **environment** (`environment: production` on a `deployment` job) is the gate and the deployment
  history record.
- **Approvals and checks are set on the environment by its owner in the Azure DevOps UI — not in
  YAML.** Add pre-deployment **Approvals** (named approvers), plus **Checks** (business hours,
  Invoke REST API / Azure Function, branch control, exclusive lock). The `deployment` job blocks
  until they pass.
- First run of a pipeline against an environment requires a one-time **Permit** to grant access to
  the environment and agent pool.

## Deployment strategies (rolling / canary / blue-green)

YAML `deployment` jobs support **three** strategy keywords, each with lifecycle hooks
(`preDeploy` → `deploy` → `routeTraffic` → `postRouteTraffic` → `on: success|failure`):

| Strategy | Keyword | Notes |
| --- | --- | --- |
| **Run once** | `runOnce` | Default; runs each hook once. Fine for most services (App Service, functions). |
| **Rolling** | `rolling` | Replaces VMs in batches of `maxParallel` (number or %). **VM resources only.** Health-check between batches; stop on failure. |
| **Canary** | `canary` | Ramp in `increments` (e.g. `[10, 20, 50]`); `strategy.increment`/`strategy.action` exposed for K8s. Watch metrics between increments. |

```yaml
strategy:
  canary:
    increments: [10, 50]
    deploy:
      steps:
        - task: KubernetesManifest@1
          inputs: { action: deploy, percentage: $(strategy.increment) }
    postRouteTraffic:
      steps: [ { script: ./check-slo.sh } ]   # gate the next increment on metrics
```

**Blue-green is not a native YAML strategy keyword.** Implement it explicitly: deploy to an idle
**App Service deployment slot** and `az webapp deployment slot swap` after smoke tests (instant
rollback = swap back), or split traffic with Azure Traffic Manager / two target groups. Always keep
the rollback fast.

## Reuse (templates)

Azure Pipelines reuses YAML through **templates** — the equivalent of GitHub's reusable workflows +
composite actions:

- **Steps / jobs / stages templates:** factor a sequence into a file and include it with
  `- template: build-steps.yml` (or under `jobs:`/`stages:`), passing typed `parameters:`.
- **`extends` templates** enforce a required shape across many pipelines (security guardrails): the
  pipeline `extends` a central template and can only fill in allowed parameters — the go-to for
  org-wide standardization.
- Keep templates in a dedicated repo, reference via a `resources: repositories:` entry, and pin to a
  tag/ref for reproducibility.

## Speed (matrix / cache / concurrency)

- **Matrix:** `strategy: matrix:` on a `job` fans across versions/OSes; `maxParallel` caps agents.
- **Cache:** the `Cache@2` task keyed on a lockfile hash (`key: 'npm | "$(Agent.OS)" |
  package-lock.json'`) with a `restoreKeys` fallback. Node/Python setup tasks also cache.
- **Concurrency:** there's no `cancel-in-progress` knob like GitHub. Use `batch: true` on the trigger
  to coalesce queued CI runs, and an **Exclusive lock** check on the prod environment so only one
  deployment touches it at a time (serialize, don't stampede).

## Supply chain

- **Pin task major versions** (`AzureCLI@2`) and pin template repo references to a tag/commit; don't
  float templates on a moving branch.
- **Scan in-pipeline:** image CVEs (Trivy/Defender), dependency audit, IaC scan
  (`checkov`/`tfsec`), secret scan (gitleaks) — same stages as `cloud-infrastructure` Step 3.
- **Guard secrets on forked-PR builds:** don't expose secret variables or protected variable groups
  to PRs from forks; restrict which branches can access an environment via a branch-control check.
- **Provenance:** Azure Artifacts / registry signing (`cosign`) for images; keep the deploying
  identity keyless (workload identity federation) so there's no long-lived secret to attest around.

## Verify checklist

- [ ] ARM service connection uses **workload identity federation** — no stored secret/cert.
- [ ] Prod is a `deployment` job to an `environment` with **Approvals + Checks** set in the UI.
- [ ] Secrets come from a **Key Vault-linked variable group**, and the pipeline is authorized to use
      it; secrets passed to tasks as `env:`, not read inline.
- [ ] Artifact built once (`publish`), deployed by immutable `$(Build.SourceVersion)` across stages.
- [ ] Strategy matches the target (`runOnce`/`rolling` for VMs, `canary` for K8s; blue-green via slot
      swap) and gates the next step on health/SLO.
- [ ] Shared logic in templates; `extends` template enforces guardrails org-wide; template refs pinned.
- [ ] Exclusive-lock check prevents concurrent prod deployments; scans pass in CI.
- [ ] Rollback path is known and fast (redeploy previous artifact / swap slot back).

## Related

- `devkit:cloud-infrastructure` — the vendor-neutral pipeline/IaC/OIDC/observability concepts this
  field manual makes Azure DevOps-concrete. Prerequisite.
- `devkit:containerization` — the image the Build stage builds, scans, and pushes.
- `devkit:kubernetes` — a common deploy target; the `canary`/rolling manifests the deployment job
  applies.

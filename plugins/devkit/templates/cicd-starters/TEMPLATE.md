---
name: cicd-starters
description: Minimal, valid keyless-OIDC CI/CD starters for GitHub Actions and Azure DevOps — each with a build job/stage and a gated production deploy. Copy the one for your platform and fill in the placeholders.
---

# cicd-starters — scaffold manifest

Two independent, copy-ready pipeline starters. Both are keyless (OIDC / workload identity
federation), build once, and gate the production deploy behind an `environment`. **This
`TEMPLATE.md` is documentation only — never copy it into the target project.**

Pick the file for the platform you ship on; you don't need both.

## Files

| File | Copy to | Platform |
| --- | --- | --- |
| `.github/workflows/deploy.yml` | `<repo>/.github/workflows/deploy.yml` | GitHub Actions |
| `azure-pipelines.yml` | `<repo>/azure-pipelines.yml` | Azure DevOps Pipelines |

## Placeholders

Replace every `{{ TOKEN }}` before running. Tokens are intentionally invalid so an unfilled pipeline
fails fast rather than deploying to the wrong place.

### `.github/workflows/deploy.yml`

| Placeholder | Meaning |
| --- | --- |
| `{{ IMAGE_NAME }}` | Image / artifact name (e.g. `ghcr.io/org/app`). |
| `{{ AWS_DEPLOY_ROLE_ARN }}` | ARN of the OIDC-assumable deploy role (or swap the login step for Azure/GCP). |
| `{{ AWS_REGION }}` | Target region (e.g. `eu-north-1`). |
| `{{ DEPLOY_COMMAND }}` | The actual deploy command for your target (kubectl/helm/CLI). |

### `azure-pipelines.yml`

| Placeholder | Meaning |
| --- | --- |
| `{{ SERVICE_CONNECTION }}` | ARM service connection configured with **workload identity federation**. |
| `{{ VARIABLE_GROUP }}` | Library variable group (ideally Key Vault-linked) holding config/secrets. |
| `{{ RESOURCE_GROUP }}` | Target Azure resource group. |
| `{{ APP_NAME }}` | Target app/resource name. |
| `{{ DEPLOY_COMMAND }}` | The actual deploy command (`az webapp deploy …`, etc.). |

## After copying

**GitHub Actions:**
1. Create the `production` environment in **Settings → Environments** and add **required reviewers**
   (and any wait timer / branch rule). The workflow gate is inert until this exists.
2. Configure the cloud OIDC trust: create the role/federated credential and scope its trust to
   `repo:<org>/<repo>:environment:production`. Set `role-to-assume` (or the Azure/GCP login inputs).
3. Set repo/org **default `GITHUB_TOKEN` permissions to read-only** (Settings → Actions).
4. Verify all `uses:` actions are pinned to a full commit SHA; refresh with `pinact` and add a
   `.github/dependabot.yml` for `github-actions` so pins stay patched.
5. Fill placeholders, open a PR, confirm the build runs and the deploy job waits for approval.

**Azure DevOps:**
1. Create the ARM **service connection** with **workload identity federation** (no secret); set
   `{{ SERVICE_CONNECTION }}`.
2. Create the `production` **environment** and add **Approvals + Checks** (approvers, exclusive lock).
   Approvals are set in the UI, not this YAML.
3. Create the `{{ VARIABLE_GROUP }}` in **Pipelines → Library**, link it to Key Vault if it holds
   secrets, and **authorize** this pipeline to use it.
4. Create the pipeline pointing at `azure-pipelines.yml`; on first run, **Permit** it to access the
   environment and agent pool.
5. Fill placeholders, run, confirm the Build stage publishes the artifact and DeployProd waits for
   approval.

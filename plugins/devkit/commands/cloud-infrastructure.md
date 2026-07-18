---
description: Load the cloud-infrastructure skill — CI/CD pipelines, Terraform/IaC, choosing a cloud compute target (containers/serverless/PaaS), OIDC auth, secrets, and observability.
argument-hint: "[optional: the platform/pipeline/IaC task, e.g. 'deploy to Cloud Run' or 'set up Terraform state']"
---

Read the file `${CLAUDE_PLUGIN_ROOT}/packs/cloud-infrastructure/SKILL.md` in full and adopt it as
active guidance for the rest of this session.

Then:
1. Confirm in one line that the **cloud-infrastructure** section is loaded.
2. Summarize the method in 3–5 bullets: twelve-factor baseline (config in env, stateless, logs to
   stdout); pick the most-managed compute target that fits (serverless/containers/PaaS before a
   cluster); IaC with remote locked encrypted state, plan-on-PR/apply-on-merge; pipeline stages
   lint→test→build-once→scan→push→staging→gate→prod, promoting the same digest; short-lived OIDC
   cloud auth (no long-lived keys), secrets in a managed store; observability + SLO alerting from
   day one.
3. If the user named a platform, pipeline, or IaC task below, start there — inspect existing
   CI config / Terraform before proposing changes.

User task (optional): $ARGUMENTS

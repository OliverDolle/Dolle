---
description: "Use when building a CI/CD pipeline, writing Terraform/IaC, choosing a cloud compute target, or shipping to AWS/GCP/Azure — BEFORE authoring pipeline or infra code. Covers pipeline stages, Terraform state, OIDC auth (no long-lived keys), secrets/config across environments, and observability. Triggers: 'set up CI/CD', 'write terraform', 'deploy to cloud run', 'github actions pipeline', 'infrastructure as code'."
argument-hint: "[optional: the platform/pipeline/IaC task, e.g. 'deploy to Cloud Run' or 'set up Terraform state']"
---

**A CI/CD, Terraform/IaC, or cloud-deploy request matches this command — load it before authoring
pipeline or infra code; do not hand-write it from memory.** Read the file
`${CLAUDE_PLUGIN_ROOT}/packs/cloud-infrastructure/SKILL.md` in full and follow it as the active
method for this work.

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

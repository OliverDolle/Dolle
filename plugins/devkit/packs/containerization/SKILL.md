---
name: containerization
description: >-
  Method for containerizing an app well with Docker and Compose. Load when writing or fixing a
  Dockerfile, shrinking or securing an image, wiring a multi-service local stack, or debugging a
  build/run. Covers multi-stage builds, small and non-root images, layer-cache ordering, build
  context/.dockerignore, healthchecks, Compose for local dev, and a security/size checklist.
  Pairs with the kubernetes and cloud-infrastructure sections.
---

# Containerization (Docker & Compose)

A good image is **small, reproducible, non-root, and cache-friendly** — and it does *one* thing.
Build for that, not for "it runs on my machine." Every rule below earns its place by cutting
image size, build time, attack surface, or surprise.

## Step 0 — Decide what you're building

- **App image** (ships your service) vs **dev/CI image** (tools only) — don't mix them.
- Pick a base that matches the runtime, not the biggest one that works. Prefer, in order:
  distroless / `-slim` / Alpine-with-care over full `debian`/`ubuntu`. Alpine uses musl libc —
  fine for Go/static binaries, a trap for glibc-only wheels (Python `manylinux`), native Node
  addons, and some ML stacks. When in doubt, `-slim` (glibc) is the safe small default.
- **Pin the base** by tag *and* ideally digest (`python:3.12-slim@sha256:…`) so builds are
  reproducible; never ship `:latest`.

## Step 1 — Write a multi-stage Dockerfile

Multi-stage is the default, not an optimization: build with a fat toolchain, copy only the
artifact into a lean runtime. This is what keeps compilers, dev headers, and npm caches out of
the shipped image.

```dockerfile
# ---- build stage ----
FROM node:20-slim AS build
WORKDIR /app
# copy only manifests first so `npm ci` is cached until deps actually change
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build            # -> /app/dist

# ---- runtime stage ----
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
# run as a non-root user that the base image already provides
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/server.js"]
```

The ordering rules that make or break the build:

- **Copy dependency manifests before source.** `package.json`/`go.mod`/`requirements.txt` change
  rarely; source changes constantly. Copy manifests → install → then copy source, so a code edit
  doesn't bust the dependency layer. This single ordering choice is the biggest build-time win.
- **One logical step per `RUN`**, and chain+clean in the same layer so the cleanup actually
  shrinks the image: `RUN apt-get update && apt-get install -y --no-install-recommends X \
  && rm -rf /var/lib/apt/lists/*`. A separate `rm` layer does nothing — the files still live in
  the earlier layer.
- Use **BuildKit cache mounts** for package caches instead of baking them in:
  `RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt`. Fast rebuilds,
  no cache in the final image. (`DOCKER_BUILDKIT=1`, on by default in modern Docker.)
- Prefer **`COPY` over `ADD`** (ADD's auto-extract/URL fetch is a footgun); use `ADD` only for the
  narrow tar-extract case.
- Set `WORKDIR` (never `RUN cd`), and use **exec-form** `CMD`/`ENTRYPOINT` (`["node","x.js"]`) so
  signals reach the process for clean shutdown.

## Step 2 — Shrink the build context

The daemon tars the whole context before building. A missing `.dockerignore` uploads
`node_modules`, `.git`, and local secrets — slow, and a leak risk.

```
# .dockerignore
.git
node_modules
**/*.log
.env*
dist
coverage
.DS_Store
Dockerfile
docker-compose*.yml
```

Ignore everything the build doesn't need; at minimum `.git`, dependency dirs, build outputs, and
`.env*`. Keeps context small and stops secrets from ever entering a layer.

## Step 3 — Run it safely

- **Never root.** Create/select a non-root user and `USER` it before `CMD`. If the app must bind
  a low port, prefer a high port + host mapping over `--privileged` or `setcap`.
- **Secrets are not `ENV` and not build args.** `ENV`/`ARG` values persist in image layers and
  `docker history`. Inject secrets at **run time** (env from a secret store, mounted files) or use
  BuildKit secrets for build-time-only needs:
  `RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci`.
- **One process per container.** Need a foreground reaper for PID 1 zombie reaping? Add
  `--init` (or `tini`) rather than backgrounding processes.
- **Read-only where possible:** run with `--read-only` + a `tmpfs` for scratch; drop caps
  (`--cap-drop=ALL`, add back only what's needed); set `--memory`/`--cpus` limits.
- **Healthcheck** so orchestrators know when the container is actually ready vs merely started.

## Step 4 — Compose for local multi-service dev

Compose is for **local development and small single-host stacks** — not production scheduling
(that's Kubernetes; see the `kubernetes` section). Use it to wire app + db + cache together.

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://app:app@db:5432/app
    depends_on:
      db:
        condition: service_healthy      # wait for readiness, not just "created"
    develop:
      watch:                            # live sync/rebuild on source change
        - action: sync
          path: ./src
          target: /app/src
  db:
    image: postgres:16-slim
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 10
volumes:
  pgdata:
```

- `depends_on` alone only orders *start*, not *readiness* — gate on `condition: service_healthy`.
- Named **volumes** for stateful data (never bind-mount a DB's data dir on macOS/Windows — slow
  and corruption-prone). Bind-mount **source** for live reload; use `develop.watch` for
  sync/rebuild.
- Keep secrets in a git-ignored `.env` (Compose reads it automatically) or `secrets:`; never
  commit real credentials.
- The Compose spec no longer needs a top-level `version:` key — omit it.

## Step 5 — Verify (size, security, correctness)

- **Size:** `docker images` before/after; `docker history <img>` to find the fat layer;
  `dive <img>` to inspect wasted space. Target: runtime image carries the artifact and its
  runtime deps, nothing else.
- **Scan:** `docker scout cves <img>` or `trivy image <img>` for CVEs; fix by bumping the base or
  the offending package. Rebuild on a schedule — CVEs land in bases you already shipped.
- **Reproducibility:** the build succeeds from a clean checkout with the pinned base, no host
  state.
- **Runtime:** starts as non-root (`docker exec … id`), healthcheck goes healthy, handles
  `SIGTERM` (stops in <10s, not killed at the timeout), and the app actually serves.
- **Multi-arch** if it'll run on arm64 (Apple silicon, Graviton) and amd64: build with
  `docker buildx build --platform linux/amd64,linux/arm64 --push`.

## Standing rules

- Multi-stage always; ship the artifact, not the toolchain.
- Small pinned base, non-root user, exec-form entrypoint, healthcheck, `.dockerignore`.
- Secrets at runtime or via BuildKit secrets — never in `ENV`/`ARG`/layers.
- Order layers cheap→expensive→volatile so the cache survives code edits.
- One concern per image; Compose for local, Kubernetes for prod.
- Re-scan and rebuild bases regularly; pin by digest for reproducibility.

## Related

- `devkit:kubernetes` — running these images in production (deployments, probes, resources,
  config/secrets). The image's `HEALTHCHECK`, non-root user, and `SIGTERM` handling are exactly
  what K8s liveness/readiness probes and graceful termination depend on.
- `devkit:cloud-infrastructure` — building/scanning images in CI, pushing to a registry, and IaC
  around the cluster.

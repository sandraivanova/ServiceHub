# 3. CI pipeline: push → build → push image to a registry (20%)

File: `.github/workflows/ci-cd.yml`.

## What it does

On every push to `main`: builds the backend and frontend Docker images
(the same two Dockerfiles from `docs/01-dockerization.md`) and pushes both
to Docker Hub, tagged two ways:

- `latest` — always the most recent build
- `<commit-sha>` — an immutable tag for that exact commit, so any past
  build can be pulled back by its exact SHA if needed

On a pull request targeting `main`: the images are **built but not
pushed** (`push: ${{ github.event_name != 'pull_request' }}`) — a sanity
check that the Dockerfiles still build cleanly, without publishing
untested images.

## Why two separate jobs

`build-and-push-backend` and `build-and-push-frontend` are independent
jobs, not steps in one job. GitHub Actions runs independent jobs in
parallel by default, so both images build at the same time rather than
one after the other — and a failure in one doesn't stop the other from
finishing.

## One-time setup: Docker Hub credentials

The workflow needs two **repository secrets** (Settings → Secrets and
variables → Actions → New repository secret):

- `DOCKERHUB_USERNAME` — your Docker Hub username
- `DOCKERHUB_TOKEN` — a Docker Hub **access token**, not your account
  password. Create one at hub.docker.com → Account Settings → Security →
  New Access Token (choose "Read & Write" scope).

Without these, `docker/login-action` fails and nothing gets pushed - the
build-only path (pull requests) still works without them.

## Reading the workflow file

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

Two triggers, two different behaviors handled by the same jobs (see
"What it does" above) via one `if:` condition per push-only step.

```yaml
- uses: docker/build-push-action@v6
  with:
    context: .
    file: docker/backend.Dockerfile
    push: ${{ github.event_name != 'pull_request' }}
    tags: |
      ${{ secrets.DOCKERHUB_USERNAME }}/servicehub-backend:latest
      ${{ secrets.DOCKERHUB_USERNAME }}/servicehub-backend:${{ github.sha }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

- `context: .` — build context is the repo root, same reason as in
  `docs/01-dockerization.md` (npm workspaces monorepo).
- `cache-from`/`cache-to: type=gha` — caches Docker build layers in
  GitHub's Actions cache between runs, so a push that only changes, say,
  frontend code doesn't force a full from-scratch backend image rebuild
  the next time both jobs run.

## After a push: where the images end up

`docker.io/<your-dockerhub-username>/servicehub-backend:latest` and
`docker.io/<your-dockerhub-username>/servicehub-frontend:latest` — these
are exactly the image references the Kubernetes Deployments in `k8s/`
need (see `docs/04-kubernetes-deployment-configmap-secret.md`), replacing
the `REPLACE_WITH_DOCKERHUB_USERNAME` placeholder with your real
username.

## Scope note: no deployment step

This pipeline stops at "image pushed to a registry" - it does not deploy
anywhere automatically. That's deliberate: an automatic CD step to a live
environment needs an always-on cluster and stored credentials, which is
more infrastructure than a course project's local Kubernetes demo (see
`docs/08-kubernetes-namespace-demo.md`) needs. Deploying is a manual
`kubectl apply -f k8s/` against whatever cluster you're demoing on.

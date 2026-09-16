# ServiceHub — CI/CD Project

One file explaining how everything fits together and how to run it. For
the full reasoning behind each decision (rubric mapping, why things are
built the way they are), see the numbered files in [`docs/`](./docs) —
this file is the map; `docs/` is the territory.

## The app, in one paragraph

ServiceHub is a service-exchange web app (offer a service, request one,
leave a review). It's an npm-workspaces monorepo with an **Angular
frontend**, a **NestJS backend**, and two data stores the backend depends
on: **MySQL** (the actual database) and **Redis** (job queue + cache).
Everything below is about packaging those four pieces — building them
into images, running them together locally, shipping new versions
automatically, and running them on Kubernetes.

## How everything is connected

```
                          ┌─────────────────────────────────────┐
                          │              browser                │
                          └───────────────┬───────────────────────┘
                                           │  one origin, always
                                           ▼
                    ┌──────────────────────────────────────┐
                    │   nginx  (frontend container/pod)      │
                    │   - serves the built Angular app       │
                    │   - proxies  /api/*  ───────────┐       │
                    └──────────────────────────────────┼───────┘
                                                        ▼
                                       ┌─────────────────────────┐
                                       │   backend (NestJS)       │
                                       │   routes prefixed /api   │
                                       └──────────┬───────┬───────┘
                                                  │       │
                                     Sequelize    │       │  BullMQ /
                                     (SQL)         │       │  cache-manager
                                                  ▼       ▼
                                     ┌─────────┐   ┌─────────┐
                                     │  MySQL  │   │  Redis  │
                                     └─────────┘   └─────────┘
```

The one design decision that makes this whole diagram possible: the
**frontend never hardcodes a backend hostname**. It calls relative
`/api/...` paths, and whatever is serving the frontend (nginx in a
container, or the Kubernetes Ingress) is responsible for routing `/api`
requests to the backend. That's what lets the *exact same* frontend
build run unmodified under plain Docker Compose and under Kubernetes —
covered in [`docs/01-dockerization.md`](./docs/01-dockerization.md).

## What each top-level thing is

| Path | What it is |
|---|---|
| `packages/` | The actual app source (frontend, backend, shared models) — unchanged by this project except for a handful of necessary bugfixes, listed below. |
| `docker/` | `Dockerfile`s that turn `packages/backend` and `packages/frontend` into container images, plus the nginx config the frontend image runs. |
| `docker-compose.yml` + `.env.example` | Runs all four services (mysql, redis, backend, frontend) together on one machine, wired up over one Docker network. This is "run it locally." |
| `.github/workflows/ci-cd.yml` | On every push to `main`: builds both images and pushes them to Docker Hub. This is "ship a new version automatically." |
| `k8s/` | Kubernetes manifests — the same four services, described declaratively so a cluster can run them. This is "run it in production-like infrastructure." |
| `docs/` | One file per graded item, explaining the *why* behind each piece in depth. |

Docker Compose and Kubernetes are **two separate ways of running the same
four containers** — not a pipeline where one feeds the other. You'd
normally use Compose locally while developing, and Kubernetes for an
actual deployment/demo. The CI pipeline feeds *both*: it produces the
images that either one then runs.

## How to start it

### Option A — Docker Compose (simplest, one machine)

```bash
cp .env.example .env        # then edit .env with real values
docker compose up --build

# first time only, once mysql is up: create the database schema
docker compose exec -e NODE_ENV=development backend sh -c \
  "cd /app/packages/models && npx sequelize-cli db:migrate"
```

- Frontend: http://localhost:8080
- Backend directly (mostly for debugging): http://localhost:3000/api/...

Full walkthrough, including what every setting means and a couple of
real gotchas hit while testing this: [`docs/02-docker-compose.md`](./docs/02-docker-compose.md).

### Option B — Kubernetes (a real cluster, local or otherwise)

```bash
minikube start --driver=docker
minikube addons enable ingress

# build + load the images directly (skip the registry for a quick demo)
docker build -f docker/backend.Dockerfile  -t servicehub-backend:local  .
docker build -f docker/frontend.Dockerfile -t servicehub-frontend:local .
minikube image load servicehub-backend:local
minikube image load servicehub-frontend:local

kubectl apply -f k8s/
kubectl set image deployment/backend  backend=servicehub-backend:local   -n servicehub
kubectl set image deployment/frontend frontend=servicehub-frontend:local -n servicehub
kubectl patch deployment backend  -n servicehub -p '{"spec":{"template":{"spec":{"containers":[{"name":"backend","imagePullPolicy":"Never"}]}}}}'
kubectl patch deployment frontend -n servicehub -p '{"spec":{"template":{"spec":{"containers":[{"name":"frontend","imagePullPolicy":"Never"}]}}}}'

# first time only, once mysql-0 is ready: create the database schema
kubectl wait --for=condition=ready pod -l app=mysql -n servicehub --timeout=120s
kubectl exec -n servicehub deploy/backend -- sh -c \
  "cd /app/packages/models && NODE_ENV=development npx sequelize-cli db:migrate"
```

Then either add `servicehub.local` to `/etc/hosts` and browse to it, or
`kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller
8888:80` and curl it with `-H "Host: servicehub.local"`. Full walkthrough
(including the "images already on Docker Hub" path, once the CI pipeline
has pushed some) and every command explained:
[`docs/08-kubernetes-namespace-demo.md`](./docs/08-kubernetes-namespace-demo.md).

### Option C — let CI build the images

Push to `main` on GitHub (with `DOCKERHUB_USERNAME`/`DOCKERHUB_TOKEN`
repo secrets set) and `.github/workflows/ci-cd.yml` builds and pushes
both images automatically. Then in `k8s/32-backend-deployment.yaml` and
`k8s/40-frontend-deployment.yaml`, replace
`REPLACE_WITH_DOCKERHUB_USERNAME` with the real username, and `kubectl
apply -f k8s/` pulls them normally — no local build/load step needed.
Details: [`docs/03-ci-cd-pipeline.md`](./docs/03-ci-cd-pipeline.md).

## What each `docs/` file means

| File | Covers |
|---|---|
| [`00-overview.md`](./docs/00-overview.md) | The rubric-to-file mapping and the three decisions worth being able to explain unprompted. |
| [`01-dockerization.md`](./docs/01-dockerization.md) | Both Dockerfiles line by line, and why the backend runs via `ts-node` instead of a compiled build. |
| [`02-docker-compose.md`](./docs/02-docker-compose.md) | Every setting in `docker-compose.yml`, the healthcheck/startup ordering, and the migration step. |
| [`03-ci-cd-pipeline.md`](./docs/03-ci-cd-pipeline.md) | The GitHub Actions workflow, and the one-time Docker Hub secret setup. |
| [`04-kubernetes-deployment-configmap-secret.md`](./docs/04-kubernetes-deployment-configmap-secret.md) | Backend Deployment + why config is split into a ConfigMap and a Secret. |
| [`05-kubernetes-service.md`](./docs/05-kubernetes-service.md) | What a Service does and why both app Services are `ClusterIP`. |
| [`06-kubernetes-ingress.md`](./docs/06-kubernetes-ingress.md) | The single entry point, path-based routing, and why there's no path rewriting. |
| [`07-kubernetes-statefulset-database.md`](./docs/07-kubernetes-statefulset-database.md) | Why MySQL is a StatefulSet and Redis deliberately isn't. |
| [`08-kubernetes-namespace-demo.md`](./docs/08-kubernetes-namespace-demo.md) | The namespace, and the exact commands to stand the whole thing up and prove it works. |

## Bugs fixed along the way (not Docker/K8s issues themselves)

Getting the app to actually *run* in a container surfaced a handful of
pre-existing issues in the app itself — each one blocked the app from
starting or building at all, in any environment, not just a containerized
one. Fixed because without them nothing else here could be demonstrated;
explained in full in `docs/01-dockerization.md` and
`docs/02-docker-compose.md`:

1. Frontend called `http://localhost:3000/api/...` directly → changed to
   relative `/api/...` (see "How everything is connected" above).
2. A TypeScript type error in `email.ts` blocked the backend build.
3. A missing `express-handlebars` dependency crashed the backend on
   startup.
4. Angular's production build failed its own style-size budget check —
   the budget was relaxed to fit the app's actual size.
5. A migration created a table named `User` while everything else in the
   codebase (including the Sequelize model) expected lowercase `user` —
   fixed the one outlier.

## A note on the placeholder secrets

Everything in `k8s/*-secret.yaml` and `.env.example` is a clearly-labeled
placeholder (`changeme-...`) meant for a local demo. Real credentials
should never be committed — see the "demo-only caveat" notes in
`docs/04-kubernetes-deployment-configmap-secret.md` and
`docs/07-kubernetes-statefulset-database.md` for what a real deployment
would do instead.

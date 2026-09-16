# ServiceHub — CI/CD Project Overview

This is the reference implementation of everything the KIIS ("Континуирана
интеграција и испорака") project rubric asks for, built on top of the
existing ServiceHub app. Read this file first — it explains the app itself
and how the pieces fit together; each other file in `docs/` covers one
graded rubric item in depth.

## What ServiceHub is

A service-exchange web app: users can offer services ("giving services"),
request services from others, and leave reviews. Three workspace packages
make up the running app:

- **`packages/backend`** — a NestJS API (auth, users, giving-services,
  request-services, reviews), using MySQL (via Sequelize) for data and
  Redis (via BullMQ) for background email jobs.
- **`packages/frontend`** — an Angular single-page app that talks to the
  backend's REST API.
- **`packages/models`** and **`packages/shared`** — internal TypeScript
  packages (Sequelize models, shared interfaces) used by the backend and
  frontend. They're not separately deployed services; they get compiled
  into the backend/frontend at build time.

Plus two infrastructure services the backend depends on:

- **MySQL** — the actual database.
- **Redis** — job queue + cache. Not a graded rubric item by itself, but
  the backend won't start without it.

That's the "at least three services, one of them a database" the
assignment asks for: **frontend, backend, MySQL** (plus Redis, which comes
along for the ride).

## How the pieces map to the rubric

| # | File(s) | What it is |
|---|---|---|
| 1 | [`01-dockerization.md`](./01-dockerization.md) | Dockerizing the app (10%) |
| 2 | [`02-docker-compose.md`](./02-docker-compose.md) | Orchestrating with Docker Compose (10%) |
| 3 | [`03-ci-cd-pipeline.md`](./03-ci-cd-pipeline.md) | CI pipeline: push → build → push image (20%) |
| 4 | [`04-kubernetes-deployment-configmap-secret.md`](./04-kubernetes-deployment-configmap-secret.md) | K8s Deployment + ConfigMap/Secret (10%) |
| 5 | [`05-kubernetes-service.md`](./05-kubernetes-service.md) | K8s Service (10%) |
| 6 | [`06-kubernetes-ingress.md`](./06-kubernetes-ingress.md) | K8s Ingress (10%) |
| 7 | [`07-kubernetes-statefulset-database.md`](./07-kubernetes-statefulset-database.md) | K8s StatefulSet for the database + ConfigMap/Secret (10%) |
| 8 | [`08-kubernetes-namespace-demo.md`](./08-kubernetes-namespace-demo.md) | Namespace + live demo (10%) |

(The "public git repo" 10% isn't a file here — it's just where you push
this code.)

## Where everything lives

```
docker/                     Dockerfiles + nginx config
docker-compose.yml           Compose orchestration
.env.example                 Template for the real .env (gitignored)
.github/workflows/ci-cd.yml  CI pipeline
k8s/                         Kubernetes manifests, numbered in apply order
docs/                        You are here
```

## A few decisions worth being able to explain

These came up while building this out and are exactly the kind of thing
worth knowing cold before a defense:

1. **The frontend used to hardcode `http://localhost:3000/api/...`.**
   That only works when both frontend and backend happen to run on the
   same machine as the browser. It was changed to relative `/api/...`
   requests so the same frontend build works unmodified behind Docker
   Compose *or* a Kubernetes Ingress — see `01-dockerization.md`.
2. **The backend runs via `ts-node`, not a compiled build**, inside its
   Docker image — same as the app's own `npm run start:dev` already
   does. The reason is explained in `01-dockerization.md`: the
   monorepo's compiled-build output path (`build/src/main.js`) turned
   out to already be broken before any of this work started, for
   reasons unrelated to Docker.
3. **Two small pre-existing bugs had to be fixed** for the app to run
   at all in a container (a TypeScript type error in `email.ts`, and a
   missing `express-handlebars` dependency). Neither is Docker/K8s
   related — they're called out here so it's clear they were
   pre-existing, not something introduced by containerizing the app.

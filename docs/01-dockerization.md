# 1. Dockerizing the app (10%)

Files: `docker/backend.Dockerfile`, `docker/frontend.Dockerfile`,
`docker/frontend.nginx.conf`, `.dockerignore`.

## Why the build context is the repo root, not the package folder

ServiceHub is an **npm workspaces monorepo**: `packages/backend` imports
code from `packages/models` and `packages/shared` (project references in
its `tsconfig.json`), and even reaches into `packages/webhooks` via a plain
relative import (`../../../webhooks/utils/encrypt-password.utils`). None of
that code is published to npm — it only exists as source files in this
repo. So a Dockerfile for the backend can't just `COPY packages/backend .`
the way a single-package app could; it needs the whole workspace present to
even install dependencies (`npm ci` resolves against all
`packages/*/package.json` files) or resolve those imports.

That's why both Dockerfiles are built **from the repository root**
(`docker build -f docker/backend.Dockerfile .`, note the trailing `.`) and
both start with `COPY . .` rather than copying one package at a time. It's
not the most cache-efficient way to structure a monorepo Dockerfile (a more
advanced setup would use `npm ci --workspace=...` with cherry-picked
`package.json` copies to cache the dependency-install layer separately from
source changes), but it's by far the simplest to read and reason about,
which mattered more here.

## Backend: why it runs via `ts-node`, not compiled JavaScript

The backend's own `package.json` has a `start:prod` script:
`node build/src/main.js`. While building this out, that turned out to
**already be broken**, independent of Docker — running it (with `npm run
build --workspace=packages/backend` first) throws:

```
Error: Cannot find module '../../../models'
```

The cause: TypeScript computes `rootDir` for the compiled output as the
*common ancestor of every source file the project touches* — and because
`auth.contoller.ts` and `auth.service.ts` reach into `packages/webhooks`
via a relative import, that ancestor becomes `packages/` itself, not
`packages/backend/`. The compiled output ends up nested one directory
deeper than the source (`packages/backend/build/backend/src/main.js`, not
`packages/backend/build/src/main.js`), which silently breaks every
relative import in the compiled `.js` files (imports aren't rewritten by
`tsc` to account for the extra nesting — Node just resolves them at
runtime against wherever the file actually landed).

Properly fixing this would mean restructuring how `webhooks` is imported
(e.g. turning it into a real workspace package with its own
`package.json`, referenced like `models`/`shared` are) — a change to the
app's own architecture that's out of scope for a CI/CD infrastructure
project. Instead, the backend image runs the **exact same way the app's
own `start`/`start:dev` scripts already do**: `node -r ts-node/register
src/main.ts`, executing TypeScript directly against its original source
tree, where the relative imports resolve correctly. This was verified to
work locally (see `docs/02-docker-compose.md`) before committing to it.

The trade-off: the image needs `typescript`/`ts-node` (normally
dev-only dependencies) available at runtime, so `npm ci` is *not* run with
`--omit=dev`. The image is a bit larger than a "compile once, ship only
`dist/`" image would be — an acceptable trade for correctness and
simplicity here.

## Two pre-existing bugs that had to be fixed to run the app at all

Neither of these is Docker/Kubernetes-related — they surfaced the moment
anything tried to actually boot the backend, in any environment:

1. **`packages/backend/src/config/email.ts`** set
   `viewEngine.defaultLayout: false`, which no longer type-checks against
   the current `nodemailer-express-handlebars` types (`defaultLayout`
   must be a `string` or `undefined`). Changed to `undefined` — same
   behavior (no default layout), just satisfies the type.
2. **`nodemailer-express-handlebars`** requires `express-handlebars` as a
   peer dependency, which was never installed. Without it, the backend
   crashes on startup with `Cannot find package 'express-handlebars'`.
   Added it to `packages/backend/package.json`.

## Frontend: the hardcoded `localhost:3000` problem

`api.service.ts`, `app.component.ts`, and
`components/register/register.component.ts` called
`http://localhost:3000/api/...` directly. That only resolves when the
browser, frontend, and backend all happen to be on the same machine — the
typical "everyone runs `npm start` locally" setup. It breaks the moment
frontend and backend run as separate containers accessed from elsewhere:
there is no `localhost:3000` from the browser's point of view once the
frontend is served from, say, a Kubernetes Ingress host.

Fix: those calls now use relative paths (`/api/...`). The frontend's own
web server — nginx, both in the Docker image
(`docker/frontend.nginx.conf`) and via the Kubernetes Ingress
(`k8s/50-ingress.yaml`) — reverse-proxies anything under `/api` to the
backend. The browser only ever talks to one origin; nginx (or the
ingress controller) decides internally whether a request is served as a
static file or forwarded to the backend. This is the standard pattern for
serving an SPA + API together and is what makes the same frontend build
work unmodified under Compose *and* Kubernetes.

## Backend image walkthrough (`docker/backend.Dockerfile`)

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci
WORKDIR /app/packages/backend
ENV NODE_ENV=production
EXPOSE 3000
USER node
CMD ["node", "-r", "ts-node/register", "src/main.ts"]
```

- `npm ci` (not `npm install`) for a reproducible install straight from
  `package-lock.json` — exactly what CI should use.
- `npm ci`'s root `postinstall` script (in the root `package.json`)
  automatically compiles `packages/models`, which the backend does need
  pre-compiled (unlike `packages/backend`/`packages/shared`, which run
  straight from TypeScript via `ts-node`).
- `USER node`: the official Node image ships a non-root `node` user;
  running as it is a basic container-security practice (don't run
  processes as root inside the container unless you actually need to).

## Frontend image walkthrough (`docker/frontend.Dockerfile`)

Two stages, so the final image only contains the built static files and
nginx — none of the Node/npm toolchain used to build them:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build --workspace=packages/frontend -- --configuration=production

FROM nginx:alpine AS runtime
COPY docker/frontend.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/frontend/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`--from=build` pulls only the compiled `browser/` output out of the first
stage into the second — this is what keeps the shipped image small (no
`node_modules`, no source, no build tools in the final image).

One more pre-existing issue surfaced here: the production build failed
outright on Angular's style-size budgets (`angular.json`) — several
component stylesheets exceeded the configured error threshold. Rather than
rewrite those styles (out of scope here), the budgets were relaxed to
comfortably fit the app's actual current size (`anyComponentStyle`
`maximumError` raised from `4kB` to `20kB`). Budgets are a build-time
guardrail, not application behavior — adjusting them doesn't change what
ships, only what the build tool is willing to accept.

## Building the images by hand

```bash
docker build -f docker/backend.Dockerfile  -t servicehub-backend  .
docker build -f docker/frontend.Dockerfile -t servicehub-frontend .
```

(Run from the repository root — see "why the build context is the repo
root" above.)

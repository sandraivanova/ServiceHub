# 4. Kubernetes Deployment + ConfigMap/Secret (10%)

Files: `k8s/30-backend-configmap.yaml`, `k8s/31-backend-secret.yaml`,
`k8s/32-backend-deployment.yaml` (application logic); also
`k8s/40-frontend-deployment.yaml` (the frontend half of "the app", no
config of its own — see below).

## Why config is split into a ConfigMap *and* a Secret

Both hold environment variables the backend reads at startup (matching
the full list in `.env.example` — see `docs/02-docker-compose.md`), but
they're split by sensitivity:

- **`backend-config`** (ConfigMap): `PORT`, `DB_HOST`, `DB_PORT`,
  `DB_DATABASE`, `REDIS_HOST`, `REDIS_PORT`, `NODEMAILER_SERVICE` — none
  of this is secret; a hostname or port number leaking in a `kubectl
  describe` output or a log line isn't a security problem.
- **`backend-secret`** (Secret): `DB_USERNAME`, `DB_PASSWORD`,
  `REDIS_PASSWORD`, the four JWT-signing secrets, `HASH_SALT`, and the
  mail credentials — everything that would matter if leaked. Kubernetes
  Secrets get slightly different handling than ConfigMaps (base64-encoded
  rather than plain text, and RBAC can restrict who's allowed to `get`
  them), so this is worth keeping as a real distinction even though both
  ultimately land as environment variables in the same container.

The Deployment pulls in both with `envFrom`:

```yaml
envFrom:
  - configMapRef:
      name: backend-config
  - secretRef:
      name: backend-secret
```

`envFrom` injects every key in the map as an environment variable, named
after the key — no need to list each one individually the way a `env:`
block with per-variable `valueFrom` would require. (`k8s/21-redis-deployment.yaml`
uses the narrower per-variable form instead, since it only needs the one
`REDIS_PASSWORD` value out of a Secret it doesn't own — see
`docs/07-kubernetes-statefulset-database.md`.)

**Demo-only caveat**, called out in the file itself: `stringData` in
`k8s/31-backend-secret.yaml` is plain, committed-to-git text. Kubernetes
Secrets are base64-*encoded*, not encrypted, by default — fine for a
local course demo, but a real deployment would source these from
something like Sealed Secrets, SOPS, or a cloud provider's secret
manager, never committed as-is.

## The Deployment itself

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: servicehub
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: REPLACE_WITH_DOCKERHUB_USERNAME/servicehub-backend:latest
          ports:
            - containerPort: 3000
          envFrom: [...]
          readinessProbe:
            httpGet:
              path: /api/api/test
              port: 3000
          livenessProbe:
            httpGet:
              path: /api/api/test
              port: 3000
```

A Deployment (vs. a bare Pod) is what gives this a ReplicaSet underneath —
if the pod crashes or the node it's on goes away, Kubernetes creates a
replacement automatically. `replicas: 1` is enough for a demo; bumping it
is a one-line change (the Service in front of it, covered in
`docs/05-kubernetes-service.md`, already load-balances across however many
replicas exist).

**The probe path is `/api/api/test`, not `/api/test`** — a real,
pre-existing quirk in the app: `AppController` has `@Controller('api')`
*and* `main.ts` separately calls `app.setGlobalPrefix('api')`, so its
routes stack both prefixes. Every other controller only has its own
prefix (`auth`, `users`, ...), so this only affects `AppController`'s
routes specifically. Left as-is rather than "fixed", since it doesn't
break anything - it's just a real behavior the probes have to match.

**Image placeholder**: `REPLACE_WITH_DOCKERHUB_USERNAME` needs to become
whatever Docker Hub account the CI pipeline
(`docs/03-ci-cd-pipeline.md`) pushes to, in both
`32-backend-deployment.yaml` and `40-frontend-deployment.yaml`.

## The frontend Deployment has no ConfigMap/Secret of its own

`k8s/40-frontend-deployment.yaml` is a Deployment with no config
attached — by design. The frontend is a static build with no
server-side configuration: it doesn't know or care what host it's
served from, because (per `docs/01-dockerization.md`) it only ever makes
relative `/api/...` requests, which the Ingress
(`docs/06-kubernetes-ingress.md`) routes to the backend. There's nothing
to put in a ConfigMap.

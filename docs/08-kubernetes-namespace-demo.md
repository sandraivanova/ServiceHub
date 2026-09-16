# 8. Namespace + live demo (10%)

File: `k8s/00-namespace.yaml`. This file walks through actually running
the whole thing on a local cluster - the steps below are exactly what was
run to verify every other doc in this folder.

## The namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: servicehub
```

Every other manifest in `k8s/` sets `namespace: servicehub`. One
namespace per app is what makes `kubectl get all -n servicehub` show the
whole thing at a glance, and `kubectl delete namespace servicehub` tear
it all down in one command - useful both for the actual grading
requirement ("run it in its own namespace") and just for iterating while
building this.

## Getting a local cluster

Either `minikube` or `kind` works - the manifests are plain Kubernetes
YAML with nothing cloud- or tool-specific in them. These steps use
**minikube**, since that's what this was actually tested against.

```bash
minikube start --driver=docker
minikube addons enable ingress
```

Wait for the ingress controller to actually be ready before applying
anything that depends on it (it can take a minute after `addons enable`):

```bash
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

## Getting the images into the cluster

Two options:

**A. Images from Docker Hub** (what a real deploy would do, after
`docs/03-ci-cd-pipeline.md`'s pipeline has pushed them at least once):
edit `k8s/32-backend-deployment.yaml` and
`k8s/40-frontend-deployment.yaml`, replacing
`REPLACE_WITH_DOCKERHUB_USERNAME` with the real Docker Hub username. No
further steps needed - `kubectl apply` will pull them normally.

**B. Locally-built images, no registry round-trip** (faster for
iterating, or for a fully offline demo): build them exactly as in
`docs/01-dockerization.md`, then load them directly into the cluster's
own image store and point the Deployments at the local tag:

```bash
docker build -f docker/backend.Dockerfile  -t servicehub-backend:local  .
docker build -f docker/frontend.Dockerfile -t servicehub-frontend:local .
minikube image load servicehub-backend:local
minikube image load servicehub-frontend:local

kubectl apply -f k8s/
kubectl set image deployment/backend  backend=servicehub-backend:local   -n servicehub
kubectl set image deployment/frontend frontend=servicehub-frontend:local -n servicehub
kubectl patch deployment backend  -n servicehub -p \
  '{"spec":{"template":{"spec":{"containers":[{"name":"backend","imagePullPolicy":"Never"}]}}}}'
kubectl patch deployment frontend -n servicehub -p \
  '{"spec":{"template":{"spec":{"containers":[{"name":"frontend","imagePullPolicy":"Never"}]}}}}'
```

`imagePullPolicy: Never` is what stops Kubernetes from trying (and
failing) to pull a `:local` tag from a real registry - it tells it to use
only what's already loaded into the cluster's image store.

**Tip if an image pull hangs or fails** (this happened once while
testing - `mysql:8.4` timed out pulling from inside the cluster on a slow
connection): if you already have the image locally (`docker images`),
`minikube image load <image>:<tag>` loads it directly, skipping the
network pull entirely.

## Applying everything

```bash
kubectl apply -f k8s/
```

`kubectl` applies every file in the directory. The numeric filename
prefixes (`00-`, `10-`, `11-`, ...) exist purely for a human reading the
folder top-to-bottom in a sensible order (namespace, then database, then
cache, then backend, then frontend, then ingress) - `kubectl apply -f
k8s/` doesn't require that order (it will happily create a Deployment
before the Secret it references exists; the pod just waits/retries until
the Secret shows up, which happens moments later in the same apply).

## First-run database migrations

Same reason as `docs/02-docker-compose.md`: the schema doesn't create
itself.

```bash
kubectl wait --for=condition=ready pod -l app=mysql -n servicehub --timeout=120s
kubectl exec -n servicehub deploy/backend -- sh -c \
  "cd /app/packages/models && NODE_ENV=development npx sequelize-cli db:migrate"
```

## Proving it works

```bash
kubectl get all -n servicehub
```

should show `mysql-0` (StatefulSet pod), `redis`, `backend`, `frontend`
Deployments all `Running`/`Ready`, and the four Services.

To actually hit it through the Ingress, add the host to `/etc/hosts`
pointing at the cluster's ingress address:

```bash
echo "$(minikube ip) servicehub.local" | sudo tee -a /etc/hosts
```

Then open `http://servicehub.local` in a browser - full app, frontend and
API both served through the one Ingress.

**On macOS/Windows with the `docker` driver**, the minikube node IP isn't
directly reachable from the host, so `minikube ip` alone won't work for
the `/etc/hosts` trick above - use `minikube tunnel` in a separate
terminal (routes `127.0.0.1` to the cluster, needs `sudo`) and point
`/etc/hosts` at `127.0.0.1` instead. As a lighter-weight alternative for
just proving the routing itself works, without touching `/etc/hosts` at
all:

```bash
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8888:80
curl -H "Host: servicehub.local" http://localhost:8888/
curl -H "Host: servicehub.local" http://localhost:8888/api/api/test
```

This exact sequence - apply, migrate, port-forward, curl both routes,
then a real sign-up POST end-to-end into MySQL - was run to verify
everything in this `docs/` folder actually works, not just that the YAML
is syntactically valid.

## Tearing down

```bash
kubectl delete namespace servicehub
minikube stop
```

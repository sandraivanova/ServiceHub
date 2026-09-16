# 6. Kubernetes Ingress (10%)

File: `k8s/50-ingress.yaml`.

## What it's for

Two `ClusterIP` Services (`docs/05-kubernetes-service.md`) means nothing
is reachable from outside the cluster yet. An **Ingress** is the object
that says "requests coming in from outside, on this hostname/path, go to
that Service" - it needs an *ingress controller* actually running in the
cluster to do anything (here, `ingress-nginx`; see
`docs/08-kubernetes-namespace-demo.md` for installing it on a local
cluster).

## The manifest

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: servicehub
  namespace: servicehub
spec:
  ingressClassName: nginx
  rules:
    - host: servicehub.local
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend
                port:
                  number: 3000
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 80
```

One host (`servicehub.local`), two path rules. `ingress-nginx`
automatically evaluates the more specific path first regardless of
listed order, so `/api/...` requests hit the `backend` Service and
everything else falls through to `frontend`.

## Same routing rule as the Docker Compose setup, enforced differently

This is deliberately the exact same split `docker/frontend.nginx.conf`
implements for Docker Compose (`docs/01-dockerization.md`,
`docs/02-docker-compose.md`) - `/api` to the backend, everything else to
the frontend. The difference is *where* the routing decision happens:

- **Compose**: nginx running *inside* the frontend container makes the
  call.
- **Kubernetes**: the ingress-nginx controller makes the call *before*
  traffic reaches either pod - a request for `/api/...` never touches the
  frontend pod at all.

Both exist because each environment needs its own entry point; neither is
redundant given the other.

## No path rewriting

Some Ingress setups strip the `/api` prefix before forwarding (via a
`rewrite-target` annotation) so the backend sees clean paths. This one
deliberately does **not** do that: the backend itself expects requests at
`/api/...` (`app.setGlobalPrefix('api')` in
`packages/backend/src/main.ts`), so the prefix has to survive the trip.
Adding a rewrite here would have silently broken every backend route.

## `servicehub.local`

This hostname doesn't exist in real DNS - it only resolves on whatever
machine adds it to `/etc/hosts` pointing at the cluster's ingress
address. That one-line setup step (and the exact address to use for a
local `kind`/`minikube` cluster) is in
`docs/08-kubernetes-namespace-demo.md`, alongside the live demo steps.

## Verified

Tested against a real local cluster with both routes live at once (see
`docs/08-kubernetes-namespace-demo.md` for the full walkthrough): a
request to `/` returned the Angular app's `index.html`, and a request to
`/api/...` - including a full sign-up POST that writes to MySQL - was
routed to the backend and returned a real response, both through the
same Ingress host.

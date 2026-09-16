# 5. Kubernetes Service (10%)

Files: `k8s/33-backend-service.yaml`, `k8s/41-frontend-service.yaml`
(application services); `k8s/13-mysql-service.yaml`,
`k8s/22-redis-service.yaml` (supporting services, covered in
`docs/07-kubernetes-statefulset-database.md`).

## What a Service is for

Pods are disposable - a Deployment can kill and recreate one at any time
(a crash, a rollout, a reschedule), and each new pod gets a new internal
IP address. Nothing else in the cluster should ever talk to a pod by that
IP directly. A **Service** is a stable name + IP that sits in front of a
group of pods (selected by label) and load-balances traffic across
whichever of them currently exist and are ready.

## `backend` and `frontend`: both plain `ClusterIP`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: servicehub
spec:
  selector:
    app: backend
  ports:
    - port: 3000
      targetPort: 3000
```

`ClusterIP` (the default type when `type:` is omitted) means: reachable
only from inside the cluster, not from outside. That's exactly right for
both:

- **`backend`** is only ever called by the frontend's nginx proxy and by
  the Ingress (`docs/06-kubernetes-ingress.md`) - never directly from a
  browser.
- **`frontend`** is only ever called by the Ingress, which is the one
  thing that's actually exposed outside the cluster.

Neither needs a `NodePort` or `LoadBalancer` Service type - those exist
specifically to expose something *outside* the cluster, and here the
Ingress already owns that job for both, in one place, with proper
host/path routing instead of two separate raw ports.

## How the selector connects a Service to its pods

```
Service "backend"  --selector: app: backend-->  any pod labeled app: backend
```

The Deployment's pod template carries the matching label:

```yaml
# k8s/32-backend-deployment.yaml
template:
  metadata:
    labels:
      app: backend
```

This is why the Service and the Deployment it fronts are two separate
objects with matching labels rather than one combined resource - the
Service doesn't care *how* the pods it selects came to exist (a
Deployment here; could equally be a bare ReplicaSet, or in MySQL's case a
StatefulSet), it just watches for anything with that label.

## Verified

Confirmed working end-to-end on a local cluster (see
`docs/08-kubernetes-namespace-demo.md`): a request sent to the frontend
Service's port reached nginx; a request sent to `http://backend:3000` from
inside the frontend's pod (via nginx's `proxy_pass`) correctly reached the
backend pod and returned a response from the actual NestJS app.

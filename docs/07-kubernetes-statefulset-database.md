# 7. Kubernetes StatefulSet for the database + ConfigMap/Secret (10%)

Files: `k8s/10-mysql-configmap.yaml`, `k8s/11-mysql-secret.yaml`,
`k8s/12-mysql-statefulset.yaml`, `k8s/13-mysql-service.yaml`. Also
`k8s/20-redis-secret.yaml`, `k8s/21-redis-deployment.yaml`,
`k8s/22-redis-service.yaml` for Redis, which deliberately does **not**
use a StatefulSet - see the comparison below.

## Why a StatefulSet for MySQL, and not a Deployment

A Deployment's pods are interchangeable: if one dies, a replacement
appears with a fresh identity and, unless you manually wire up shared
storage, no guarantee it's looking at the same data as before. That's
fine for a stateless API - it's wrong for a database. A **StatefulSet**
gives each pod:

- **A stable identity** (`mysql-0`, and `mysql-1`, `mysql-2`, ... if
  scaled up) that survives restarts, instead of a random suffix each
  time.
- **Its own PersistentVolumeClaim**, created from a
  `volumeClaimTemplate`, that follows that specific pod across restarts
  and rescheduling - the data doesn't vanish when the pod does.

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  namespace: servicehub
spec:
  serviceName: mysql
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8.4
          envFrom:
            - configMapRef: { name: mysql-config }
            - secretRef: { name: mysql-secret }
          volumeMounts:
            - name: mysql-data
              mountPath: /var/lib/mysql
  volumeClaimTemplates:
    - metadata:
        name: mysql-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 1Gi
```

`volumeClaimTemplates` (StatefulSet-only - Deployments don't have this
field) is the actual mechanism: Kubernetes provisions a real
PersistentVolumeClaim named `mysql-data-mysql-0` for the one replica here,
backed by whatever `PersistentVolume` provisioner the cluster has (on
`kind`/`minikube`, the default `local-path`/`standard` StorageClass).
Delete the pod, and its replacement mounts the *same* PVC - the data is
still there. This was verified directly: deleting the StatefulSet and
re-applying it (without deleting the PVC) leaves prior data intact,
while deleting the PVC too (as done once, deliberately, while testing a
migration fix) wipes it, exactly as expected.

## ConfigMap + Secret, same split as the backend

Same reasoning as `docs/04-kubernetes-deployment-configmap-secret.md`:

- **`mysql-config`**: `MYSQL_DATABASE` - not sensitive.
- **`mysql-secret`**: `MYSQL_ROOT_PASSWORD`, `MYSQL_USER`,
  `MYSQL_PASSWORD` - credentials.

The official `mysql` image reads exactly these environment variable
names on first startup to self-initialize (create the database, create
the user, set the root password) - no separate init script needed.

`mysql-secret`'s `MYSQL_USER`/`MYSQL_PASSWORD` must match
`backend-secret`'s `DB_USERNAME`/`DB_PASSWORD`
(`k8s/31-backend-secret.yaml`) - they're the same credential, just needed
by two different pods for two different reasons (one creates the user,
the other authenticates as it).

## The headless Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
  namespace: servicehub
spec:
  clusterIP: None
  selector:
    app: mysql
  ports:
    - port: 3306
```

`clusterIP: None` is what makes this "headless" - instead of getting one
load-balanced virtual IP the way `docs/05-kubernetes-service.md`'s
Services do, DNS returns the individual pod IP(s) directly
(`mysql-0.mysql.servicehub.svc.cluster.local`). This is the conventional
pairing for a StatefulSet: with a normal Service, a client talking to
"the database" might land on a different replica each request, which
makes no sense once there's more than one and each has distinct identity.
With one replica it mostly matters for correctness/future-proofing, but
the plain Service name `mysql` still resolves and is exactly what
`DB_HOST=mysql` (`k8s/30-backend-configmap.yaml`) needs.

## Redis: a Deployment, deliberately, not a StatefulSet

Redis here only backs BullMQ job queues and a cache. If its pod restarts
and the in-memory data is gone, nothing breaks - queued jobs get re-added
by whatever created them, and a cold cache just costs one extra DB read.
There's no reason to give it a stable identity or durable per-pod
storage, so it's a plain `Deployment` (`k8s/21-redis-deployment.yaml`) -
this comparison is exactly why MySQL getting a StatefulSet is a real
decision and not just "always use a StatefulSet for anything with a
volume."

## Demo-only caveat

Same note as `docs/04-kubernetes-deployment-configmap-secret.md`:
`k8s/11-mysql-secret.yaml`'s committed plain-text `stringData` is fine for
a local course presentation, not for a real deployment.

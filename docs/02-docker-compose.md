# 2. Orchestrating with Docker Compose (10%)

Files: `docker-compose.yml`, `.env.example`.

## The four services

| Service | Image | Role |
|---|---|---|
| `mysql` | `mysql:8.4` | the database |
| `redis` | `redis:7-alpine` | job queue (BullMQ) + cache backend |
| `backend` | built from `docker/backend.Dockerfile` | the NestJS API |
| `frontend` | built from `docker/frontend.Dockerfile` | the Angular app, served by nginx |

All four share one bridge network (`servicehub`), so they can reach each
other by service name (`mysql`, `redis`, `backend`) — that's exactly what
`DB_HOST=mysql` / `REDIS_HOST=redis` in `.env.example` rely on, and what
`docker/frontend.nginx.conf` relies on when it proxies `/api/` to
`http://backend:3000/api/`.

## Configuration: `.env`

`docker-compose.yml` reads a `.env` file for every real value (passwords,
hostnames, ports) instead of hardcoding them, and none of it is baked into
the images — it's injected at container start via `env_file:` (for the
backend) and variable substitution (`${...}`, for `mysql`/`redis`).

```bash
cp .env.example .env
# edit .env with real values
docker compose up --build
```

`.env` itself is gitignored (see the root `.gitignore`) — `.env.example`
is the committed template documenting every variable that exists, with
placeholder values.

## Startup ordering: healthchecks, not sleep-and-hope

`mysql` and `redis` both define a `healthcheck` (`mysqladmin ping` /
`redis-cli ping`), and `backend` declares `depends_on: ... condition:
service_healthy` on both. Compose will not start the backend container
until both dependencies report healthy — much more reliable than a fixed
delay, since "container started" and "ready to accept connections" are
different moments (MySQL in particular can take several seconds to
initialize on first run).

## No host ports on `mysql` / `redis`

Earlier drafts published `3306` and `6379` to the host. They were dropped:
nothing outside the Compose network needs to reach them directly — the
backend talks to both over the `servicehub` network by service name. This
also sidesteps a very common real problem: if you already have MySQL or
Redis running locally (or another project's Compose stack using those
ports), publishing them again fails with `port is already allocated`. This
is a genuinely easy thing to hit — a first attempt at bringing this stack
up on the machine it was built on failed with exactly that, `mysql`,
`redis`, and `backend` colliding with other unrelated local dev servers,
which is why `backend`'s own port mapping (`3000:3000`) is the one host
port worth being able to change if your machine already uses 3000.

## First-run database migrations

The database schema isn't created automatically — it's Sequelize
migrations, run once against a fresh database:

```bash
docker compose exec -e NODE_ENV=development backend sh -c \
  "cd /app/packages/models && npx sequelize-cli db:migrate"
```

The `-e NODE_ENV=development` matters: `packages/models/sequelize.config.js`
only defines a `development` config block, but the backend container's own
`NODE_ENV` is `production` (see `docker/backend.Dockerfile`) — running
`sequelize-cli` without the override fails with `Dialect needs to be
explicitly supplied`, because it looks up a `production` block that
doesn't exist.

## Verifying it actually works

This exact setup was run end-to-end while building it: `docker compose up
--build`, run the migration command above, then a real HTTP request
through the full path -

```bash
curl -X POST http://localhost:8080/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"Password123!"}'
```

- browser-equivalent request → frontend's nginx (`:8080`) → proxied to
  `backend:3000` → Sequelize insert into MySQL → row confirmed present
  with a direct `SELECT` against the `mysql` container. That's the same
  path any real feature in the app takes, so it's a reasonable sanity
  check that the whole stack is wired correctly.

One pre-existing bug surfaced during this: the `create-user` migration
created a table named `User` (capital), while every other migration's
foreign key and the Sequelize model itself (`tableName: 'user'`) expect
lowercase `user`. MySQL table names are case-sensitive by default on
Linux, so this broke the very next migration (`create-giving-service`)
with `Failed to open the referenced table 'user'`. Fixed by lowercasing
the one outlier `createTable('User', ...)` call to match everything else
— not a Docker/Compose issue, but it blocked demonstrating "it works" until
found and fixed.

## Ports once everything is up

- Frontend: `http://localhost:8080`
- Backend (direct, mostly for debugging): `http://localhost:3000/api/...`

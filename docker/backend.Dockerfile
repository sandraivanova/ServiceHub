# ServiceHub backend image.
#
# Build context MUST be the repository root, not packages/backend, because
# this is an npm-workspaces monorepo: the backend imports code from
# packages/models and packages/shared (and, via a plain relative path,
# packages/webhooks), so all of them have to be present to install and run
# it. See docs/01-dockerization.md for the full explanation.
#
# Build from the repo root with:
#   docker build -f docker/backend.Dockerfile -t servicehub-backend .

FROM node:22-alpine

WORKDIR /app

# Copy the whole workspace. npm needs every workspace's package.json to
# resolve the dependency graph, and the root "postinstall" script (which
# compiles packages/models) needs the actual TypeScript source to already
# be there, so there is no useful way to copy just the package.json files
# first the way a single-package Dockerfile normally would.
COPY . .

RUN npm ci

WORKDIR /app/packages/backend

ENV NODE_ENV=production
EXPOSE 3000

USER node

# Run the backend the same way its own "start" script does (ts-node
# directly against the TypeScript source), not the compiled build/
# output — see docs/01-dockerization.md for why the compiled build is
# currently broken for this monorepo layout.
CMD ["node", "-r", "ts-node/register", "src/main.ts"]

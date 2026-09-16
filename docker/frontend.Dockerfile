# ServiceHub frontend image: builds the Angular app, then serves the
# static output with nginx.
#
# Build context MUST be the repository root (same reason as
# docker/backend.Dockerfile: npm workspaces + the shared "@dnevnica/shared"
# package).
#
# Build from the repo root with:
#   docker build -f docker/frontend.Dockerfile -t servicehub-frontend .

# ---- build stage: compiles TypeScript/SCSS into static files ----
FROM node:22-alpine AS build

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build --workspace=packages/frontend -- --configuration=production

# ---- runtime stage: just the static files + nginx, nothing else ----
FROM nginx:alpine AS runtime

COPY docker/frontend.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/frontend/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

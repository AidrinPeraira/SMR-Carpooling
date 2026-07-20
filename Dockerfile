# syntax=docker/dockerfile:1
FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
RUN mkdir -p /pnpm /app/node_modules \
  /app/smr-shared/node_modules \
  /app/smr-backend/api-gateway/node_modules \
  /app/smr-backend/notification-service/node_modules \
  /app/smr-backend/payment-service/node_modules \
  /app/smr-backend/trip-service/node_modules \
  /app/smr-backend/user-service/node_modules \
  && chown -R node:node /app /pnpm

FROM base AS root-workspace
USER node
COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./pnpm-lock.yaml ./
COPY --chown=node:node ./pnpm-workspace.yaml ./
COPY --chown=node:node ./tsconfig.base.json ./

# --- Shared Library for Backend Services---
FROM root-workspace AS shared-backend-build
COPY --chown=node:node ./smr-shared/package.json ./smr-shared/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 pnpm install --filter @sharemyride/shared...
COPY --chown=node:node ./smr-shared/ ./smr-shared/
RUN pnpm --filter @sharemyride/shared build

# --- API Gateway ---
FROM root-workspace AS api-gateway-installer
COPY --chown=node:node ./smr-shared/package.json ./smr-shared/
COPY --chown=node:node ./smr-backend/api-gateway/package.json ./smr-backend/api-gateway/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 pnpm install --filter @smr/api-gateway...

FROM api-gateway-installer AS api-gateway
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/api-gateway/ ./smr-backend/api-gateway/
EXPOSE 4000
CMD ["pnpm", "--filter", "@smr/api-gateway", "run", "dev"]

# --- User Service ---
FROM root-workspace AS user-service-installer
COPY --chown=node:node ./smr-shared/package.json ./smr-shared/
COPY --chown=node:node ./smr-backend/user-service/package.json ./smr-backend/user-service/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 pnpm install --filter @smr/user-service...

FROM user-service-installer AS user-service
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/user-service/ ./smr-backend/user-service/
EXPOSE 4001
CMD ["pnpm", "--filter", "@smr/user-service", "run", "dev"]

# --- Notification Service ---
FROM root-workspace AS notification-service-installer
COPY --chown=node:node ./smr-shared/package.json ./smr-shared/
COPY --chown=node:node ./smr-backend/notification-service/package.json ./smr-backend/notification-service/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 pnpm install --filter @smr/notification-service...

FROM notification-service-installer AS notification-service
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/notification-service/ ./smr-backend/notification-service/
EXPOSE 4002
CMD ["pnpm", "--filter", "@smr/notification-service", "run", "dev"]

# --- Payment Service ---
FROM root-workspace AS payment-service-installer
COPY --chown=node:node ./smr-shared/package.json ./smr-shared/
COPY --chown=node:node ./smr-backend/payment-service/package.json ./smr-backend/payment-service/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 pnpm install --filter @smr/payment-service...

FROM payment-service-installer AS payment-service
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/payment-service/ ./smr-backend/payment-service/
EXPOSE 4003
CMD ["pnpm", "--filter", "@smr/payment-service", "run", "dev"]

# --- Trip Service ---
FROM root-workspace AS trip-service-installer
COPY --chown=node:node ./smr-shared/package.json ./smr-shared/
COPY --chown=node:node ./smr-backend/trip-service/package.json ./smr-backend/trip-service/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 pnpm install --filter @smr/trip-service...

FROM trip-service-installer AS trip-service
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/trip-service/ ./smr-backend/trip-service/
EXPOSE 4004
CMD ["pnpm", "--filter", "@smr/trip-service", "run", "dev"]

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

# the docker options are for: 1. cache the build, 2. you can find the files in the pnpm store folder, 3. uid and gid sets user id to prevent read and write issues in contianer
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 pnpm install --filter @sharemyride/shared...
COPY --chown=node:node ./smr-shared/ ./smr-shared/
RUN pnpm --filter @sharemyride/shared build

#################################################
# --- API Gateway ---

# dev
FROM root-workspace AS api-gateway-installer
COPY --chown=node:node ./smr-shared/package.json ./smr-shared/
COPY --chown=node:node ./smr-backend/api-gateway/package.json ./smr-backend/api-gateway/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 pnpm install --filter @smr/api-gateway...

FROM api-gateway-installer AS api-gateway-dev
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/api-gateway/ ./smr-backend/api-gateway/
EXPOSE 4000
CMD ["pnpm", "--filter", "@smr/api-gateway", "run", "dev"]


#prod
FROM api-gateway-installer AS api-gateway-builder
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/api-gateway/ ./smr-backend/api-gateway/
# build the dist folder
RUN pnpm --filter @smr/api-gateway build

FROM base AS api-gateway-prod
WORKDIR /app/smr-backend/api-gateway
USER node
ENV NODE_ENV=production
COPY --chown=node:node ./smr-backend/api-gateway/package.json ./package.json
COPY --chown=node:node ./pnpm-lock.yaml ./
# tell pnpm not to use workspace packages
RUN echo "link-workspace-packages=false" > .npmrc
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 \
  pnpm install --prod --frozen-lockfile --ignore-workspace
#here we copy code files from the builder image. not our pc.
COPY --chown=node:node --from=api-gateway-builder /app/smr-backend/api-gateway/dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]


#################################################
# --- User Service ---

# dev
FROM root-workspace AS user-service-installer
COPY --chown=node:node ./smr-shared/package.json ./smr-shared/
COPY --chown=node:node ./smr-backend/user-service/package.json ./smr-backend/user-service/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 pnpm install --filter @smr/user-service...

FROM user-service-installer AS user-service-dev
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/user-service/ ./smr-backend/user-service/
EXPOSE 4001
CMD ["pnpm", "--filter", "@smr/user-service", "run", "dev"]

#prod
FROM user-service-installer AS user-service-builder
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/user-service/ ./smr-backend/user-service/
# build the dist folder
RUN pnpm --filter @smr/user-service build

FROM base AS user-service-prod
WORKDIR /app/smr-backend/user-service
USER node
ENV NODE_ENV=production
COPY --chown=node:node ./smr-backend/user-service/package.json ./package.json
COPY --chown=node:node ./pnpm-lock.yaml ./
# tell pnpm not to use workspace packages
RUN echo "link-workspace-packages=false" > .npmrc
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 \
  pnpm install --prod --frozen-lockfile --ignore-workspace
#here we copy code files from the builder image. not our pc.
COPY --chown=node:node --from=user-service-builder /app/smr-backend/user-service/dist ./dist
EXPOSE 4001
CMD ["node", "dist/index.js"]


#################################################
# --- Notification Service ---

# dev
FROM root-workspace AS notification-service-installer
COPY --chown=node:node ./smr-shared/package.json ./smr-shared/
COPY --chown=node:node ./smr-backend/notification-service/package.json ./smr-backend/notification-service/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 pnpm install --filter @smr/notification-service...

FROM notification-service-installer AS notification-service-dev
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/notification-service/ ./smr-backend/notification-service/
EXPOSE 4002
CMD ["pnpm", "--filter", "@smr/notification-service", "run", "dev"]

#prod
FROM notification-service-installer AS notification-service-builder
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/notification-service/ ./smr-backend/notification-service/
# build the dist folder
RUN pnpm --filter @smr/notification-service build

FROM base AS notification-service-prod
WORKDIR /app/smr-backend/notification-service
USER node
ENV NODE_ENV=production
COPY --chown=node:node ./smr-backend/notification-service/package.json ./package.json
COPY --chown=node:node ./pnpm-lock.yaml ./
# tell pnpm not to use workspace packages
RUN echo "link-workspace-packages=false" > .npmrc
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 \
  pnpm install --prod --frozen-lockfile --ignore-workspace
#here we copy code files from the builder image. not our pc.
COPY --chown=node:node --from=notification-service-builder /app/smr-backend/notification-service/dist ./dist
EXPOSE 4002
CMD ["node", "dist/index.js"]


#################################################
# --- Payment Service ---

# dev
FROM root-workspace AS payment-service-installer
COPY --chown=node:node ./smr-shared/package.json ./smr-shared/
COPY --chown=node:node ./smr-backend/payment-service/package.json ./smr-backend/payment-service/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 pnpm install --filter @smr/payment-service...

FROM payment-service-installer AS payment-service-dev
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/payment-service/ ./smr-backend/payment-service/
EXPOSE 4003
CMD ["pnpm", "--filter", "@smr/payment-service", "run", "dev"]

#prod
FROM payment-service-installer AS payment-service-builder
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/payment-service/ ./smr-backend/payment-service/
# build the dist folder
RUN pnpm --filter @smr/payment-service build

FROM base AS payment-service-prod
WORKDIR /app/smr-backend/payment-service
USER node
ENV NODE_ENV=production
COPY --chown=node:node ./smr-backend/payment-service/package.json ./package.json
COPY --chown=node:node ./pnpm-lock.yaml ./
# tell pnpm not to use workspace packages
RUN echo "link-workspace-packages=false" > .npmrc
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 \
  pnpm install --prod --frozen-lockfile --ignore-workspace
#here we copy code files from the builder image. not our pc.
COPY --chown=node:node --from=payment-service-builder /app/smr-backend/payment-service/dist ./dist
EXPOSE 4003
CMD ["node", "dist/index.js"]


#################################################
# --- Trip Service ---

# dev
FROM root-workspace AS trip-service-installer
COPY --chown=node:node ./smr-shared/package.json ./smr-shared/
COPY --chown=node:node ./smr-backend/trip-service/package.json ./smr-backend/trip-service/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 pnpm install --filter @smr/trip-service...

FROM trip-service-installer AS trip-service-dev
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/trip-service/ ./smr-backend/trip-service/
EXPOSE 4004
CMD ["pnpm", "--filter", "@smr/trip-service", "run", "dev"]

#prod
FROM trip-service-installer AS trip-service-builder
COPY --chown=node:node --from=shared-backend-build /app/smr-shared/dist ./smr-shared/dist
COPY --chown=node:node ./smr-backend/trip-service/ ./smr-backend/trip-service/
# build the dist folder
RUN pnpm --filter @smr/trip-service build

FROM base AS trip-service-prod
WORKDIR /app/smr-backend/trip-service
USER node
ENV NODE_ENV=production
COPY --chown=node:node ./smr-backend/trip-service/package.json ./package.json
COPY --chown=node:node ./pnpm-lock.yaml ./
# tell pnpm not to use workspace packages
RUN echo "link-workspace-packages=false" > .npmrc
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,uid=1000,gid=1000 \
  pnpm install --prod --frozen-lockfile --ignore-workspace
#here we copy code files from the builder image. not our pc.
COPY --chown=node:node --from=trip-service-builder /app/smr-backend/trip-service/dist ./dist
EXPOSE 4004
CMD ["node", "dist/index.js"]



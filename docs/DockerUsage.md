# Example docker-compose.yml snippet to use the root Dockerfile.dev

# Use this as a reference for your actual compose file.

services:
api-gateway:
build:
context: .
dockerfile: Dockerfile.dev
command: pnpm --filter @smr/api-gateway dev
ports: - "4000:4000"
volumes: - .:/app - /app/node_modules # prevent local node_modules from overriding container one

notification-service:
build:
context: .
dockerfile: Dockerfile.dev
command: pnpm --filter @smr/notification-service dev
ports: - "4001:4000"
volumes: - .:/app - /app/node_modules

frontend:
build:
context: .
dockerfile: Dockerfile.dev
command: pnpm --filter @smr/frontend dev
ports: - "3000:3000"
volumes: - .:/app - /app/node_modules - /app/smr-frontend/.next # persistent next cache

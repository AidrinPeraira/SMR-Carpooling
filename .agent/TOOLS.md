# Tooling & Workflow

## 1. Development Tools

- **Runtime**: Node.js (LTS).
- **Package Manager**: `pnpm`.
- **Containerization**: Docker & Docker Compose for local infrastructure and services.
- **API Gateway**: Acts as the main entry point for the backend.
- **Message Broker**: RabbitMQ for event-driven communication.

## 2. Testing & Quality

- **Test Runner**: `vitest` for both backend and frontend.
- **UI Testing**: `storybook` for building and testing components in isolation.
- **Integration Tests**: `testcontainers` for spinning up temporary DBs/infra during tests.

## 3. API Documentation & Testing

- **API Specs**: Located in `docs/API.md`.
- **Testing Tool**: **Bruno**. API collections are kept in the `bruno/` directory.

## 4. Observability

- **Logs**: Loki & Promtail.
- **Metrics**: Prometheus.
- **Visualization**: Grafana.

## 5. Key Scripts

- `pnpm run dev`: Starts all services in development mode.
- `pnpm run build`: Builds all packages and services.
- `pnpm run test`: Runs tests across the monorepo.
- `pnpm run docker:dev`: Starts infrastructure using Docker Compose.

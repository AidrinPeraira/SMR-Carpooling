# ShareMyRide Architecture

The project is a microservices monorepo designed for scalability and maintainability.

## 1. System Overview

- **Monorepo Manager**: pnpm workspaces.
- **Backend**: Node.js microservices following **Clean Architecture**.
- **Frontend**: Next.js application using **Feature-Based Architecture**.
- **Shared Library**: `@smr/shared` for common code (DTOs, Enums, Errors, Logger).
- **UI Library**: `@smr/ui` for shared React components (Vite + Storybook).
- **Communication**:
  - **Synchronous**: REST APIs via Express.
  - **Asynchronous**: Event-driven using RabbitMQ.
- **Infrastructure**: MongoDB (Persistence), Redis (Caching/Sessions), Docker (Containerization).

## 2. Backend: Clean Architecture

Each service in `smr-backend/` is divided into four layers:

1.  **Domain**: Pure business logic (Entities, Value Objects). No external dependencies.
2.  **Application**: Orchestration logic (Use Cases, DTOs, Interfaces). Depends only on Domain.
3.  **Infrastructure**: Implementation details (Database Models, Repositories, External Services). Depends on Application.
4.  **Presentation**: Entry points (Controllers, Routes, Mappers). Depends on Application.

## 3. Frontend: Feature-Based Architecture

The frontend in `smr-frontend/` organizes code by business features:

- **app/**: Next.js App Router (Routing and Layouts).
- **features/**: Business logic (Auth, Trips, etc.). Each feature has its own `api`, `components`, `types`, and `views`.
- **components/**: Global, stateless UI primitives.
- **lib/**: Shared configurations and utilities.

## 4. Shared Packages

- **@smr/shared**: Centralized source of truth for cross-service contracts.
- **@smr/ui**: Isolated UI component library to ensure visual consistency across the platform.

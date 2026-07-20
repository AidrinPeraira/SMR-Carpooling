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

Each microservice in `smr-backend/` (excluding the `api-gateway`, which uses a simpler, middleware-based Express setup) is divided into four layers:

1.  **Domain**: Pure business logic (Entities, Value Objects). No external dependencies.
2.  **Application**: Orchestration logic (Use Cases, DTOs, Interfaces). Depends only on Domain.
3.  **Infrastructure**: Implementation details (Database Models, Repositories, External Services). Depends on Application.
4.  **Presentation**: Entry points (Controllers, Routes, Mappers, manual dependency injection configuration). Depends on Application.

## 3. Frontend: Feature-Based Architecture

The frontend in `smr-frontend/` organizes code by business features:

- **app/**: Next.js App Router (Routing and Layouts).
- **features/**: Domain-specific logic and modules (Auth, Profile, etc.). Each feature or sub-feature is structured with its own `api` (React Query), `components` (feature-specific UI), and `views` (complete page layouts/views).
- **components/**: Page-specific layouts and helper components (Navbar, Footer, SideNav, etc.).
- **lib/**: Shared configurations and utilities (such as API client configuration).

## 4. Shared Packages

- **@smr/shared**: Centralized source of truth for cross-service contracts (DTOs, Enums, Errors, etc.).
- **@smr/ui**: Isolated UI component library (Storybook + Vite) containing the global, stateless UI primitives (buttons, inputs, tables, etc.) to ensure visual consistency across the platform.

# ShareMyRide: Project Structure Guide

## 1. Overview

This document outlines the organization of the **ShareMyRide** codebase. The platform is architectured using **Microservices** (Backend) and **Feature-Based Architecture** (Frontend) to ensure scalability and maintainability.

### Key Principles:
- **Service Isolation**: Each microservice manages its own domain and database.
- **Feature Encapsulation**: Frontend logic is grouped by business domain (e.g., Trips, Auth).
- **Asynchronous Communication**: Inter-service events are handled via RabbitMQ.

---

## 2. Root Directory Structure

```text
ShareMyRide/
├── smr-backend/            # Core microservices (Clean Architecture)
│   ├── api-gateway/        # Entry point for the platform
│   ├── user-service/       # Identity, Auth, and Profile management
│   ├── trip-service/       # Carpooling and Trip logic
│   └── notification-service/# Email and Push notifications
├── smr-frontend/           # Next.js web application
│   └── src/                # Follows Feature-Based Architecture
├── smr-shared/             # Shared packages (types, common logic)
├── smr-infra/              # Infrastructure (Docker, K8s, etc.)
├── docs/                   # System and API documentation
├── package.json            # Workspace configuration (pnpm)
└── pnpm-workspace.yaml     # Workspace definitions
```

---

## 3. Backend Service Architecture

Each service (within `smr-backend/`) follows **Clean Architecture**:

```text
[service-name]/src/
├── domain/                 # Identity of the business (Pure TS)
│   └── entities/           # Core business entities
├── application/            # Business Logic (Use Cases)
│   ├── use-cases/          # Application-specific logic
│   ├── interfaces/         # Port definitions (Repos, Services)
│   └── dto/                # Data Transfer Objects
├── infrastructure/         # External Adapters (The "How")
│   ├── database/           # DB connections and schemas
│   ├── repository/         # Implementation of domain interfaces
│   └── services/           # External service implementations
└── presentation/           # External entry points (The "Where")
    ├── controllers/        # Request handlers
    ├── routes/             # API routing definitions
    ├── mapper/             # Entity ↔ DTO conversion
    ├── factories/          # Composition Root (Manual DI)
    └── middlewares/        # Express middlewares
```

---

## 4. Manual Dependency Injection (The Glue)

Instead of using a heavy DI container, we use a **Factory Pattern** in `presentation/factories/` as the **Composition Root**.

```typescript
// Example: smr-backend/user-service/src/presentation/factories/AuthControllerFactory.ts
const userRepository = new MongoUserRepository();
const registerUseCase = new RegisterUseCase(userRepository);
const authController = new AuthController(registerUseCase);
export { authController };
```

---

## 5. Backend Development Workflow

1.  **Domain First**: Define core `entities` and persistence `interfaces`.
2.  **Application Logic**: Implement functionality as `use-cases`.
3.  **Infrastructure**: Implement the `repository` using MongoDB.
4.  **Presentation**: Create `controllers` and define `routes`.
5.  **Composition**: Wire everything together in a `factory`.

---

## 6. Frontend Architecture (Next.js)

The frontend follows a **Feature-Based Architecture** to keep domain logic separate from routing and UI primitives.

```text
smr-frontend/src/
├── app/                    # Routing & Layouts (Next.js App Router)
├── features/               # Domain-specific logic (The "Heart")
│   ├── [feature-name]/
│   │   ├── api/            # API hooks (React Query) or Server Actions
│   │   ├── components/     # Feature-specific components (e.g., TripCard)
│   │   ├── types/          # Feature-specific TS definitions
│   │   └── index.ts        # Public API / Barrel file
├── components/             # Global UI Primitives (The "Blocks")
│   └── ui/                 # Shared atoms (Button, Input, Card)
├── hooks/                  # Global shared hooks
├── lib/                    # Shared configurations (apiClient, utils)
└── store/                  # Global state management (Zustand)
```

---

## 7. Frontend Feature Composition

To maintain modularity, features should only be accessed through their `index.ts` file.

1. **Isolation**: A feature should not import from another feature's internal folders. Use the public API (`index.ts`).
2. **Separation of Concerns**: Use `components/ui/` for generic, stateless components.
3. **Domain Logic**: Business-aware components (like `TripCard`) live inside their respective `features/` folder.
4. **Data Fetching**: Keep API calls and data transformation logic within the feature's `api/` folder.

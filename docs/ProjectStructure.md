# ShareMyRide: Project Structure Guide

## 1. Overview

This document outlines the organization of the **ShareMyRide** codebase. The platform is architectured using a **Microservices Monorepo** (Backend) and **Feature-Based Architecture** (Frontend) to ensure scalability and maintainability.

### Key Principles:

- **Clean Architecture**: Backend services decouple business logic from external frameworks.
- **Service Isolation**: Each microservice manages its own domain and database.
- **Shared Contracts**: Common types, DTOs, and schemas are centralized in `@sharemyride/shared`.
- **Interface-Driven Design**: Dependencies are injected via interfaces to ensure testability.

---

## 2. Root Directory Structure

```text
ShareMyRide/
├── smr-backend/            # Core microservices (Clean Architecture)
│   ├── api-gateway/        # Platform entry point & Orchestrator (middleware-based)
│   ├── user-service/       # Identity, Auth, and Profile management
│   ├── trip-service/       # Carpooling and Trip logic
│   ├── payment-service/    # Financial transactions & Stripe integration
│   └── notification-service/# Multi-channel alerts (Email/Push)
├── smr-frontend/           # Next.js web application (Feature-Based Architecture)
├── smr-ui/                 # Shared UI Component Library (Storybook + Vite)
├── smr-shared/             # Internal library (DTOs, Enums, Errors, Schemas)
├── smr-infra/              # Infrastructure configurations (Grafana, Loki, Promtail, RabbitMQ, Redis)
├── bruno/                  # Bruno API Client collection & environments
├── docs/                   # System, API, and workflow documentation
├── package.json            # Root workspace configuration (pnpm)
└── pnpm-workspace.yaml     # Workspace definitions
```

---

## 3. Backend Service Architecture

Each service (within `smr-backend/`) implements **Clean Architecture** (with the exception of `api-gateway`, which is a simpler gateway built directly with Express middleware):

```text
[service-name]/src/
├── domain/                 # Layer 1: Pure Business Logic
│   ├── entities/           # Domain objects with identity
│   └── ValueObjects/       # Immutable objects with no identity
├── application/            # Layer 2: Application Logic (Orchestration)
│   ├── use-case/           # Implementations of business actions
│   ├── interfaces/         # Ports (IRepository, IService, IUseCase)
│   └── dto/                # Data Transfer Objects (Internal use)
├── infrastructure/         # Layer 3: External Adapters (The "How")
│   ├── database/           # Models and Schemas (e.g., Mongoose)
│   ├── repository/         # DB persistence implementations
│   ├── services/           # External API/System implementations (JWT, Hashing, etc.)
│   └── store/              # Data stores / cache (e.g., RedisSessionStore)
└── presentation/           # Layer 4: Entry Points (The "Where")
    ├── v1/                 # Versioned API logic
    │   ├── controllers/    # Request/Response handlers
    │   ├── mapper/         # Conversion (Entity ↔ DTO)
    │   ├── routes/         # Express route definitions
    │   └── interfaces/     # Controller interface definitions
    ├── utils/              # Presentation-specific helpers (Error Mapper)
    └── [service].module.ts # Composition Root (Manual Dependency Injection)
```

---

## 4. Backend Development Lifecycle

Follow these steps when implementing a new feature to maintain architectural integrity:

### Step 1: Define the Domain

- Create `Entity.ts` in `domain/entities/`.
- Ensure it contains only pure TypeScript and business logic (no DB knowledge).

### Step 2: Define the Contracts (Interfaces)

- Create `IRepository.ts` in `application/interfaces/repository/`. (Must extend `IBaseRepository` if applicable).
- Create `IUseCase.ts` in `application/interfaces/use-case/`.
- Create `RequestDTO` and `ResultDTO` in `application/dto/` for use-case inputs/outputs.
- If multiple services need the data shape, place the DTO/Schema in `smr-shared`.

### Step 3: Implement Infrastructure

- Create the DB schema and model in `infrastructure/database/models/`.
- Implement the repository in `infrastructure/repository/` (extending a `BaseRepository` helper).
- Implement any required external services (e.g., Email, Hashing) in `infrastructure/services/`.

### Step 4: Implement Application Logic

- Implement the `UseCase.ts` in `application/use-case/`.
- **Constraint**: Only interact with other layers via interfaces injected in the constructor.

### Step 5: Implement Presentation

- Define the `IController.ts` in `presentation/v[x]/interfaces/`.
- Create the `Controller.ts` in `presentation/v[x]/controllers/`.
- Use a `Mapper.ts` in `presentation/v[x]/mapper/` to transform domain objects to API responses.
- Define the routes in `presentation/v[x]/routes/`.

### Step 6: Wiring & Verification (Composition Root)

- Wire all dependencies (DI) in the `presentation/[service].module.ts` file.
- Export versioned routers (e.g., `v1Router`) and mount them in `app.ts`.
- **Documentation**: Add JSDoc to all new classes and exported methods.
- **Testing**: Add a corresponding unit test in `tests/unit/` or integration test in `tests/integration/`.

---

## 5. Frontend Architecture (Next.js)

The frontend follows a **Feature-Based Architecture** to keep domain logic separate from routing and UI primitives.

```text
smr-frontend/
├── app/                    # Routing & Layouts (Next.js App Router)
├── features/               # Domain-specific logic (The "Heart")
│   └── [feature-name]/
│       ├── api/            # API hooks (React Query) or Server Actions
│       ├── components/     # Feature-specific components
│       └── views/          # Complete page views for the feature
├── components/             # Page-specific layouts and helper components (Navbar, Footer, etc.)
├── lib/                    # Shared configurations (apiClient, utils)
├── types/                  # Global shared TS definitions
└── public/                 # Static assets (images, icons)
```

---

## 6. Frontend Feature Composition

Features are structured to maintain domain isolation and code clarity.

1. **Domain Logic & Views**: Business-aware components and page views (such as user details or auth forms) live inside their respective `features/[feature-name]/views/` or `features/[feature-name]/components/` folders.
2. **Separation of Concerns**: Generic UI primitives (like buttons, dialogs, inputs, cards) are imported from the shared `@sharemyride/ui` library.
3. **Data Fetching**: Keep API queries, mutations, and cache management (using React Query) inside the feature's `api/` folder.

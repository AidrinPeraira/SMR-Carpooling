# ShareMyRide: Project Structure Guide

## 1. Overview

This document outlines the organization of the **ShareMyRide** codebase. The platform uses a **Microservices Monorepo** (Backend) and **Feature-Based Architecture** (Frontend) to ensure scalability and maintainability.

### Key Principles:

- **Clean Architecture**: Backend services decouple business logic from external frameworks.
- **Service Isolation**: Each microservice manages its own domain and database.
- **Shared Contracts**: Common types, DTOs, enums, errors, and schemas are centralized in `@sharemyride/shared`.
- **Interface-Driven Design**: Dependencies are injected via interfaces to ensure testability.

---

## 2. Root Directory Structure

```text
ShareMyRide/
├── smr-backend/               # Core microservices (Clean Architecture)
│   ├── api-gateway/           # Platform entry point & Orchestrator (proxy-based)
│   ├── user-service/          # Identity, Auth, Profile, Applications
│   ├── trip-service/          # Trips, Bookings, Vehicles, Driver management
│   ├── payment-service/       # Payments (RazorPay), Wallets, Transactions
│   ├── notification-service/  # Email notifications (Resend) — pure event consumer
│   └── realtime-service/      # Chat (Socket.IO) & Voice Calls (WebRTC signaling)
├── smr-frontend/              # Next.js web application (Feature-Based Architecture)
├── smr-ui/                    # Shared UI Component Library (Storybook + Vite)
├── smr-shared/                # Internal library (DTOs, Enums, Errors, Schemas)
├── smr-infra/                 # Infrastructure configurations
│   ├── rabbitmq/              # RabbitMQ configuration
│   └── redis/                 # Redis configuration
├── bruno/                     # Bruno API Client collection & environments
├── docs/                      # System, API, and workflow documentation
├── Dockerfile.dev             # Development Docker image (multi-stage)
├── Dockerfile.prod            # Production Docker image (multi-stage)
├── docker-compose.dev.yml     # Dev environment orchestration
├── docker-compose.prod.yml    # Prod environment orchestration
├── package.json               # Root workspace configuration (pnpm)
├── pnpm-workspace.yaml        # Workspace definitions
├── tsconfig.base.json         # Shared TypeScript configuration
└── eslint.config.mjs          # Shared ESLint configuration
```

---

## 3. Backend Service Architecture

Each service (within `smr-backend/`) implements **Clean Architecture**, with the exception of the `api-gateway` (a simpler proxy-based gateway) and the `notification-service` (a pure event consumer with no REST routes):

```text
[service-name]/src/
├── domain/                    # Layer 1: Pure Business Logic
│   ├── entities/              # Domain objects with identity
│   └── ValueObjects/          # Immutable objects with no identity
├── application/               # Layer 2: Application Logic (Orchestration)
│   ├── use-case/              # Implementations of business actions
│   ├── interfaces/            # Ports (IRepository, IService, IUseCase, IEventBus)
│   │   ├── repository/        # Repository interfaces
│   │   ├── services/          # External service interfaces
│   │   ├── use-case/          # Use case interfaces
│   │   ├── messaging/         # Event bus/dispatcher/handler interfaces
│   │   └── store/             # Cache/store interfaces
│   ├── dto/                   # Data Transfer Objects (use-case inputs/outputs)
│   └── mapper/                # Entity ↔ DTO mapping
├── infrastructure/            # Layer 3: External Adapters (The "How")
│   ├── database/              # DB connection + Models/Schemas (Mongoose or Prisma)
│   ├── repository/            # DB persistence implementations
│   ├── services/              # External service implementations (JWT, Hashing, S3, RazorPay, EventBus, etc.)
│   ├── store/                 # Data stores / cache (Redis)
│   └── sockets/               # Socket.IO emitter (Realtime Service only)
└── presentation/              # Layer 4: Entry Points (The "Where")
    ├── v1/                    # Versioned API logic
    │   ├── controllers/       # Request/Response handlers
    │   ├── interfaces/        # Controller interface definitions
    │   ├── routes/            # Express route definitions
    │   ├── middlewares/       # Route-level middleware (Auth, etc.)
    │   ├── messaging/         # EventDispatcher (registers event handlers)
    │   ├── event-handlers/    # RabbitMQ event handler implementations
    │   └── sockets/           # Socket.IO handlers (Realtime Service only)
    │       ├── handlers/      # Chat and Call socket handlers
    │       ├── interfaces/    # Socket handler interfaces
    │       └── middlewares/   # Socket authentication middleware
    ├── middleware/             # Service-level middleware (metrics, gateway key)
    ├── utils/                 # Presentation helpers (Error Mapper, Traces Decorator)
    └── [service].module.ts    # Composition Root (Manual Dependency Injection)
```

### Service-Specific Variations

**API Gateway** — No Clean Architecture layers. Flat structure with middleware, services, and config:
```text
api-gateway/src/
├── middleware/        # auth, blacklist, key, metrics middleware
├── services/          # blacklist service
├── config/            # Redis config
├── decorators/        # Traces decorator
└── app.ts             # Express app with proxy middleware setup
```

**Notification Service** — No REST routes. Pure event consumer:
```text
notification-service/src/
├── domain/entities/           # NotificationEntity
├── application/
│   ├── use-case/              # One use case per email type
│   ├── interfaces/            # IMailService, IEventHandler, IMessageConsumer
│   ├── dto/email/             # DTOs for each email type
│   └── utils/                 # Email template builder
├── infrastructure/services/   # ResendEmailService, RabbitMQConsumer, Logger
└── presentation/
    ├── event-handlers/        # One handler per event type
    ├── messaging/             # EventDispatcher
    └── [service].module.ts    # Composition Root
```

**Realtime Service** — Has both HTTP and Socket.IO presentation layers:
```text
realtime-service/src/presentation/v1/
├── http/              # HTTP controllers, interfaces, routes (chat message sync)
├── sockets/           # Socket.IO handlers, interfaces, middlewares (chat + call)
└── messaging/         # RabbitMQ event handlers
```

---

## 4. Backend Development Lifecycle

Follow these steps when implementing a new feature to maintain architectural integrity:

### Step 1: Define the Domain

- Create `Entity.ts` in `domain/entities/`.
- Ensure it contains only pure TypeScript and business logic (no DB knowledge).

### Step 2: Define the Contracts (Interfaces)

- Create `IRepository.ts` in `application/interfaces/repository/`.
- Create `IUseCase.ts` in `application/interfaces/use-case/`.
- Create `RequestDTO` and `ResultDTO` in `application/dto/` for use-case inputs/outputs.
- If multiple services need the data shape, place the DTO/Schema in `smr-shared`.

### Step 3: Implement Infrastructure

- Create the DB schema and model in `infrastructure/database/`.
  - Mongoose models for MongoDB services.
  - Prisma schema for Trip Service (PostgreSQL).
- Implement the repository in `infrastructure/repository/`.
- Implement any required external services in `infrastructure/services/`.

### Step 4: Implement Application Logic

- Implement the `UseCase.ts` in `application/use-case/`.
- **Constraint**: Only interact with other layers via interfaces injected in the constructor.

### Step 5: Implement Presentation

- Define the `IController.ts` in `presentation/v[x]/interfaces/`.
- Create the `Controller.ts` in `presentation/v[x]/controllers/`.
- Define the routes in `presentation/v[x]/routes/`.
- If the feature is event-driven, create an `EventHandler.ts` in `presentation/v[x]/event-handlers/` and register it in the `EventDispatcher`.

### Step 6: Wiring & Verification (Composition Root)

- Wire all dependencies (DI) in the `presentation/[service].module.ts` file.
- Export versioned routers (e.g., `v1Router`) and mount them in `app.ts`.
- Add a corresponding test in `tests/unit/` or `tests/integration/`.

---

## 5. Frontend Architecture (Next.js)

The frontend follows a **Feature-Based Architecture** to keep domain logic separate from routing and UI primitives.

```text
smr-frontend/
├── app/                    # Routing & Layouts (Next.js App Router)
├── features/               # Domain-specific logic (The "Heart")
│   ├── admin/              # Admin dashboard features
│   ├── application/        # Driver/vehicle application workflows
│   ├── auth/               # Authentication flows
│   ├── call/               # Voice calling (WebRTC)
│   ├── chat/               # Trip chat
│   ├── driver/             # Driver-specific features
│   ├── map/                # Map and route display
│   ├── passenger/          # Passenger-specific features
│   ├── profile/            # User profile management
│   └── realtime/           # Real-time connection management
├── components/             # Page-specific layouts and helper components (Navbar, Footer, etc.)
├── lib/                    # Shared configurations (apiClient, utils)
├── types/                  # Global shared TS definitions
└── public/                 # Static assets (images, icons)
```

---

## 6. Frontend Feature Composition

Features are structured to maintain domain isolation and code clarity.

1. **Domain Logic & Views**: Business-aware components and page views live inside their respective `features/[feature-name]/` folders.
2. **Separation of Concerns**: Generic UI primitives (buttons, dialogs, inputs, cards) are imported from `@sharemyride/ui`.
3. **Data Fetching**: API queries, mutations, and cache management use **TanStack Query** inside each feature's `api/` folder.

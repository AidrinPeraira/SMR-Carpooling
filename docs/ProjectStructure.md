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

### a. Manual Dependency Injection (The Glue)

---

### b. Backend Development Workflow

- Create `Entity.ts` file and describe the shape of the entity in the `Domain` Directory
- Create interface for the repository, that handles updating the persistance layer (The DB) with the entity details, in `application/interface/reposiory/`. Use the filename `IRepository.ts`
- Ensure that `IRepository.ts` extends `IBaseRepostiorty.ts` (If base repository doesn't exist, make one)
- Create interfaces for the business actions to be done with the entity using use-cases. Create the corresponding file `IUseCase.ts` in the directory `application/interface/use-cases/`
- For the use case create `RequestDTO` and `ResultDTO` in `application/dto/`
- Add any necessary services' interfaces' to `application/interface/services`
- Ensure only pure TS exists in `domain` and `applicatoin`
- Any types that may be requred by multiple services goes into `smr-shared` shared library.
- Ensure all dependcies are injected using interfacs and not imported.
- After use case create implementations for the necessarty `sercvices` and `repositories`
- All repository implementations should extend a `BaseRepository`, which handles the common reposiory methods.
- The repositories will have there corresponding `schema` and `models` defined in `infrastructure/database/models`
- The repository implementations are done in `infrastructure/reposiory/`
- After repoositories are implemented cretae implementations for the necessary services in `infrastructure/sercvices`
- repositories and services implement the corresponding interfaces defined in `application/interfaces/`
- after repositories we create the controllers.
- write the interfacce for the controllers in `presentation/v1/interfaces`
- the presentation layer is versioned. ensure everything related to a version stays within that directory.
- create coreesponding implementations for `IController` in `presentation/v1/controllers`
- Common shapes for communincation between sercvices and client is defined in `shared/dto`
- `shared/schema` has the implementations for zod validations. for each of the input shapes defined in the shared dto folder.
- the controller handles mapping the dtos form and to the domain shape using mappers in `presentation/v1/mappers`
- Any failure throws an error which is handled by the global error handler.
- Routers also live in the presentation layer.
-

---

## 4. Frontend Architecture (Next.js)

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

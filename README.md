# ShareMyRide

**ShareMyRide** is a platform that connects solo travelers for long-distance carpooling. Users can become passengers or drivers and switch between roles to hitch a ride or offer one.

**Share the Car. Share the Journey. Share the Expenses.**

The system is architected as a set of **Microservices** using **Clean Architecture** principles, with event-driven communication via RabbitMQ. Each service owns its domain, database, and deployment lifecycle.

---

## System Overview

![System Container](./docs/diagrams/System%20Container.svg)

---

## Database Design

![Master ERD](./docs/diagrams/Master%20ERD.svg)

---

## Services

| Service                  | Responsibility                                                          | Database          |
| :----------------------- | :---------------------------------------------------------------------- | :---------------- |
| **API Gateway**          | Request proxying, auth verification, blacklisting, WebSocket proxying.  | Redis             |
| **User Service**         | Authentication, profiles, driver/vehicle applications, admin operations. | MongoDB + Redis   |
| **Trip Service**         | Trip creation, geo-indexed search, bookings, vehicles, pricing configs. | PostgreSQL + Redis |
| **Payment Service**      | Booking payments (RazorPay), wallets, transactions, refunds.            | MongoDB           |
| **Notification Service** | Asynchronous email dispatch via Resend (pure event consumer).           | —                 |
| **Realtime Service**     | Trip chat (Socket.IO) and voice calling (WebRTC signaling).             | MongoDB + Redis   |

---

## Tech Stack

| Layer              | Technology                                                              |
| :----------------- | :---------------------------------------------------------------------- |
| **Frontend**       | Next.js (App Router), React, TanStack Query, Storybook (UI library)    |
| **API Gateway**    | Express, http-proxy-middleware, Redis                                   |
| **Backend**        | Node.js, Express, TypeScript                                           |
| **Databases**      | MongoDB, PostgreSQL (Prisma), Redis                                    |
| **Message Broker** | RabbitMQ (topic exchange, dead-letter queues)                          |
| **Payments**       | RazorPay                                                               |
| **File Storage**   | AWS S3 (presigned URL uploads)                                         |
| **Email**          | Resend                                                                 |
| **Realtime**       | Socket.IO, WebRTC                                                      |
| **Scheduling**     | Upstash QStash                                                         |
| **Geo Indexing**   | H3                                                                     |
| **Auth**           | JWT, Redis sessions, Google OAuth                                      |
| **Observability**  | OpenTelemetry, Grafana Cloud (Loki, Prometheus, Tempo)                 |
| **Testing**        | Vitest, Testcontainers                                                 |
| **Infra**          | Docker (multi-stage builds), pnpm workspaces                          |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/) (v11+)
- [Docker & Docker Compose](https://www.docker.com/)

### 1. Clone & Install

```bash
git clone https://github.com/AidrinPeraira/SMR-Carpooling.git
cd ShareMyRide
pnpm install
```

### 2. Environment Variables

Each service and the frontend includes a `.env.example` file listing the required environment variables. Copy it to `.env` and fill in the values for your environment before starting.

### 3. Start Backend (Docker)

All backend services, databases (MongoDB, PostgreSQL, Redis), and RabbitMQ are orchestrated via Docker Compose:

```bash
# Build and start all backend services
pnpm docker:dev:build

# Start without rebuilding (after first build)
pnpm docker:dev

# Stop all services
pnpm docker:dev:down
```

### 4. Start Frontend

The frontend runs outside Docker for faster HMR during development:

```bash
pnpm -F @smr/frontend run dev
```

---

## Available Scripts

| Script                    | Description                                           |
| :------------------------ | :---------------------------------------------------- |
| `pnpm docker:dev:build`  | Build and start all backend services (dev mode)       |
| `pnpm docker:dev`        | Start backend services without rebuilding             |
| `pnpm docker:dev:down`   | Stop all backend services                             |
| `pnpm docker:prod:build` | Build and start all services (production mode)        |
| `pnpm docker:prod:down`  | Stop all production services                          |
| `pnpm build`             | Build all packages and services                       |
| `pnpm packages:build`    | Build shared packages (`@sharemyride/shared` + `ui`)  |
| `pnpm lint`              | Run ESLint across all packages                        |
| `pnpm type-check`        | Run TypeScript type checking across all packages      |
| `pnpm test`              | Run tests across all packages                         |
| `pnpm format`            | Format code with Prettier                             |
| `pnpm docker:build`      | Build production Docker images for all services       |
| `pnpm docker:push`       | Push Docker images to registry                        |
| `pnpm docker:publish`    | Build and push all Docker images                      |

---

## Documentation

| Document                                              | Description                                              |
| :---------------------------------------------------- | :------------------------------------------------------- |
| [Architecture](./docs/Architecture.md)                | System design, C4 diagrams, service components, event flows |
| [Project Structure](./docs/ProjectStructure.md)       | Folder organization, Clean Architecture layers, dev lifecycle |
| [API Reference](./docs/API.md)                        | All REST and WebSocket endpoints                         |
| [Features & Tech Stack](./docs/Features.md)           | Implemented features and the technology behind each      |
| [Technologies](./docs/Technologies.md)                | Why each technology was chosen                           |
| [Database Design](./docs/DatabaseDesign.md)           | ERD diagrams and data models per service                 |
| [Testing Strategy](./docs/Testing.md)                 | Testing approach and conventions                         |
| [Git Workflow](./docs/GitWorkflow.md)                 | GitFlow branching strategy and process                   |

---

## License

This project is licensed under the ISC License.

# ShareMyRide Architecture

"ShareMyRide" is a platform that connects people travelling solo over long distances. It helps them share their car with others who are travelling along the same route.

**Share the Car. Share the Journey. Share the Expenses.**

Users can become passengers or drivers and switch between roles to hitch a ride or offer one. The system is built on a microservices architecture to ensure scalability and independent deployment of core features.

---

## 1. Core Services

The ecosystem is partitioned into six specialized services, coordinated through an API Gateway. Each service owns its domain, database, and deployment lifecycle.

| Service                  | Purpose            | Key Responsibilities                                                                                                      |
| :----------------------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------ |
| **Next.js Frontend**     | User Interface     | Provides a responsive web interface for drivers and passengers to manage trips, bookings, payments, chat, and profiles.   |
| **API Gateway**          | Orchestration      | Entry point for all client requests; handles routing, auth verification, blacklisting, rate limiting, and request proxying via `http-proxy-middleware`. Also proxies WebSocket connections for the Realtime Service. |
| **User Service**         | Identity & Profile | Manages user accounts, authentication (email/password + Google OAuth), profile management, driver/vehicle applications, and admin user operations. |
| **Trip Service**         | Core Logic         | Handles the creation, discovery, booking, and management of carpooling trips and routes. Manages driver/passenger/vehicle records, pricing rules, and geo-indexed trip search. |
| **Payment Service**      | Financials         | Processes booking payments via RazorPay, manages wallets, tracks transactions, and handles refunds on cancellations.       |
| **Notification Service** | Engagement         | Asynchronous event consumer that dispatches email notifications triggered by system events (signup, bookings, payments, applications, cancellations). |
| **Realtime Service**     | Real-time Comms    | Facilitates trip chat (Socket.IO) and voice calling (WebRTC signaling) between trip participants.                          |

---

## 2. Tech Stack

| Layer              | Technology                                                              |
| :----------------- | :---------------------------------------------------------------------- |
| **Frontend**       | Next.js (App Router), React, TanStack Query, Storybook (UI library)    |
| **API Gateway**    | Express, http-proxy-middleware, Redis (blacklist/session check)         |
| **Backend**        | Node.js, Express, TypeScript                                           |
| **Databases**      | MongoDB (User, Payment, Notification, Realtime), PostgreSQL via Prisma (Trip) |
| **Caching**        | Redis (sessions, configurations, places cache, blacklist)              |
| **Message Broker** | RabbitMQ (topic exchange, dead-letter queues)                          |
| **Payments**       | RazorPay                                                               |
| **File Storage**   | AWS S3 (presigned URL uploads for avatars, application documents)      |
| **Email**          | Resend                                                                 |
| **Realtime**       | Socket.IO (chat), WebRTC (voice calls)                                 |
| **Scheduling**     | Upstash QStash (webhook-based scheduled jobs)                          |
| **Geo Indexing**   | H3 (Uber's hexagonal hierarchical spatial index)                       |
| **Auth**           | JWT (access + refresh tokens), Redis session store, Google OAuth       |
| **Observability**  | OpenTelemetry, Grafana Cloud (Loki, Prometheus, Tempo)                 |
| **Testing**        | Vitest, Testcontainers                                                 |
| **Infra**          | Docker (dev + prod multi-stage builds), pnpm workspaces                |
| **API Testing**    | Bruno (offline, CLI-capable, lives alongside project)                  |

---

## 3. Workflow (Example)

### Scenario: Booking a Shared Ride

1. **Trip Creation**: A driver creates a trip specifying origin, destination, waypoints, date/time, available seats, and vehicle. The trip is geo-indexed for discovery.
2. **Trip Discovery**: A passenger searches for trips matching their route and date. The system uses H3 geo-indexing to find matching trips.
3. **Booking Request**: The passenger creates a booking request. The **Notification Service** alerts the driver via email.
4. **Approval & Payment**: The driver accepts the booking. The passenger initiates payment via **RazorPay** (or wallet balance). The **Payment Service** creates an order and verifies the transaction. Unpaid bookings are auto-cleaned up via scheduled webhooks (QStash).
5. **Coordination**: Once confirmed, the passenger and driver can communicate via the **Realtime Service** (trip chat and voice calls).
6. **Cancellation & Refunds**: Either party can cancel. The **Payment Service** handles automatic refunds to the passenger's wallet and the **Notification Service** sends cancellation emails to all affected parties.

---

## 4. System Architecture

### 4.1 System Context Diagram

The overall relationship between users, external services (RazorPay, AWS S3, Resend, Grafana), and the ShareMyRide system.

![System Context](./diagrams/System%20Context.svg)

### 4.2 System Container Diagram

Detailed view of internal microservices, persistence layers (MongoDB, PostgreSQL, Redis), and asynchronous communication (RabbitMQ).

![System Container](./diagrams/System%20Container.svg)

### 4.3 User Service Component

Handles authentication, identity, profile management, driver/vehicle application workflows, and admin operations.

- **Internal Modules**:
  - **Auth Module**: Signup, email verification, login, Google OAuth, JWT token management, password reset flow.
  - **Profile Module**: User profile CRUD, avatar upload (S3 presigned URLs), role switching.
  - **Application Module**: Driver onboarding, vehicle registration, renewal, and resubmission workflows.
  - **Admin Module**: User listing, blocking/unblocking, application review and processing.
- **Persistence**: MongoDB (`User`, `DriverRecord`, `VehicleRecord`, `VehicleList`, `Application`). Redis for session management.

![User Service Component](./diagrams/User%20Service%20Component.svg)

### 4.4 Trip Service Component

Manages the entire lifecycle of a shared ride, from creation to booking, payment coordination, and cancellation.

- **Internal Modules**:
  - **Trip Module**: Trip creation, listing (driver), search (passenger with geo-indexing), journey details, cancellation.
  - **Booking Module**: Booking requests, driver accept/reject, passenger withdraw/cancel, payment initiation, payment confirmation/failure handling.
  - **Vehicle Module**: Driver vehicle listing.
  - **Driver Module**: Driver details and status management.
  - **Admin Module**: Trip/booking/vehicle/driver listing and details, configuration management (pricing rules, vehicle types), places management.
  - **Webhook Module**: Scheduled cleanup of expired booking payments and trip geo-indexes.
- **Persistence**: PostgreSQL via Prisma (`Trip`, `Booking`, `Driver`, `Passenger`, `Vehicle`, `VehicleList`, `Places`, `PricingRules`). Redis for configurations and places cache.
- **Event Handlers**: Listens for user signup, application approval, booking payment success/failure, user block/unblock events via RabbitMQ.

![Trip Service Component](./diagrams/Trip%20Service%20Component.svg)

### 4.5 Payment Service Component

Orchestrates financial flows and provides an audit trail of all expense-sharing activities.

- **Internal Modules**:
  - **Payment Module**: Create booking payment orders (RazorPay), verify payments, pay with wallet balance, handle failed payments.
  - **Wallet Module**: Wallet transactions and balance management. Refunds credit the wallet.
  - **Admin Module**: List all transactions.
  - **Webhook Module**: Cleanup stale booking payments.
- **Persistence**: MongoDB (`BookingPayment`, `Customer`, `Transaction`, `Wallet`, `WalletTransaction`).
- **Event Handlers**: Listens for new user, booking cancellation (by passenger), trip cancellation (by driver), user block/unblock events via RabbitMQ.

![Payment Service Component](./diagrams/Payment%20Service%20Component.svg)

### 4.6 Notification Service Component

An asynchronous consumer that listens for system events and triggers email notifications via Resend.

- **Alert Channel**: Email (via Resend with custom domain).
- **Trigger Events**: Signup verification, password change, application approved/rejected/returned, new booking, booking payment success/failure, booking cancellation, trip cancellation.
- **Architecture**: Pure consumer — no HTTP endpoints beyond health check. Consumes events from RabbitMQ queues.

![Notification Service Component](./diagrams/Notification%20Service%20Component.svg)

### 4.7 Realtime Service Component

Facilitates real-time communication between trip participants.

- **Internal Modules**:
  - **Chat Module**: Trip chat creation, member management, message sync (HTTP), real-time messaging (Socket.IO).
  - **Call Module**: WebRTC signaling — initiate, accept, reject, end calls, relay ICE candidates/SDP, handle call timeouts.
  - **Member Module**: Member creation, active trip tracking.
- **Persistence**: MongoDB (`Chat`, `Message`, `Member`, `CallSession`). Redis for Socket.IO adapter (scaling).
- **Transport**: Socket.IO namespaces (`/chat`, `/call`) proxied through the API Gateway. HTTP endpoint for message sync.
- **Event Handlers**: Listens for new user signup, new trip, new booking, booking cancellation, trip cancellation events via RabbitMQ.

![Realtime Service Component](./diagrams/Realtime%20Service%20Component.svg)

### 4.8 RabbitMQ Message Broker

The backbone of the system's asynchronous communication, ensuring loose coupling between microservices.

- **Exchange Type**: Topic exchange with pattern-based routing.
- **Dead Lettering**: Dead letter exchange and queue for failed message handling.
- **Key Event Flows**:
  - **Auth Events**: User signup → Trip Service (create passenger), Payment Service (create customer/wallet), Realtime Service (create member), Notification Service (send verification email).
  - **Application Events**: Approval/rejection/return → Notification Service (status emails), Trip Service (create driver/vehicle on approval).
  - **Booking Events**: New booking → Notification Service (email driver). Payment success/failure → Trip Service (confirm/cleanup booking). Cancellation → Payment Service (refund), Notification Service (cancellation emails), Realtime Service (update chat members).
  - **Trip Events**: Cancellation → Payment Service (refund all bookings), Notification Service (cancellation emails), Realtime Service (close chat).
  - **User Events**: Block/unblock → Trip Service (update passenger/driver status), Payment Service (block/unblock customer).

![Rabbit MQ Message Broker](./diagrams/Rabbit%20MQ_%20Message%20Broker%20Component.svg)

### 4.9 Payment SAGA

The booking payment flow is a choreography-based saga coordinated via RabbitMQ events between the Trip Service and Payment Service. This ensures eventual consistency without a central orchestrator — each service reacts to events and publishes its own, with compensating actions (refunds, booking cleanup) triggered automatically on failure or cancellation.

![Payment SAGA](./diagrams/Payment%20SAGA.svg)

---

## 5. Technical Constraints & Architecture Decisions

- **Clean Architecture**: Each service implements Clean Architecture — business logic is independent of frameworks (Express, MongoDB, Prisma). Dependencies flow inward via interfaces injected at the composition root.
- **Microservices Deployment**: Each service is independently deployable. Synchronous requests go through the API Gateway; asynchronous events go through RabbitMQ.
- **Event-Driven Communication**: Cross-service side effects (notifications, record creation, refunds) are handled asynchronously via the Message Broker using a publish/subscribe pattern with topic exchanges.
- **Database Isolation**: Each service manages its own data source. No inter-service database joins.
  - User Service: MongoDB + Redis
  - Trip Service: PostgreSQL (Prisma) + Redis
  - Payment Service: MongoDB
  - Notification Service: No database (pure consumer)
  - Realtime Service: MongoDB + Redis
- **API Versioning**: All endpoints are versioned (`/api/v1/...`). The gateway strips the `/api` prefix before proxying.
- **Observability**: OpenTelemetry instrumentation exports metrics, traces, and logs to Grafana Cloud (Loki for logs, Prometheus for metrics, Tempo for traces).
- **Containerization**: Docker multi-stage builds for both development and production, with build caching.
- **Monorepo**: pnpm workspaces with shared packages (`@sharemyride/shared` for DTOs, enums, errors, schemas; `@sharemyride/ui` for UI components).

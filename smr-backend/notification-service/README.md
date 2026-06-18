# @smr/notification-service

The **Notification Service** is an event-driven microservice responsible for handling outbound communications (e.g., verification emails, transactional updates, alerts) for the _ShareMyRide (SMR)_ platform.

It operates entirely asynchronously as an event listener, consuming messages pushed from other services via RabbitMQ. It is completely decoupled from database management systems and HTTP entry boundaries, focusing solely on communication delivery.

---

## 🏗️ Architecture Design Patterns

This service is meticulously structured following **Clean Architecture principles** and the **SOLID guidelines** to guarantee structural maintainability, test isolation, and clear separation of concerns.

```text
       [ Infrastructure Layer ]         <--- Network / Connection Drivers (amqplib, resend)
                  │
                  ▼
        [ Presentation Layer ]          <--- Transport Bridges & Routing (Dispatcher, Handlers)
                  │
                  ▼
         [ Application Layer ]          <--- Pure Core Orchestration (Use Cases, DTO contracts)
                  │
                  ▼
           [ Domain Layer ]             <--- Business Entities & Entities contracts
```

### Key Architectural Concepts Employed

- **The Dispatcher/Handler Pattern:** Rather than running a procedural monolithic `switch` loop across incoming events, routing logic is handled by a generic `EventDispatcher`. Individual features hook into the dispatcher as isolated, standalone controller wrappers (`IEventHandler`), aligning with the **Open/Closed Principle (OCP)**.
- **Anti-Corruption Layer (ACL):** The event handlers act as a protective translation layer. They convert raw external payloads (`DomainEvent<T>`) into internal application request structures (`DTOs`). This ensures changes made by other microservices do not trigger cascading breaks within this service's core workflows.
- **Dependency Inversion (DIP):** Every abstraction points inwards. The use cases depend on interfaces (`IMailService`), while the concrete infrastructure drivers (`ResendEmailService`) implement them from the outside.
- **Composition Root:** Manual Dependency Injection (DI) is consolidated entirely within a single module entrypoint (`src/presentation/notification-service.module.ts`), creating an easy-to-read declaration tree.

---

## 🚦 System Topologies & Event Mesh

The messaging model uses a robust, fault-tolerant topology setup designed to handle high transaction volumes safely without message loss.

```text
[ user-service ] ────► ( sharemyride.events Exchange ) [topic]
                               │
                               ├─── ( routingKey: auth.user_signup )
                               │          │
                               │          ▼
                               │   [ smr.notifications.queue ] ──► ( prefetch: 1 ) ──► [ Consumer ]
                               │                                                          │
                               ▼                                                     (Throws Error)
                 ( sharemyride.events.dlq Exchange ) [topic]                              │
                               │                                                          ▼
                               └─── ( routingKey: # ) ──► [ sharemyride.events.dlx Queue ] (DLQ)
```

### 1. Connection & Resilience

The messaging driver includes continuous network listeners. If the network link drops or the RabbitMQ broker undergoes a clustered failover, connection interception logic initiates a structured recursive re-connection sweep every `5000ms`, keeping the background container online indefinitely.

### 2. Flow Control (Prefetch Management)

To prevent event spike flooding, the consumer sets `prefetch(1)`. The service requests precisely **one event** from RabbitMQ, processes it completely through the use case chain, sends the email, and then fires a transaction termination acknowledge (`ack`). The next event is only delivered once the previous loop completes.

### 3. Fault Tolerance & Dead-Lettering (DLX/DLQ)

If an execution loop encounters a network timeout or external vendor API failure (e.g., Resend API is unreachable), the exception catch block fires a negative acknowledgment (`nack(message, false, false)`).
Because the service queue is bound with an active `"x-dead-letter-exchange"` argument config, RabbitMQ automatically routes the failed transaction packet directly into the platform's global **Dead-Letter Exchange (DLX)** and corresponding **Dead-Letter Queue (DLQ)** for safe storage and diagnostic replaying.

---

## 📂 Project Directory Breakdown

```text
src/
├── domain/                          # Pure business rules (Framework-agnostic)
│   └── entities/
│       └── NotificationEntity.ts    # Standard schema for an outgoing alert
│
├── application/                     # Orchestration & Interface contracts
│   ├── dto/                         # Explicit parameters contracts mapping incoming requests
│   ├── interfaces/                  # Ports definition (messaging interfaces, mailer interfaces)
│   └── use-case/                    # Business action orchestration flows
│
├── presentation/                    # Entry Adapters / Transport Layers
│   ├── event-handlers/              # Event controllers translating Events to DTOs
│   ├── messaging/                   # Router implementations (EventDispatcher)
│   └── notification-service.module.ts # Composition Root (Dependency Injection Assembly)
│
├── infrastructure/                  # Low-Level Network Framework Drivers
│   └── services/                    # RabbitMQ connections setup & Resend Mailer clients
│
├── app.ts                           # Express App Factory setup (Middlewares, routers mounting)
├── application.config.ts            # Environment properties validation & typing schema
└── index.ts                         # System Bootstrap entry point
```

---

## ⚙️ Setting Up Environment Properties

Create a `.env` file in the root of the service matching the following variables:

```ini
PORT=4000
NODE_ENV=development

# Messaging Configurations
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_EXCHANGE_NAME=sharemyride.events
RABBITMQ_QUEUE_NAME=smr.notifications.queue

# Mail Provider Configurations
RESEND_API_KEY=re_your_secret_production_key
RESEND_EMAIL_FROM=ShareMyRide <noreply@yourdomain.com>

# Frontend Activation Links URL
FRONTEND_URL=http://localhost:3000
```

---

## 🛠️ Operational Scripts

Run these scripts from within the workspace subdirectory or via the workspace root:

```bash
# Start development hot-reloading environment
pnpm dev

# Execute typescript verification check across files
pnpm type-check

# Run static codebase analysis lint scans
pnpm lint

# Compile typescript down to production javascript build assets
pnpm build

# Execute production compiled distribution build files
pnpm start
```

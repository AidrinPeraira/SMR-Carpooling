# Features & Tech Stack

> This document showcases the features built into the ShareMyRide platform and the technology choices behind them.

---

## User Service

### Authentication & Session Management

| Feature                          | Tech / Approach                                            |
| :------------------------------- | :--------------------------------------------------------- |
| Email/password signup            | `crypto` module (Node.js built-in) for password hashing    |
| Email verification (link-based)  | Verification tokens, email via **Resend**                  |
| Email/password login             | JWT access + refresh tokens via `jsonwebtoken`             |
| Google OAuth integration         | Google Auth library for server-side token verification     |
| Token management                 | JWT access tokens (short-lived) + refresh tokens (long-lived) |
| Session management               | **Redis**-backed session store for active session tracking |
| Logout                           | Session invalidation via Redis                             |
| Password reset flow              | Token-based forgot → verify → reset flow with email notifications |
| Role switching (Passenger ↔ Driver) | In-session role toggle with token reissue               |
| User blacklisting                | Redis blacklist checked at the API Gateway level           |

### Profile Management

| Feature                 | Tech / Approach                                                  |
| :---------------------- | :--------------------------------------------------------------- |
| Get/update user profile | MongoDB document with flexible schema                            |
| Profile picture upload  | **AWS S3** presigned URL generation → client-side direct upload  |
| Avatar management       | Separate upload URL generation and avatar confirmation endpoints |

### Driver & Vehicle Applications

| Feature                                  | Tech / Approach                                          |
| :--------------------------------------- | :------------------------------------------------------- |
| Driver onboarding application            | Multi-step application with document uploads (S3)        |
| Vehicle registration application         | New vehicle + renewal workflows                          |
| Application resubmission                 | Returned applications can be corrected and resubmitted   |
| Application tracking                     | View application history, status, and details            |
| File upload for documents                | S3 presigned URLs for license, registration, etc.        |

### Admin Operations

| Feature                          | Tech / Approach                                             |
| :------------------------------- | :---------------------------------------------------------- |
| View all users                   | Paginated user listing                                      |
| View full user profile           | Detailed admin view of any user's complete profile          |
| Block/unblock users              | Status change propagated via **RabbitMQ** to all services   |
| Review & process applications    | Approve/reject/return with admin comments                   |
| Application details              | Full application details view for admin review              |

---

## Trip Service

### Trip Management

| Feature                     | Tech / Approach                                                     |
| :-------------------------- | :------------------------------------------------------------------ |
| Create a new trip           | Driver specifies route, date/time, seats, vehicle. Stored in **PostgreSQL** via **Prisma** |
| Search for trips            | Passenger search using **H3 geo-indexing** (Uber's hexagonal spatial index) for route matching |
| View trip details           | Driver and passenger views with different detail levels             |
| Journey details             | Passenger-specific journey view with pickup/dropoff information     |
| Cancel trip                 | Driver cancellation triggers refunds and notifications via events   |
| Trip geo-index cleanup      | Scheduled via **Upstash QStash** webhooks for expired trips        |

### Booking Management

| Feature                     | Tech / Approach                                                     |
| :-------------------------- | :------------------------------------------------------------------ |
| Create booking request      | Passenger requests to join a trip                                   |
| Accept/reject bookings      | Driver approval workflow                                            |
| Withdraw booking            | Passenger can withdraw before acceptance                            |
| Initiate booking payment    | Creates a payment order via the Payment Service                     |
| Cancel confirmed booking    | Triggers refund to wallet via **RabbitMQ** event                   |
| Booking payment cleanup     | Unpaid bookings auto-cleaned via scheduled **QStash** webhooks     |

### Vehicle & Driver

| Feature                | Tech / Approach                                        |
| :--------------------- | :----------------------------------------------------- |
| Get driver vehicles    | Vehicle listing for authenticated drivers              |
| Get driver details     | Driver profile and status                              |

### Admin (Trip Service)

| Feature                    | Tech / Approach                                              |
| :------------------------- | :----------------------------------------------------------- |
| Configuration management   | Pricing rules and vehicle type configs (**Redis** cached)    |
| List/view all trips        | Admin paginated listing with trip details                    |
| List/view all bookings     | Admin paginated listing with booking details                 |
| Driver details             | Admin view of any driver's details                           |
| Driver vehicles            | Admin view of any driver's vehicles                          |
| Places management          | Manage known places/locations with Redis cache               |

---

## Payment Service

### Payment Processing

| Feature                     | Tech / Approach                                                    |
| :-------------------------- | :----------------------------------------------------------------- |
| Create booking payment order | **RazorPay** order creation for booking payments                  |
| Verify payment              | RazorPay signature verification for payment confirmation           |
| Pay with wallet             | Direct wallet balance deduction for bookings                       |
| Failed payment handling     | Automatic cleanup and status update                                |
| Booking payment cleanup     | Stale payment orders cleaned via scheduled **QStash** webhooks    |

### Wallet System

| Feature                | Tech / Approach                                   |
| :--------------------- | :------------------------------------------------ |
| Auto-creation          | Wallet created on user signup via event            |
| Wallet transactions    | Transaction history with balance tracking          |
| Refund to wallet       | Cancellation refunds credited automatically        |

### Admin (Payment Service)

| Feature               | Tech / Approach                           |
| :-------------------- | :---------------------------------------- |
| List transactions     | Paginated transaction listing for admins  |

---

## Notification Service

### Email Notifications

| Trigger Event               | Email Sent To | Tech / Approach        |
| :-------------------------- | :------------ | :--------------------- |
| User signup                 | User          | **Resend** with custom domain |
| Password change request     | User          | Token-based verification link |
| Password changed            | User          | Confirmation email     |
| Application approved        | User          | Status notification    |
| Application rejected        | User          | Status notification    |
| Application returned        | User          | Resubmission prompt    |
| New booking request         | Driver        | Booking alert          |
| Booking payment success     | Passenger     | Payment confirmation   |
| Booking payment failed      | Passenger     | Payment failure alert  |
| Booking cancellation        | Driver + Passenger | Cancellation notice |
| Trip cancellation           | All passengers | Cancellation + refund notice |

**Architecture**: Pure event consumer — no REST API. Subscribes to **RabbitMQ** queues and dispatches emails via Resend.

---

## Realtime Service

### Chat System

| Feature               | Tech / Approach                                                    |
| :-------------------- | :----------------------------------------------------------------- |
| Trip chat             | **Socket.IO** with namespace-based rooms per trip                  |
| Join/leave chat       | Socket events for trip chat room management                        |
| Send messages         | Real-time message broadcast via Socket.IO                          |
| Message sync          | HTTP endpoint for loading chat history (MongoDB)                   |
| Chat lifecycle        | Auto-created on trip creation, closed on trip cancellation (via events) |

### Voice Calling

| Feature               | Tech / Approach                                                    |
| :-------------------- | :----------------------------------------------------------------- |
| Initiate call         | **WebRTC** signaling via Socket.IO                                 |
| Accept/reject call    | Signaling events with session tracking (MongoDB)                   |
| End call              | Call session cleanup                                               |
| Relay ICE/SDP signals | Peer-to-peer connection setup relay                                |
| Call timeout          | Automatic timeout handling for unanswered calls                    |

### Member Management

| Feature                  | Tech / Approach                                             |
| :----------------------- | :---------------------------------------------------------- |
| Auto member creation     | On user signup event from **RabbitMQ**                      |
| Active trip tracking     | Members associated with active trips (added/removed via events) |

---

## Cross-Cutting Features

### API Gateway

| Feature                  | Tech / Approach                                                   |
| :----------------------- | :---------------------------------------------------------------- |
| Request proxying         | **http-proxy-middleware** (supports WebSocket for realtime)       |
| Auth verification        | JWT token verification at the gateway level                       |
| User blacklisting        | **Redis**-backed blacklist check before proxying                 |
| API versioning           | Path-based versioning (`/api/v1/...`)                            |
| WebSocket proxying       | Socket.IO connections proxied to Realtime Service                |

### Event-Driven Architecture

| Feature                  | Tech / Approach                                                   |
| :----------------------- | :---------------------------------------------------------------- |
| Async communication      | **RabbitMQ** topic exchange with pattern-based routing            |
| Dead lettering           | Dead letter exchange + queue for failed message recovery          |
| Event propagation        | User/booking/trip/payment lifecycle events broadcast to all interested services |

### Observability

| Feature                  | Tech / Approach                                                   |
| :----------------------- | :---------------------------------------------------------------- |
| Metrics                  | **OpenTelemetry** → **Prometheus** (Grafana Cloud)               |
| Logs                     | **OpenTelemetry** → **Loki** (Grafana Cloud)                     |
| Traces                   | **OpenTelemetry** → **Tempo** (Grafana Cloud)                    |
| HTTP metrics             | Custom middleware in each service for request-level metrics        |
| Dashboards               | Grafana Cloud dashboards for system and request metrics           |

### Security

| Feature                     | Tech / Approach                                               |
| :-------------------------- | :------------------------------------------------------------ |
| Query injection prevention  | MongoDB query parameter validation to prevent injection attacks |
| Helmet                      | HTTP security headers on all services                          |
| CORS                        | Configured on all services                                     |
| Gateway key                 | Inter-service communication secured with shared key            |
| Role-based access           | Middleware-enforced role checks (Admin, Driver, Passenger)     |

### Infrastructure

| Feature                  | Tech / Approach                                                   |
| :----------------------- | :---------------------------------------------------------------- |
| Containerization         | **Docker** multi-stage builds (dev + prod) with build caching    |
| Monorepo                 | **pnpm** workspaces                                              |
| Shared packages          | `@sharemyride/shared` (DTOs, enums, errors), `@sharemyride/ui` (Storybook components) |
| UI component library     | **Storybook** + Vite for isolated component development          |
| Testing                  | **Vitest** + **Testcontainers** (temp Docker containers for integration tests) |
| API testing              | **Bruno** (offline, CLI-capable, lives alongside project)        |

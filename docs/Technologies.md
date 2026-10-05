# Technology Choices

This document explains **why** each technology was chosen for the project — the reasoning behind the stack.

---

## Consola — Logger

- Handles both browser-side and server-side logging from a single package.
- This allows one logger across both the Next.js frontend and all backend services, unifying logs for observability.
- Most alternatives are purely server-side and unavailable in the browser. Using anything else would require conditional environment checks and separate implementations.

[Consola Docs](https://www.npmjs.com/package/consola)

---

## Docker — Containerization

- Industry best practice to ensure the app runs in the same environment across all devices.
- Two Dockerfiles: one for development, one for production. Both use multi-stage builds with build caching.
- The dev image allows catching production-image issues early during development.

[Docker Security Best Practices (Snyk)](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)

---

## Storybook — UI Component Library

- Building reusable UI components independently, isolated from business logic, ensures they are genuinely reusable — not just split-up code files.
- Storybook runs as its own tiny frontend, separate from the main app, and packages components into `@sharemyride/ui` for consumption by any project.
- Components built: Button, Input, Checkbox/Toggle, Select, Dropdown Menu, Table, Pagination, Card, Modal, Toast/Alert, Spinner, Sidebar, Tabs.

---

## Vitest — Testing

- Natively compatible with TypeScript — no extra configuration needed.
- The same package works for both frontend and backend testing, keeping the testing stack consistent across the monorepo.

---

## Testcontainers — Temporary Containers for Testing

- Spins up real Docker containers (MongoDB, Redis, PostgreSQL, etc.) for integration tests.
- An in-memory MongoDB instance was considered but was incompatible with the system (Arch Linux), making Testcontainers the practical choice.
- Provides prebuilt classes for common Docker images and supports spinning up any arbitrary container.

---

## RabbitMQ — Message Broker

- Acts as a smart queue so services can stay simple — they only publish and subscribe.
- All event routing and management is handled internally by the broker.
- Uses a **topic exchange** pattern, allowing multiple services to register their own queues that each receive a copy of the same event.
- **Dead lettering** is implemented with a dead letter exchange and queue. Republishing from the dead letter queue is currently manual via the RabbitMQ web UI.

---

## Node.js `crypto` Module — Hashing

- Uses Node's built-in `crypto` module instead of an external package.
- Reduces exposure to third-party vulnerabilities.
- Provides comparable security to dedicated hashing libraries.
- Keeps the dependency footprint smaller.

---

## jsonwebtoken — Token Management

- JWTs are used for access and refresh token management.
- Keeps the server stateless — no need to look up session data on every request (Redis sessions are used for invalidation and blacklisting, not for primary auth).

---

## Redis — Session & Cache Store

- Simple, fast, and widely supported.
- Used for session management, user blacklisting (API Gateway), configuration caching (Trip Service), places caching, and Socket.IO adapter scaling.

---

## Bruno — API Testing

- API collection files live alongside the project in the repo.
- Fully offline — no account or cloud sync required.
- Can run from the CLI, making it suitable for automation.

---

## http-proxy-middleware — API Gateway Proxy

- Industry standard for Express-based proxying.
- More efficient under heavy traffic due to being a wrapper around the lower-level `http-proxy`.
- Supports WebSocket proxying, which is required for the Realtime Service. The simpler alternative (`express-http-proxy`) does not support WebSockets.

---

## Resend — Email Notifications

- Simple setup with a clean API.
- Widely adopted modern alternative to Nodemailer.
- Comes with a dashboard for monitoring delivery.
- Supports custom domain integration for branded emails.

---

## TanStack Query — Server State Management

- Zustand and Redux store state fetched from the server, but have no mechanism for when the server value changes. TanStack Query is designed specifically for managing server-owned state on the client.
- Built-in request caching, background refetching, and stale-while-revalidate patterns.

---

## Prisma — ORM for PostgreSQL (Trip Service)

- PostgreSQL is the right fit for the Trip Service due to complex transactional requirements and the need for strong atomicity guarantees.
- Prisma provides a type-safe, Mongoose-like developer experience for PostgreSQL.
- The Trip Service's relational data model (trips, bookings, vehicles, drivers, passengers, pricing rules, places) aligns well with a relational database.

---

## Upstash QStash — Scheduled Jobs

- Publishes scheduled jobs into a queue that triggers webhooks to the server at the scheduled time.
- No need to manage a separate worker process or cron infrastructure.
- Used for booking payment cleanup (expire unpaid bookings) and trip geo-index cleanup (remove expired trips).

---

## Socket.IO — Real-time Chat

- Handles real-time bidirectional communication for the trip chat system.
- Uses namespace-based separation (`/chat`, `/call`) for different concerns.
- Scales horizontally with the **Redis adapter**, allowing multiple service instances to share socket state.

---

## WebRTC — Voice Calling

- Peer-to-peer voice calling between trip participants.
- The Realtime Service handles signaling (ICE candidates, SDP offers/answers) via Socket.IO; the actual audio stream flows directly between peers.
- No media server required — keeps infrastructure simple and costs low.

---

## OpenTelemetry + Grafana Cloud — Observability

- **OpenTelemetry** instruments each service to export metrics, traces, and logs in a vendor-neutral format.
- **Grafana Cloud** stores and visualizes everything:
  - **Loki** — log aggregation and search.
  - **Prometheus** — system and request metrics.
  - **Tempo** — distributed tracing across services.
- Dashboards in Grafana Cloud provide full visibility into service health, request performance, and error rates.

---

## AWS S3 — File Storage

- Presigned URL pattern: the server generates a time-limited upload URL, and the client uploads directly to S3. This avoids routing large files through the backend.
- Used for profile avatars and driver/vehicle application documents (license scans, registration papers, etc.).

---

## H3 — Geo-Indexing (Trip Search)

- Uber's hexagonal hierarchical spatial index.
- Used in the Trip Service to geo-index trip routes, enabling efficient spatial search for passengers looking for trips along their route.
- Hexagonal tiling avoids the edge artifacts of square grid systems.

---

## RazorPay — Payment Processing

- Handles booking payment order creation, payment verification, and refund processing.
- Wallet system built on top — cancellation refunds are credited to the user's in-app wallet for future bookings.

# ShareMyRide: Carpooling Platform

## Description

**ShareMyRide** is a platform designed to connect solo travelers for long-distance carpooling. Our mission is to transform the solo commute into a shared experience that is cost-effective, sustainable, and enjoyable.

**"Share the Car. Share the Journey. Share the Expenses."**

The system is architected as a set of **Microservices** using **Clean Architecture** principles, ensuring that the business logic remains independent of the technological infrastructure.

## Tech Stack

- **Frontend**: Next.js (SSR), ShadCN UI, Tailwind CSS.
- **Backend**: Node.js, Express, TypeScript.
- **Architecture**: Clean Architecture, Microservices, Event-Driven.
- **Infrastructure**: MongoDB (State), Redis (Sessions), RabbitMQ (Messaging), Docker.
- **Observability**: Prometheus, Grafana, Loki.

## Reference Documentation

For detailed technical information, please refer to the following guides:

- **[Architecture Guide](./docs/Architecture.md)**: System design and microservices overview.
- **[Project Structure](./docs/ProjectStructure.md)**: Folder organization and Clean Architecture layers.
- **[API Reference](./docs/API.md)**: Detailed endpoint documentation and Postman links.
- **[Features Tracker](./docs/Features.md)**: Status of implemented and planned features.
- **[Developer Notes](./docs/Notes.md)**: Roadmap, known bugs, and action items.

## Services Overview

| Service                   | Responsibility                                                       |
| :------------------------ | :------------------------------------------------------------------- |
| **API Gateway**           | Request orchestration, proxying, and session validation.             |
| **User Service**          | Identity, Authentication, Profile management, and Driver validation. |
| **Trip Service**          | Trip creation, discovery, and management logic.                      |
| **Notification Service**  | Asynchronous email and push notification delivery.                   |
| **Communication Service** | Real-time chat and voice signaling.                                  |
| **Payment Service**       | Financial transaction processing via Stripe/Razorpay.                |

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/) (v10+)
- [Docker & Docker Compose](https://www.docker.com/)

### Steps

1. **Clone the Repository**

   ```bash
   git clone <repo-url>
   cd SMR-Project2
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Setup Infrastructure**
   Start MongoDB, Redis, and RabbitMQ using Docker:

   ```bash
   pnpm run infra:up
   ```

4. **Environment Variables**
   Ensure each service has the appropriate `.env` file (refer to individual service directories for templates).

5. **Start Development Server**
   This script will start all backend services and the frontend concurrently:
   ```bash
   pnpm run dev
   ```

### Clean Architecture Boundaries

- Ensure business logic stays in the `domain` and `application` layers.
- Avoid cross-service database access; use events for data redundancy if needed.

## License

This project is licensed under the ISC License.

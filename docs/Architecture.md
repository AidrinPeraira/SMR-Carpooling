# ShareMyRide Architecture

"ShareMyRide" is a platform that connects people travelling solo over long distances. It helps them share their car with others who are travelling along the same route.

**Share the Car. Share the Journey. Share the Expenses.**

Users can become passengers or drivers and switch between roles to hitch a ride or offer one. The system is built on a microservices architecture to ensure scalability and independent deployment of core features.

---

## 2. Core Services (Business Logic)

The ecosystem is partitioned into seven specialized services, coordinated through an API Gateway.

| Service                   | Purpose            | Key Responsibilities                                                                                   |
| :------------------------ | :----------------- | :----------------------------------------------------------------------------------------------------- |
| **Next JS Frontend**      | User Interface     | Provides a responsive web interface for drivers and passengers to manage trips and profiles.           |
| **API Gateway**           | Orchestration      | Acts as the entry point for all client requests; handles routing, rate limiting, and request proxying. |
| **User Service**          | Identity & Profile | Manages user accounts, authentication, vehicle details, and business admin verifications.              |
| **Trip Service**          | Core Logic         | Handles the creation, discovery, and management of carpooling trips and routes.                        |
| **Payment Service**       | Financials         | Processes transactions via Stripe and maintains financial records of shared expenses.                  |
| **Notification Service**  | Engagement         | Dispatches email and push notifications triggered by system events.                                    |
| **Communication Service** | Real-time          | Facilitates the chat system and Voice calling signaling via WebSockets and webRTC.                     |

---

## 3. Workflow (Example)

### Scenario: Booking a Shared Ride

1. **Trip Creation**: A user (Driver) creates a trip from City A to City B, specifying the date, time, and available seats.
2. **Trip Discovery**: Another user (Passenger) searches for trips matching their target route and date.
3. **Request & Approval**: The passenger requests to join the trip. The **Notification Service** alerts the driver.
4. **Coordination**: Once approved, the passenger and driver can use the **Communication Service** (Chat/Voice) to coordinate details.
5. **Payment Processing**: The **Payment Service** handles the expense sharing transaction through Stripe.
6. **Trip Execution**: The driver uses **MapBox** (via the frontend) for navigation while the platform tracks the journey status.

---

## 4. System Architecture

### 4.1 System Context Diagram

The overall relationship between users, external services (Stripe, MapBox), and the ShareMyRide system.

![System Context](./diagrams/System%20Context.svg)

### 4.2 System Container Diagram

Detailed view of internal microservices, persistence layers (MongoDB, Redis), and asynchronous communication (RabbitMQ).

![System Container](./diagrams/System%20Container.svg)

### 4.3 User Service Component

Handles authentication, identity, and user profile management. It includes modules for role-specific data and admin verification.

- **Internal Modules**:
  - **Auth Module**: Core authentication logic and session management.
  - **Profile Module**: Management of user-specific profile data.
  - **Driver Module**: Handling driver-specific registrations and vehicle association.
  - **Admin Module**: Tools for user management and verification of driver/vehicle applications.
- **Persistence**: MongoDB with specialized collections: `User`, `Vehicle`, `Verification OTPs`, `Vehicle Applications`, and `Driver Applications`. Redis for session caching.

![User Service Component](./diagrams/User%20Service%20Component.svg)

### 4.4 Trip Service Component

Manages the entire lifecycle of a shared ride, from creation to booking and post-trip ratings.

- **Internal Modules**:
  - **Trip Module**: Core CRUD for trip offers and matching logic.
  - **Booking Module**: Managing join requests and approval workflows.
  - **Ratings Module**: Handling feedback and ratings for both drivers and passengers.
- **Persistence**: MongoDB with specialized collections for `Trip`, `Bookings`, and `Ratings`.

![Trip Service Component](./diagrams/Trip%20Service%20Component.svg)

### 4.5 Payment Service Component

Orchestrates financial flows and provides an audit trail of all expense-sharing activities.

- **Internal Modules**:
  - **Payment Module**: Integration with Stripe for processing funds.
  - **Payout Module**: Handling distributions and wallet management.
  - **Transactions Module**: Maintaining a ledger of all financial activities.
- **Persistence**: MongoDB for transaction history and wallet states via `Transactions` and `Wallets` collections.

![Payment Service Component](./diagrams/Payment%20Service%20Component.svg)

### 4.6 Notification Service Component

An asynchronous consumer that listens for system events and triggers multi-channel alerts.

- **Alert Channels**: Supports both **Email** and **Push** notifications.
- **Trigger Events**: Consumes events published by other services, including **Payment**, **Chat**, and general **Notification** events.

![Notification Service Component](./diagrams/Notification%20Service%20Component.svg)

### 4.7 RabbitMQ Message Broker

The backbone of the system's asynchronous communication, ensuring loose coupling between microservices.

- **Specialized Queues**:
  - **Auth Event Queue**: User-related lifecycle events.
  - **Application Events Queue**: Driver and vehicle verification flows.
  - **Booking/Trip Event Queues**: Trip lifecycle and reservation updates.
  - **Payment/Communication Queues**: Financial transactions and messaging alerts.

![Rabbit MQ Message Broker](./diagrams/Rabbit%20MQ_%20Message%20Broker%20Component.svg)

---

## 5. Technical Constraints & Architecture

To ensure long-term scalability and maintainability, the following technical mandates are in place:

- **Clean Architecture**: Each service must implement Clean Architecture principles to ensure business logic remains independent of external frameworks (Express, MongoDB, etc.).
- **Microservices Deployment**: Each service is independent, ownable, and scalable. Communication is handled via the API Gateway for synchronous requests and RabbitMQ for asynchronous events.
- **Event-Driven Communication**: Long-running or cross-service updates (e.g., notifying a user after a payment) must be handled asynchronously via the Message Broker.
- **Database Isolation**:
  - Each service manages its own data source.
  - **No inter-service database joins** are permitted.
  - User Service uses MongoDB for profiles and Redis for session management.
  - Trip Service uses MongoDB for trip data.
- **Observability**: The system uses **Loki** for log scraping and **Grafana** for metrics visualization, ensuring full visibility into the health of all services.

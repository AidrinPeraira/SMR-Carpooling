# API Reference

All endpoints are accessed through the API Gateway. The base URL pattern is `/api/v1/...`.

---

## User Service

### Authentication

**Base Path:** `/api/v1/auth`

| Method | Endpoint            | Description                                    | Auth Required |
| :----- | :------------------ | :--------------------------------------------- | :------------ |
| `POST` | `/signup`           | Register a new user account.                   | No            |
| `POST` | `/verify-email`     | Verify email to complete registration.         | No            |
| `POST` | `/login`            | Login with credentials to receive tokens.      | No            |
| `POST` | `/google`           | Authenticate using Google OAuth.               | No            |
| `POST` | `/refresh-token`    | Get new tokens using a refresh token.          | No            |
| `POST` | `/forgot-password`  | Generate a password change token.              | No            |
| `POST` | `/change-password`  | Change password using a valid token.           | No            |

### Profile

**Base Path:** `/api/v1/profile`

| Method  | Endpoint             | Description                                    | Auth Required           |
| :------ | :------------------- | :--------------------------------------------- | :---------------------- |
| `GET`   | `/`                  | Retrieve the authenticated user's profile.     | Yes                     |
| `PATCH` | `/`                  | Update user profile details.                   | Yes                     |
| `POST`  | `/avatar/upload-url` | Get a presigned S3 URL for avatar upload.      | Yes                     |
| `PATCH` | `/avatar`            | Confirm and update the user's avatar.          | Yes                     |
| `PATCH` | `/role`              | Switch role between Passenger and Driver.      | Yes                     |

### Applications (Driver & Vehicle)

**Base Path:** `/api/v1/applications`

| Method  | Endpoint                              | Description                                     | Auth Required          |
| :------ | :------------------------------------ | :---------------------------------------------- | :--------------------- |
| `POST`  | `/upload-url`                         | Get a presigned S3 URL for document upload.     | Yes (Driver/Passenger) |
| `POST`  | `/onboarding`                         | Submit a driver onboarding application.         | Yes (Driver/Passenger) |
| `POST`  | `/vehicle`                            | Submit a new vehicle application.               | Yes (Driver/Passenger) |
| `POST`  | `/renew/driver`                       | Submit a driver renewal application.            | Yes (Driver/Passenger) |
| `POST`  | `/renew/vehicle`                      | Submit a vehicle renewal application.           | Yes (Driver/Passenger) |
| `PATCH` | `/resubmit/onboarding/:applicationId` | Resubmit a returned onboarding application.     | Yes (Driver/Passenger) |
| `PATCH` | `/resubmit/vehicle/:applicationId`    | Resubmit a returned vehicle application.        | Yes (Driver/Passenger) |
| `PATCH` | `/resubmit/renew/driver/:applicationId` | Resubmit a returned driver renewal.           | Yes (Driver/Passenger) |
| `PATCH` | `/resubmit/renew/vehicle/:applicationId` | Resubmit a returned vehicle renewal.          | Yes (Driver/Passenger) |
| `GET`   | `/`                                   | List user's applications.                       | Yes (Driver/Passenger) |
| `GET`   | `/:applicationId`                     | Get details of a specific application.          | Yes (Driver/Passenger) |

### Admin — Users

**Base Path:** `/api/v1/admin/users`

| Method  | Endpoint        | Description                                  | Auth Required |
| :------ | :-------------- | :------------------------------------------- | :------------ |
| `GET`   | `/`             | List all registered users.                   | Yes (Admin)   |
| `GET`   | `/:userId`      | Get full profile details of a user.          | Yes (Admin)   |
| `PATCH` | `/block/:id`    | Block a user account.                        | Yes (Admin)   |
| `PATCH` | `/unblock/:id`  | Unblock a user account.                      | Yes (Admin)   |

### Admin — Applications

**Base Path:** `/api/v1/admin/applications`

| Method | Endpoint           | Description                                   | Auth Required |
| :----- | :----------------- | :-------------------------------------------- | :------------ |
| `GET`  | `/`                | List all submitted applications.              | Yes (Admin)   |
| `GET`  | `/:applicationId`  | Get details of a specific application.        | Yes (Admin)   |
| `POST` | `/process`         | Process (approve/reject/return) an application. | Yes (Admin)   |

---

## Trip Service

### Trips

**Base Path:** `/api/v1/trips`

| Method | Endpoint                    | Description                                    | Auth Required    |
| :----- | :-------------------------- | :--------------------------------------------- | :--------------- |
| `POST` | `/`                         | Create a new trip.                             | Yes (Driver)     |
| `GET`  | `/driver`                   | List all trips for the driver.                 | Yes (Driver)     |
| `GET`  | `/driver/:tripId`           | Get details of a specific driver trip.         | Yes (Driver)     |
| `PATCH`| `/driver/:tripId/cancel`    | Cancel a trip.                                 | Yes (Driver)     |
| `POST` | `/search`                   | Search for matching trips.                     | Yes (Passenger)  |
| `POST` | `/journey-details`          | Get journey details for a trip.                | Yes (Passenger)  |

### Bookings

**Base Path:** `/api/v1/bookings`

| Method  | Endpoint                         | Description                                    | Auth Required    |
| :------ | :------------------------------- | :--------------------------------------------- | :--------------- |
| `POST`  | `/`                              | Create a new booking request.                  | Yes (Passenger)  |
| `GET`   | `/driver`                        | List all bookings for the driver.              | Yes (Driver)     |
| `GET`   | `/driver/:bookingId`             | Get details of a specific driver booking.      | Yes (Driver)     |
| `PATCH` | `/:bookingId/accept`             | Accept a booking request.                      | Yes (Driver)     |
| `PATCH` | `/:bookingId/reject`             | Reject a booking request.                      | Yes (Driver)     |
| `GET`   | `/passenger`                     | List all bookings for the passenger.           | Yes (Passenger)  |
| `GET`   | `/passenger/:bookingId`          | Get details of a specific passenger booking.   | Yes (Passenger)  |
| `PATCH` | `/:bookingId/withdraw`           | Withdraw a booking request.                    | Yes (Passenger)  |
| `POST`  | `/:bookingId/initiate-payment`   | Initiate payment for a booking.                | Yes (Passenger)  |
| `PATCH` | `/:bookingId/cancel`             | Cancel a confirmed booking.                    | Yes (Passenger)  |

### Driver

**Base Path:** `/api/v1/driver`

| Method | Endpoint   | Description                         | Auth Required |
| :----- | :--------- | :---------------------------------- | :------------ |
| `GET`  | `/details` | Get the authenticated driver's details. | Yes       |

### Vehicles

**Base Path:** `/api/v1/vehicles`

| Method | Endpoint | Description                              | Auth Required |
| :----- | :------- | :--------------------------------------- | :------------ |
| `GET`  | `/`      | Get the authenticated driver's vehicles. | Yes           |

### Admin — Trips

**Base Path:** `/api/v1/admin/trip`

| Method  | Endpoint                          | Description                                  | Auth Required |
| :------ | :-------------------------------- | :------------------------------------------- | :------------ |
| `GET`   | `/config/`                        | Get all configurations (pricing, vehicles).  | Yes           |
| `POST`  | `/config/pricing`                 | Create a new pricing rule.                   | Yes (Admin)   |
| `PATCH` | `/config/pricing/:id`             | Update a pricing rule.                       | Yes (Admin)   |
| `POST`  | `/config/vehicles`                | Create a new vehicle type config.            | Yes (Admin)   |
| `PATCH` | `/config/vehicles/:id`            | Update a vehicle type config.                | Yes (Admin)   |
| `GET`   | `/driver/details/:driverId`       | Get admin view of a driver's details.        | Yes (Admin)   |
| `GET`   | `/vehicles/:driverId`             | Get admin view of a driver's vehicles.       | Yes (Admin)   |
| `GET`   | `/trips/all`                      | List all trips.                              | Yes (Admin)   |
| `GET`   | `/trips/details/:tripId`          | Get details of a specific trip.              | Yes (Admin)   |
| `GET`   | `/bookings/all`                   | List all bookings.                           | Yes (Admin)   |
| `GET`   | `/bookings/details/:bookingId`    | Get details of a specific booking.           | Yes (Admin)   |

### Webhooks (Trip Service)

**Base Path:** `/api/v1/webhook/trips`

| Method | Endpoint           | Description                                     | Auth Required |
| :----- | :----------------- | :---------------------------------------------- | :------------ |
| `POST` | `/booking-cleanup` | Cleanup expired unpaid bookings (QStash).       | Internal      |
| `POST` | `/trips-cleanup`   | Cleanup expired trip geo-indexes (QStash).      | Internal      |

---

## Payment Service

### Payments

**Base Path:** `/api/v1/payments`

| Method | Endpoint           | Description                                | Auth Required |
| :----- | :----------------- | :----------------------------------------- | :------------ |
| `POST` | `/booking/order`   | Create a RazorPay order for a booking.     | Yes           |
| `POST` | `/booking/verify`  | Verify a completed RazorPay payment.       | Yes           |
| `POST` | `/booking/wallet`  | Pay for a booking using wallet balance.    | Yes           |

### Wallet

**Base Path:** `/api/v1/wallet`

| Method | Endpoint         | Description                              | Auth Required |
| :----- | :--------------- | :--------------------------------------- | :------------ |
| `GET`  | `/transactions`  | Get wallet transaction history.          | Yes           |

### Admin — Transactions

**Base Path:** `/api/v1/admin/transactions`

| Method | Endpoint | Description                              | Auth Required |
| :----- | :------- | :--------------------------------------- | :------------ |
| `GET`  | `/`      | List all transactions.                   | Yes (Admin)   |

### Webhooks (Payment Service)

**Base Path:** `/api/v1/webhook/payments`

| Method | Endpoint                 | Description                                      | Auth Required |
| :----- | :----------------------- | :----------------------------------------------- | :------------ |
| `POST` | `/clear-booking-payment` | Cleanup stale booking payment orders (QStash).   | Internal      |

---

## Realtime Service

### Chat (HTTP)

**Base Path:** `/api/v1/chat`

| Method | Endpoint    | Description                              | Auth Required |
| :----- | :---------- | :--------------------------------------- | :------------ |
| `POST` | `/messages` | Sync/load chat message history.          | Yes           |

### Chat (Socket.IO — `/chat` namespace)

| Event             | Direction       | Description                              |
| :---------------- | :-------------- | :--------------------------------------- |
| `join-chat`       | Client → Server | Join a trip's chat room.                 |
| `leave-chat`      | Client → Server | Leave a trip's chat room.                |
| `send-message`    | Client → Server | Send a message to the trip chat.         |
| Message broadcast | Server → Client | Real-time message delivery to room.      |

### Voice Call (Socket.IO — `/call` namespace)

| Event            | Direction       | Description                              |
| :--------------- | :-------------- | :--------------------------------------- |
| `initiate-call`  | Client → Server | Start a call with a trip member.         |
| `accept-call`    | Client → Server | Accept an incoming call.                 |
| `reject-call`    | Client → Server | Reject an incoming call.                 |
| `end-call`       | Client → Server | End an ongoing call.                     |
| `relay-signal`   | Client → Server | Relay WebRTC ICE/SDP signals.            |
| `call-timeout`   | Server → Client | Notify caller of unanswered call.        |

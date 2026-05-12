## 🛠 API Reference (Quick View)

This is a summary of available endpoints for the **ShareMyRide** platform. For full request/response payloads, environment variables, and testing, please refer to our **[Postman Documentation](https://documenter.getpostman.com/view/40921893/2sBXVmeo6L)**.

---

## 🔐 Authentication

**Base Path:** `/user-service/auth`

| Method | Endpoint                  | Description                                    | Auth Required |
| :----- | :------------------------ | :--------------------------------------------- | :------------ |
| `POST` | `/register`               | Register a new user account.                   | No            |
| `POST` | `/login`                  | Login with credentials to receive tokens.      | No            |
| `POST` | `/verify-and-register`    | Verify OTP to complete account registration.   | No            |
| `POST` | `/resend-otp`             | Resend verification OTP to email.              | No            |
| `POST` | `/forgot-password`        | Initiate the password reset process.           | No            |
| `POST` | `/verify-forgot-password` | Verify OTP for resetting the password.         | No            |
| `POST` | `/reset-password`         | Confirm and update the new password.           | No            |
| `POST` | `/google-auth`            | Authenticate using Google OAuth.               | No            |
| `POST` | `/logout`                 | Invalidate session and logout.                 | Yes           |
| `POST` | `/refresh`                | Get a new access token using a refresh token.  | No            |
| `POST` | `/switch-role`            | Toggle user role between Passenger and Driver. | Yes           |

---

## 👤 User Profile

**Base Path:** `/user-service/profile`

| Method  | Endpoint | Description                                | Auth Required |
| :------ | :------- | :----------------------------------------- | :------------ |
| `GET`   | `/`      | Retrieve the authenticated user's profile. | Yes           |
| `PATCH` | `/`      | Update user profile details.               | Yes           |

---

## 🚗 Driver Management

**Base Path:** `/user-service/driver`

| Method | Endpoint                      | Description                                             | Auth Required |
| :----- | :---------------------------- | :------------------------------------------------------ | :------------ |
| `POST` | `/create-application`         | Submit an application to become a driver.               | Yes           |
| `GET`  | `/check-pending-application`  | Retrieve the status of any pending driver applications. | Yes           |
| `POST` | `/create-vehicle-application` | Register a vehicle for ride-sharing.                    | Yes           |

---

## 🛡️ Admin Operations

**Base Path:** `/user-service/admin`

| Method  | Endpoint                               | Description                                            | Auth Required |
| :------ | :------------------------------------- | :----------------------------------------------------- | :------------ |
| `POST`  | `/driver/process-application`          | Approve or reject a driver application.                | Yes (Admin)   |
| `GET`   | `/driver/get-applications`             | Fetch a list of all submitted driver applications.     | Yes (Admin)   |
| `GET`   | `/vehicle/get-applications`            | Fetch a list of all vehicle registration applications. | Yes (Admin)   |
| `GET`   | `/users/get-all-users`                 | Retrieve a list of all platform users.                 | Yes (Admin)   |
| `PATCH` | `/users/toggle-status`                 | Enable or disable a user account.                      | Yes (Admin)   |
| `POST`  | `/vehicle/process-vehicle-application` | Approve or reject a vehicle registration application.  | Yes (Admin)   |

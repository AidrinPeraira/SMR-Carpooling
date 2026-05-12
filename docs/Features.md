# Features Tracker

> This file tracks implemented, ongoing, and planned features for each module.
> Keep it updated regularly based on [API Documentation](./API.md).

## Status Legend

- [x] Completed
- [ ] Planned
- [~] In Progress

# Features

## User Service

### Auth

- [x] Email and password signup
- [x] Email Verification (OTP-based)
- [x] Resend verification OTP
- [x] Email and password login
- [x] Token Management (Access & Refresh tokens)
- [x] Session Management (Redis-backed)
- [x] Logout
- [x] Google OAuth Integration
- [x] Password Reset flow (Forgot/Verify/Reset)
- [x] Role Switching (Passenger ↔ Driver)

### Profile

- [x] Get current user profile
- [x] Update profile details (Name, Bio, Phone, etc.)
- [x] Profile Picture Upload

### Driver & Vehicle Registration

- [x] Submit Driver Application (License details, etc.)
- [x] Check status of pending driver application
- [x] Submit Vehicle Registration Application
- [ ] Veiw Submitted Applications and status. (Track / View Application history)

### Admin

- [x] View all registered users
- [x] Toggle user status (Activate/Deactivate/Block)
- [x] Force log-out / Clear sessions
- [x] Review and process Driver applications (Approve/Reject)
- [x] Review and process Vehicle applications (Approve/Reject)
- [x] View all driver applications
- [ ] View all vehicle applications

## Trip Module (Trip Service)

- [ ] Create a new trip (Driver)
- [ ] Search for trips (Passenger)
- [ ] View trip details (Passenger, Driver)
- [ ] Request to join a trip (Passenger)
- [ ] Accept/Reject trip requests (Driver)
- [ ] Manage trip status (Started/Completed/Cancelled)
- [ ] Route navigation integration (MapBox)

## Payment Module (Payment Service)

- [ ] Secure payment processing (Razorpay)
- [ ] Expense sharing calculation
- [ ] Payouts for drivers
- [ ] wallet
- [ ] Cancellation & Refunds
- [ ] Transaction history

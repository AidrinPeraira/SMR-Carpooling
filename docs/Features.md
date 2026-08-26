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
- [x] Email Verification (link-based)
- [x] Resend verification email - ?
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
- [x] Veiw Submitted Applications and status. (Track / View Application history)

### Admin

- [x] View all registered users
- [x] Toggle user status (Activate/Deactivate/Block)
- [x] Force log-out / Clear sessions (use redis blacklist)
- [x] Review and process Driver applications (Approve/Reject)
- [x] Review and process Vehicle applications (Approve/Reject)
- [x] View all driver applications
- [x] View all vehicle applications

## Trip Module (Trip Service)

- [x] Create a new trip (Driver)
- [x] Search for trips (Passenger)
- [x] View trip details (Passenger, Driver)
- [x] Request to join a trip (Passenger)
- [x] Accept/Reject trip requests (Driver)
- [ ] Manage trip status (Started/Completed/Cancelled)
- [ ] Route navigation integration (MapBox)

## Payment Module (Payment Service)

- [x] Secure payment processing (Stripe)
- [x] Expense sharing calculation
- [ ] Payouts for drivers
- [x] wallet
- [x] Cancellation & Refunds
- [ ] Transaction history

## Common Features

- [ ] System wide config with redundant db across services

## Security Feature

- [x] Query validation prevents mongo db query injection via the query params

//list transactions in profile
//list transactions for admin
//chat call

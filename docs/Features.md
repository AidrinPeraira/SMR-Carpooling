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

- [] Email and password signup
- [] Email Verification (OTP-based)
- [] Resend verification OTP
- [] Email and password login
- [] Token Management (Access & Refresh tokens)
- [] Session Management (Redis-backed)
- [] Logout
- [] Google OAuth Integration
- [] Password Reset flow (Forgot/Verify/Reset)
- [] Role Switching (Passenger ↔ Driver)

### Profile

- [] Get current user profile
- [] Update profile details (Name, Bio, Phone, etc.)
- [] Profile Picture Upload

### Driver & Vehicle Registration

- [] Submit Driver Application (License details, etc.)
- [] Check status of pending driver application
- [] Submit Vehicle Registration Application
- [] Veiw Submitted Applications and status. (Track / View Application history)

### Admin

- [] View all registered users
- [] Toggle user status (Activate/Deactivate/Block)
- [] Force log-out / Clear sessions
- [] Review and process Driver applications (Approve/Reject)
- [] Review and process Vehicle applications (Approve/Reject)
- [] View all driver applications
- [] View all vehicle applications

## Trip Module (Trip Service)

- [] Create a new trip (Driver)
- [] Search for trips (Passenger)
- [] View trip details (Passenger, Driver)
- [] Request to join a trip (Passenger)
- [] Accept/Reject trip requests (Driver)
- [] Manage trip status (Started/Completed/Cancelled)
- [] Route navigation integration (MapBox)

## Payment Module (Payment Service)

- [] Secure payment processing (Razorpay)
- [] Expense sharing calculation
- [] Payouts for drivers
- [] wallet
- [] Cancellation & Refunds
- [] Transaction history

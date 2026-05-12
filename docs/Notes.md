# Development Notes & To-Do List

## Action Items

- [ ] Check pending application -> optimize to prevent unnecessary renders
- [ ] Implement "User add new vehicle" flow
- [ ] Enable updating driver details
- [ ] Enable license renewal flow
- [ ] Enable vehicle registration renewal
- [ ] Add role-based middleware in User Services

## Critical

- [ ] Refactor custom session ID logic (currently limits max number of sessions)
- [ ] Modify "Create Driver Application" to verify user ID and existence
- [ ] Create cron jobs to invalidate expired driver and vehicle records
- [ ] Improve edge case checking for vehicle applications:
  - [ ] Multiple cars per user
  - [ ] Handling multiple concurrent/overlapping applications
- [ ] Containerize all servers (Dockerization)
- [ ] Make vehicle models and types configurable from the Admin side
- [ ] Complete or remove placeholders for successful vehicle addition screens

## Non-Critical

- [ ] Create middleware to check for "Authentic Server" in request headers
- [x] Wire up the observability stack (Grafana/Loki/Prometheus)
- [ ] Implement email event-driven notifications:
  - [ ] Notify on new user registration (Events & Consumers)
- [x] Fix: user data persistence in UserState
- [ ] Add mutex using promises to handle multiple concurrent refresh calls from the same client
- [ ] Add ratings section to profile page (post-reviews implemention)
- [ ] Create a `makeResponse` utility for the frontend to ensure consistent data shapes
- [ ] Extarct constants from "Become Driver" form to a common shared library
- [ ] Optimize "Become Driver" form to show uploaded images on mobile screens
- [ ] Delete existing sessions when creating new ones in the session use case
- [ ] Delete images from Cloudinary upon profile update
- [ ] Create an initialization script for fresh DB setups:
  - [ ] Default Admin user
  - [ ] Site settings (e.g., default trip rates)
  - [ ] Vehicle master list
- [ ] Remove hard-coded TTL in Redis session repository
- [ ] Migrate all `.env` variables to `AppConfig` objects
- [ ] Implement Customer Support and SOS features

## Bugs

- [ ] Logging out after deleting all tokens locally causes server crash/error
- [ ] Calling server actions after deleting all tokens causes unhandled errors
- [ ] JSON Serialization error on profile page when access tokens are missing during fetch
- [x] Removed hard-coded URL (port 3000) from Next.js route fetches; moved to `.env`
- [ ] User ID and other counters are incrementing by 2 instead of 1
- [ ] Importing schema in the "Become Driver" form causes parsing issues
- [ ] Bug: "Update Profile" form uses `undefined` initial values (console errors)

## Research

- [ ] Keyvault / HashiCorp Vault implementation for secret management
- [ ] AWS Secret Manager integration
- [ ] System environment variables standardization
- [ ] Jira / CI-CD integration

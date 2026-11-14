# Logging Audit — ShareMyRide

> Generated 2026-11-14. Only actionable items remaining.
> ~~Morgan format~~ ✅ Switched to `"combined"` in production, `"dev"` in dev. Health checks skipped.
> ~~Logger level~~ ✅ Winston level set to `"info"` in production, `"debug"` in dev via `AppConfig.NODE_ENV`.

---

## Legend

| Symbol | Meaning                                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------------- |
| `[ ]`  | Needs review / action                                                                                     |
| Tag    | 🔴 Remove — debug leftover or PII leak · 🟡 Fix — wrong level, should use logger, or downgrade to `debug` |

---

## Backend — `smr-backend/`

### realtime-service

#### Infrastructure

#### EventBus (RabbitMQ)

#### Socket Server

#### SocketIOEmitter

#### Controllers

#### Socket Handlers — Chat

#### Socket Handlers — Call

#### Socket Handlers — Journey

#### Event Handlers

#### EventDispatcher

---

### trip-service

#### Infrastructure

- [ ] `src/infrastructure/store/connect-redis.ts:11` — `logger.info` — Redis client error 🟡 **Should be `logger.error`**

#### EventBus (RabbitMQ) — same pattern as realtime-service

- [ ] `src/infrastructure/services/EventBus.ts:108` — `logger.info` — Connection failed 🟡 **Should be `logger.error`**

#### Controllers — Trip

#### Controllers — Booking

#### Controllers — Journey

#### Controllers — Driver

#### Controllers — Vehicle

#### Controllers — Admin

#### Controllers — Webhook

#### Event Handlers

#### EventDispatcher

#### Debug Leftovers

- [ ] `src/application/use-case/trip/ListTripsUseCase.ts:25` — `console.log` — "Searching for trips" 🔴 **Remove**
- [ ] `src/infrastructure/store/PlacesCacheStore.ts:27` — `console.log` — "Redis place cache matching error" 🔴 **Replace with `logger.error`**
- [ ] `src/infrastructure/repository/TripsRepository.ts:484` — `console.log` — "Origin Places" 🔴 **Remove**

---

### notification-service

#### RabbitMQConsumer

#### Event Handlers

#### EventDispatcher

#### Email Service

- [ ] `src/infrastructure/services/ResendEMailService.ts:24` — `logger.info` — Error sending email 🟡 **Should be `logger.error`**

#### Debug Leftover

- [ ] `src/application/use-case/SendSignupVerificationMailUseCase.ts:32` — `console.log` — Verification URL 🔴 **Remove — leaks URL to console**

---

### payment-service

#### EventBus (RabbitMQ)

#### Controllers

#### Event Handlers

#### EventDispatcher

---

### user-service

#### Infrastructure

- [ ] `src/infrastructure/database/connect-redis.ts:11` — `logger.info` — Redis client error 🟡 **Should be `logger.error`**

#### RabbitMQEventBus

- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:109` — `logger.info` — Connection failed 🟡 **Should be `logger.error`**

#### Controllers — Auth (PII Leaks)

- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:199` — `logger.info` — Changing password (logs email!) 🔴 **Strip PII**

#### Controllers — Profile

#### Controllers — Application

#### Controllers — Admin

#### Event Handlers

- [ ] `src/presentation/v1/messages/event-handler/UpdateVehicleConfigHandler.ts:18` — `logger.info` — Handling event 🟡 Downgrade to `debug`

#### EventDispatcher

- [ ] `src/presentation/v1/messages/EventDispatcher.ts:31` — `logger.info` — Registered 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messages/EventDispatcher.ts:48` — `logger.info` — Calling handler 🟡 Downgrade to `debug`

#### Debug Leftovers

- [ ] `src/application/use-case/auth/VerifySignupEmailUseCase.ts:55` — `console.debug` — Token existence 🔴 **Remove**
- [ ] `src/application/use-case/auth/VerifySignupEmailUseCase.ts:56` — `console.debug` — Token equality 🔴 **Remove — leaks token**
- [ ] `src/application/use-case/auth/VerifySignupEmailUseCase.ts:60` — `console.debug` — Debug output 🔴 **Remove**
- [ ] `src/application/use-case/profile/GetUserUseCase.ts:44` — `console.log` — "Profile URL" 🔴 **Remove**
- [ ] `src/infrastructure/services/GoogleAuthService.ts:43` — `console.log` — Full Google user object 🔴 **Remove — leaks PII**

---

### mcp-service

No remaining issues. All log statements are error-level on failure paths.

---

### api-gateway

#### Console → Logger

- [ ] `src/config/redis.config.ts:10` — `console.error` — Redis client error 🟡 **Replace with `logger.error`**
- [ ] `src/middleware/blacklist.middleware.ts:51` — `console.error` — Blacklist middleware error 🔴 **Replace with `logger.error`**
- [ ] `src/middleware/auth.middleware.ts:60` — `console.log` — Auth middleware error 🔴 **Replace with `logger.error`**
- [ ] `src/services/blacklist.service.ts:20` — `console.error` — Blacklist check error 🔴 **Replace with `logger.error`**

---

## Frontend — `smr-frontend/`

### Middleware / Proxy

- [ ] `proxy.ts:38` — `console.log` — Error getting new tokens 🔴 **Replace with `logger.error`**
- [ ] `proxy.ts:78` — `console.log` — Middleware running on path 🔴 **Remove — very high volume**
- [ ] `proxy.ts:193` — `console.error` — Token verification failed 🟡 Replace with `logger.error`

### API Utilities

- [ ] `lib/api-client.ts:52` — `logger.info` — "Error making client side fetch" 🟡 **Should be `logger.error`**
- [ ] `lib/api-server.ts:76` — `console.warn` — API warning 🟡 Replace with `logger.warn`
- [ ] `lib/api-server.ts:85` — `logger.info` — "Access token expired, attempting refresh" 🟡 Downgrade to `debug`
- [ ] `lib/api-server.ts:94` — `console.warn` — API warning 🟡 Replace with `logger.warn`
- [ ] `lib/api-server.ts:119` — `console.warn` — Failed to clear cookies 🟡 Replace with `logger.warn`

### API Routes

- [ ] `app/api/assistant/route.ts:160` — `console.error` — Assistant route error 🟡 Replace with `logger.error`

### Feature — Auth (Actions)

### Feature — Auth (Components)

### Feature — Application (Actions)

### Feature — Application (Forms)

### Feature — Admin

### Feature — Profile (Actions)

### Feature — Profile (Forms)

- [ ] `features/profile/forms/ProfileUpdateForm.tsx:151` — `console.log` — "Sending password reset mail request" 🔴 **Remove — logs email**

### Feature — Realtime (Socket Hooks)

### Feature — Map

- [ ] `features/map/services/mapbox/MapboxCore.ts:132` — `console.warn` — Map warning 🟡 Downgrade to `debug`
- [ ] `features/map/services/mapbox/MapboxCore.ts:179` — `console.warn` — Geolocate removal 🟡 Downgrade to `debug`
- [ ] `features/map/components/MapContainer.tsx:28` — `console.warn` — Map setup warning 🟡 Downgrade to `debug`

### Feature — Driver

- [ ] `features/driver/trips/forms/CreateTripForm.tsx:64` — `console.log` — "Dest: " 🔴 **Remove**
- [ ] `features/driver/trips/forms/CreateTripForm.tsx:65` — `console.log` — "Origin: " 🔴 **Remove**
- [ ] `features/driver/trips/views/DriverTripDetailsView.tsx:123` — `console.warn` — Map setup failed 🟡 Downgrade to `debug`
- [ ] `features/driver/journey/components/CurrentTargetCard.tsx:177` — `console.log` — Bare error log 🔴 **Remove**

### Feature — AI Chat

- [ ] `features/ai-chat/components/ChatPanel.tsx:21` — `console.log` — Logs chat messages 🔴 **Remove — PII risk**

---

## Summary

| Category                                                     | Count    |
| ------------------------------------------------------------ | -------- |
| 🔴 Remove / fix (debug leftovers, PII leaks, console→logger) | **~22**  |
| 🟡 Downgrade `info` → `debug`                                | **~175** |
| ✅ Already resolved (morgan + logger level)                  | **~388** |

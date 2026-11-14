# Logging Audit — ShareMyRide

> Generated 2026-11-14. Only actionable items remaining.
> ~~Morgan format~~ ✅ Switched to `"combined"` in production, `"dev"` in dev. Health checks skipped.
> ~~Logger level~~ ✅ Winston level set to `"info"` in production, `"debug"` in dev via `AppConfig.NODE_ENV`.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]`  | Needs review / action |
| Tag    | 🔴 Remove — debug leftover or PII leak · 🟡 Fix — wrong level, should use logger, or downgrade to `debug` |

---

## Backend — `smr-backend/`

### realtime-service

#### Infrastructure

- [ ] `src/infrastructure/store/connect-redis.ts:21` — `logger.info` — "Connecting to Redis" 🟡 Downgrade to `debug`

#### EventBus (RabbitMQ)

- [ ] `src/infrastructure/services/EventBus.ts:92` — `logger.info` — Exchange asserted 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:110` — `logger.info` — Connection failed 🟡 **Should be `logger.error`**
- [ ] `src/infrastructure/services/EventBus.ts:111` — `logger.info` — Retrying connection 🟡 **Should be `logger.warn`**
- [ ] `src/infrastructure/services/EventBus.ts:147` — `logger.info` — Bound consumer queue 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:187` — `logger.info` — Event published 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:215` — `logger.info` — Consumer already running 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:222` — `logger.info` — Subscribing consumer 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:248` — `logger.info` — Event received 🟡 Downgrade to `debug`

#### Socket Server

- [ ] `src/presentation/v1/sockets/SocketServer.ts:44` — `logger.info` — Socket connection established 🟡 Downgrade to `debug`

#### SocketIOEmitter

- [ ] `src/infrastructure/sockets/SocketIOEmitter.ts:36` — `logger.info` — leaveRoom socket removed 🟡 Downgrade to `debug`

#### Controllers

- [ ] `src/presentation/v1/http/controllers/JourneyControllerV1.ts:30` — `logger.info` — Getting share token 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/http/controllers/ChatControllerV1.ts:30` — `logger.info` — Getting chat messages 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/http/controllers/ChatControllerV1.ts:32` — `console.log` — `"-----", req.body` 🔴 **Debug leftover**

#### Socket Handlers — Chat

- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:31` — `logger.info` — Registering handlers 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:50` — `logger.info` — onJoinChat 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:71` — `logger.info` — onLeaveChat 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:89` — `logger.info` — onSendMessage 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:111` — `logger.info` — Socket disconnected 🟡 Downgrade to `debug`

#### Socket Handlers — Call

- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:43` — `logger.info` — Registering handlers 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:74` — `logger.info` — onInitiateCall 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:95` — `logger.info` — onAcceptCall 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:113` — `logger.info` — onRejectCall 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:131` — `logger.info` — onCallTimeout 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:152` — `logger.info` — onEndCall 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:170` — `logger.info` — onRelaySignal 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:191` — `logger.info` — Call socket disconnected 🟡 Downgrade to `debug`

#### Socket Handlers — Journey

- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:39` — `logger.info` — Registering handlers 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:66` — `logger.info` — onDriverJoin 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:87` — `logger.info` — onPassengerJoin 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:110` — `logger.info` — onShareTokenJoin 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:131` — `logger.info` — onLocationUpdate 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:151` — `logger.info` — onLeave 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:169` — `logger.info` — Journey socket disconnected 🟡 Downgrade to `debug`

#### Event Handlers

- [ ] `src/presentation/v1/messaging/event-handlers/PassengerDroppedOffEventHandler.ts:17` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerDroppedOffEventHandler.ts:27` — `logger.info` — Success 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerNoShowEventHandler.ts:17` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerNoShowEventHandler.ts:27` — `logger.info` — Success 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/UserSignupEventHandler.ts:21` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/UserSignupEventHandler.ts:31` — `logger.info` — Success 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerCancelBookingEventHandler.ts:22` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerCancelBookingEventHandler.ts:42` — `logger.info` — Success 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/DriverCancelTripEventHandler.ts:22` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/DriverCancelTripEventHandler.ts:51` — `logger.info` — Success 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/JourneyCompletedEventHandler.ts:17` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/JourneyCompletedEventHandler.ts:25` — `logger.info` — Success 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/NewTripEventHandler.ts:24` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/NewTripEventHandler.ts:41` — `logger.info` — Success 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/NewBookingEventHandler.ts:22` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/NewBookingEventHandler.ts:38` — `logger.info` — Success 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/JourneyStartedEventHandler.ts:17` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/event-handlers/JourneyStartedEventHandler.ts:27` — `logger.info` — Success 🟡 Downgrade to `debug`

#### EventDispatcher

- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:23` — `logger.info` — Handler registered 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:38` — `logger.info` — Calling handler 🟡 Downgrade to `debug`

---

### trip-service

#### Infrastructure

- [x] `src/infrastructure/store/connect-redis.ts:11` — ~~`logger.info`~~ → `logger.error` ✅
- [ ] `src/infrastructure/store/connect-redis.ts:15` — `logger.info` — Connecting to Redis 🟡 Downgrade to `debug`

#### EventBus (RabbitMQ) — same pattern as realtime-service

- [ ] `src/infrastructure/services/EventBus.ts:93` — `logger.info` — Exchange asserted 🟡 Downgrade to `debug`
- [x] `src/infrastructure/services/EventBus.ts:108` — ~~`logger.info`~~ → `logger.error` ✅
- [ ] `src/infrastructure/services/EventBus.ts:109` — `logger.info` — Retrying 🟡 **Should be `logger.warn`**
- [ ] `src/infrastructure/services/EventBus.ts:145` — `logger.info` — Bound queue 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:185` — `logger.info` — Event published 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:213` — `logger.info` — Consumer already running 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:220` — `logger.info` — Subscribing consumer 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:246` — `logger.info` — Event received 🟡 Downgrade to `debug`

#### Controllers — Trip

- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:54` — `logger.info` — Creating trip 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:83` — `logger.info` — Searching trips 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:118` — `logger.info` — Getting journey details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:155` — `logger.info` — Fetching driver trips 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:185` — `logger.info` — Fetching trip details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:216` — `logger.info` — Fetching today trip 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:246` — `logger.info` — Canceling trip 🟡 Downgrade to `debug`

#### Controllers — Booking

- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:62` — `logger.info` — Creating booking 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:94` — `logger.info` — Fetching driver bookings 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:123` — `logger.info` — Fetching booking details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:154` — `logger.info` — Accepting booking 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:181` — `logger.info` — Rejecting booking 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:212` — `logger.info` — Fetching passenger bookings 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:245` — `logger.info` — Fetching passenger booking details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:279` — `logger.info` — Withdrawing booking 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:309` — `logger.info` — Initiating payment 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:341` — `logger.info` — Canceling booking 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:368` — `logger.info` — Booking stats 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:396` — `logger.info` — Today trip 🟡 Downgrade to `debug`

#### Controllers — Journey

- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:60` — `logger.info` — Starting journey 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:84` — `logger.info` — Driver journey details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:114` — `logger.info` — Passenger journey details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:148` — `logger.info` — Driver arrived at stop 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:175` — `logger.info` — Driver verifying OTP 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:202` — `logger.info` — Passenger confirming pickup 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:229` — `logger.info` — Driver dropping off 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:256` — `logger.info` — Passenger confirming dropoff 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:283` — `logger.info` — Marking no-show 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:306` — `logger.info` — Completing journey 🟡 Downgrade to `debug`

#### Controllers — Driver

- [ ] `src/presentation/v1/controllers/driver/DriverControllerV1.ts:29` — `logger.info` — Fetching driver details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/driver/DriverControllerV1.ts:53` — `logger.info` — Fetching driver stats 🟡 Downgrade to `debug`

#### Controllers — Vehicle

- [ ] `src/presentation/v1/controllers/vehicle/VehicleControllerV1.ts:27` — `logger.info` — Fetching vehicles 🟡 Downgrade to `debug`

#### Controllers — Admin

- [ ] `src/presentation/v1/controllers/admin/AdminTripControllerV1.ts:57` — `logger.info` — Admin fetching trips 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminTripControllerV1.ts:97` — `logger.info` — Admin trip details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminTripControllerV1.ts:124` — `logger.info` — Admin journey details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminTripControllerV1.ts:152` — `logger.info` — Admin trips count 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminTripControllerV1.ts:179` — `logger.info` — Admin trip trend 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminDriverControllerV1.ts:27` — `logger.info` — Admin driver details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminBookingControllerV1.ts:49` — `logger.info` — Admin bookings list 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminBookingControllerV1.ts:89` — `logger.info` — Admin booking details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminVehicleControllerV1.ts:27` — `logger.info` — Admin vehicle list 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminConfigurationControllerV1.ts:44` — `logger.info` — Admin fetching configs 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminConfigurationControllerV1.ts:96` — `logger.info` — Creating pricing rule 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminConfigurationControllerV1.ts:138` — `logger.info` — Updating pricing rule 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminConfigurationControllerV1.ts:169` — `logger.info` — Creating vehicle config 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminConfigurationControllerV1.ts:212` — `logger.info` — Updating vehicle config 🟡 Downgrade to `debug`

#### Controllers — Webhook

- [ ] `src/presentation/v1/controllers/webhook/WebhookControllerV1.ts:39` — `logger.info` — Cleanup booking payment 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/webhook/WebhookControllerV1.ts:69` — `logger.info` — Cleanup trips indexing 🟡 Downgrade to `debug`

#### Event Handlers

- [ ] `src/presentation/v1/event-handlers/ApplicationApprovedEventHandler.ts:33` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/BookingPaymentFailedEventHandler.ts:14` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/BookingPaymentSuccessEventHandler.ts:17` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/UserBlockedEventHandler.ts:18` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/UserBlockedEventHandler.ts:24` — `logger.info` — Success 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/NewUserEventHandler.ts:14` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/UserUnblockedEventHandler.ts:18` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/UserUnblockedEventHandler.ts:24` — `logger.info` — Success 🟡 Downgrade to `debug`

#### EventDispatcher

- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:23` — `logger.info` — Handler registered 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:38` — `logger.info` — Calling handler 🟡 Downgrade to `debug`

#### Debug Leftovers

- [x] `src/application/use-case/trip/ListTripsUseCase.ts:25` — ~~`console.log`~~ Removed ✅
- [x] `src/infrastructure/store/PlacesCacheStore.ts:27` — ~~`console.log`~~ → `logger.error` ✅
- [x] `src/infrastructure/repository/TripsRepository.ts:484` — ~~`console.log`~~ Removed ✅

---

### notification-service

#### RabbitMQConsumer

- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:69` — `logger.info` — Asserting exchanges 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:116` — `logger.info` — Bound queue 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:128` — `logger.info` — Retrying 🟡 **Should be `logger.warn`**
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:143` — `logger.info` — Consumer already running 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:150` — `logger.info` — Subscribing consumer 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:176` — `logger.info` — Event received 🟡 Downgrade to `debug`

#### Event Handlers

- [ ] `src/presentation/event-handlers/TripCancelationEventHandler.ts:26` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/event-handlers/BookingPaymentSuccessHandler.ts:23` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/event-handlers/NewBookingHandler.ts:29` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/event-handlers/PasswordChangedHandler.ts:21` — `logger.info` — Sending notification 🟡 Downgrade to `debug`
- [ ] `src/presentation/event-handlers/BookingPaymentFailedHandler.ts:23` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/event-handlers/PasswordChangeRequestHandler.ts:22` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/event-handlers/BookingCancellationHandler.ts:26` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/event-handlers/ApplicationApprovedHandler.ts:22` — `logger.info` — Sending notification 🟡 Downgrade to `debug`
- [ ] `src/presentation/event-handlers/ApplicationRejectedHandler.ts:22` — `logger.info` — Sending notification 🟡 Downgrade to `debug`
- [ ] `src/presentation/event-handlers/ApplicationReturnedHandler.ts:22` — `logger.info` — Sending notification 🟡 Downgrade to `debug`
- [ ] `src/presentation/event-handlers/UserSignupHandler.ts:20` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/event-handlers/UserSignupHandler.ts:36` — `logger.info` — Sending verification 🟡 Downgrade to `debug`

#### EventDispatcher

- [ ] `src/presentation/messaging/EventDispatcher.ts:23` — `logger.info` — Registered 🟡 Downgrade to `debug`
- [ ] `src/presentation/messaging/EventDispatcher.ts:38` — `logger.info` — Calling handler 🟡 Downgrade to `debug`

#### Email Service

- [ ] `src/infrastructure/services/ResendEMailService.ts:14` — `logger.info` — Sending email 🟡 Downgrade to `debug`
- [x] `src/infrastructure/services/ResendEMailService.ts:24` — ~~`logger.info`~~ → `logger.error` ✅
- [ ] `src/infrastructure/services/ResendEMailService.ts:26` — `logger.info` — Email sent successfully 🟡 Downgrade to `debug`

#### Debug Leftover

- [x] `src/application/use-case/SendSignupVerificationMailUseCase.ts:32` — ~~`console.log`~~ Removed ✅

---

### payment-service

#### EventBus (RabbitMQ)

- [ ] `src/infrastructure/services/EventBus.ts:93` — `logger.info` — Exchange asserted 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:108` — `logger.info` — Connection failed 🟡 **Should be `logger.error`**
- [ ] `src/infrastructure/services/EventBus.ts:109` — `logger.info` — Retrying 🟡 **Should be `logger.warn`**
- [ ] `src/infrastructure/services/EventBus.ts:145` — `logger.info` — Bound queue 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:185` — `logger.info` — Event published 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:213` — `logger.info` — Consumer already running 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:220` — `logger.info` — Subscribing consumer 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/EventBus.ts:246` — `logger.info` — Event received 🟡 Downgrade to `debug`

#### Controllers

- [ ] `src/presentation/v1/controllers/WebhookControllerV1.ts:22` — `logger.info` — Handling webhook 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/AdminControllerV1.ts:56` — `logger.info` — Admin fetching transactions 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/AdminControllerV1.ts:79` — `logger.info` — Transactions fetched 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/AdminControllerV1.ts:95` — `logger.info` — Fetching summary 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/AdminControllerV1.ts:113` — `logger.info` — Revenue trend 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/WalletControllerV1.ts:45` — `logger.info` — Fetching wallet transactions 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:45` — `logger.info` — Creating payment order 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:49` — `logger.info` — Order created 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:71` — `logger.info` — Verifying payment 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:78` — `logger.info` — Payment verified 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:95` — `logger.info` — Processing wallet payment 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:99` — `logger.info` — Wallet payment completed 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:123` — `logger.info` — Fetching earnings 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/PayoutControllerV1.ts:51` — `logger.info` — Fetching payouts 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/PayoutControllerV1.ts:81` — `logger.info` — Admin fetching payouts 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/PayoutControllerV1.ts:112` — `logger.info` — Admin payout details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/PayoutControllerV1.ts:130` — `logger.info` — Admin approving payout 🟡 Downgrade to `debug`

#### Event Handlers

- [ ] `src/presentation/v1/event-handlers/JourneyPassengerDroppedOffEventHandler.ts:14` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/UserBlockedEventHandler.ts:15` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/UserUnblockedEventHandler.ts:15` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/BookingCancelledByPassengerEventHandler.ts:14` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/NewUserEventHandler.ts:16` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/TripCancelledByDriverEventHandler.ts:14` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/event-handlers/TripCancelledByDriverEventHandler.ts:20` — `logger.info` — Processing refund 🟡 Downgrade to `debug`

#### EventDispatcher

- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:19` — `logger.info` — Registered 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:30` — `logger.info` — Calling handler 🟡 Downgrade to `debug`

---

### user-service

#### Infrastructure

- [x] `src/infrastructure/database/connect-redis.ts:11` — ~~`logger.info`~~ → `logger.error` ✅
- [ ] `src/infrastructure/database/connect-redis.ts:15` — `logger.info` — Connecting to Redis 🟡 Downgrade to `debug`

#### RabbitMQEventBus

- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:97` — `logger.info` — Exchange asserted 🟡 Downgrade to `debug`
- [x] `src/infrastructure/services/RabbitMQEventBus.ts:109` — ~~`logger.info`~~ → `logger.error` ✅
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:110` — `logger.info` — Retrying 🟡 **Should be `logger.warn`**
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:146` — `logger.info` — Bound queue 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:186` — `logger.info` — Event published 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:214` — `logger.info` — Consumer already running 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:221` — `logger.info` — Subscribing consumer 🟡 Downgrade to `debug`
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:247` — `logger.info` — Event received 🟡 Downgrade to `debug`

#### Controllers — Auth (PII Leaks)

- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:54` — `logger.info` — Signing up user 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:62` — `logger.info` — Signed up user (logs full user object!) 🔴 **Remove — leaks user data**
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:79` — `logger.info` — Verify signup email 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:86` — `logger.info` — Verification success 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:106` — `logger.info` — Logging in user (logs email!) 🔴 **Strip PII**
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:110` — `logger.info` — Login success (logs userId) 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:127` — `logger.info` — Google login attempt 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:131` — `logger.info` — Google auth success 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:152` — `logger.info` — Token refresh request 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:156` — `logger.info` — Tokens refreshed 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:178` — `logger.info` — Password change request 🟡 Downgrade to `debug`
- [x] `src/presentation/v1/controllers/AuthControllerV1.ts:199` — ~~`logger.info` with email~~ → PII stripped ✅

#### Controllers — Profile

- [ ] `src/presentation/v1/controllers/ProfileControllerV1.ts:47` — `logger.info` — Getting user data 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/ProfileControllerV1.ts:141` — `logger.info` — Switching role 🟡 Downgrade to `debug`

#### Controllers — Application

- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:66` — `logger.info` — File upload URL 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:88` — `logger.info` — Submitting application 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:110` — `logger.info` — Application action 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:135` — `logger.info` — Application action 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:160` — `logger.info` — Application action 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:192` — `logger.info` — Resubmitting onboarding 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:221` — `logger.info` — Resubmitting vehicle 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:250` — `logger.info` — Resubmitting renewal 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:279` — `logger.info` — Application action 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:305` — `logger.info` — Getting applications 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:326` — `logger.info` — Application action 🟡 Downgrade to `debug`

#### Controllers — Admin

- [ ] `src/presentation/v1/controllers/admin/AdminVehicleRecordControllerV1.ts:32` — `logger.info` — Admin fetching records 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminVehicleRecordControllerV1.ts:52` — `logger.info` — Admin record details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminUserController.ts:48` — `logger.info` — Admin fetching users 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminUserController.ts:79` — `logger.info` — Admin user profile 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminUserController.ts:164` — `logger.info` — Admin users count 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminApplicationControllerV1.ts:38` — `logger.info` — Admin applications 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminApplicationControllerV1.ts:62` — `logger.info` — Admin application details 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminApplicationControllerV1.ts:88` — `logger.info` — Admin processing app 🟡 Downgrade to `debug`
- [ ] `src/presentation/v1/controllers/admin/AdminApplicationControllerV1.ts:109` — `logger.info` — Admin application count 🟡 Downgrade to `debug`

#### Event Handlers

- [ ] `src/presentation/v1/messages/event-handler/NewVehicleConfigHandler.ts:16` — `logger.info` — Handling event 🟡 Downgrade to `debug`
- [x] `src/presentation/v1/messages/event-handler/UpdateVehicleConfigHandler.ts:18` — ~~`logger.info`~~ → `logger.debug` ✅

#### EventDispatcher

- [x] `src/presentation/v1/messages/EventDispatcher.ts:31` — ~~`logger.info`~~ → `logger.debug` ✅
- [x] `src/presentation/v1/messages/EventDispatcher.ts:48` — ~~`logger.info`~~ → `logger.debug` ✅

#### Debug Leftovers

- [x] `src/application/use-case/auth/VerifySignupEmailUseCase.ts:55` — ~~`console.debug`~~ Removed ✅
- [x] `src/application/use-case/auth/VerifySignupEmailUseCase.ts:56` — ~~`console.debug`~~ Removed ✅
- [x] `src/application/use-case/auth/VerifySignupEmailUseCase.ts:60` — ~~`console.debug`~~ Removed ✅
- [x] `src/application/use-case/profile/GetUserUseCase.ts:44` — ~~`console.log`~~ Removed ✅
- [x] `src/infrastructure/services/GoogleAuthService.ts:43` — ~~`console.log`~~ Removed ✅

---

### mcp-service

No remaining issues. All log statements are error-level on failure paths.

---

### api-gateway

#### Console → Logger

- [x] `src/config/redis.config.ts:10` — ~~`console.error`~~ → `logger.error` ✅
- [x] `src/middleware/blacklist.middleware.ts:51` — ~~`console.error`~~ → `logger.error` ✅
- [x] `src/middleware/auth.middleware.ts:60` — ~~`console.log`~~ → `logger.error` ✅
- [x] `src/services/blacklist.service.ts:20` — ~~`console.error`~~ → `logger.error` ✅

---

## Frontend — `smr-frontend/`

### Middleware / Proxy

- [x] `proxy.ts:38` — ~~`console.log`~~ → `console.error` ✅
- [x] `proxy.ts:78` — ~~`console.log`~~ Removed ✅
- [x] `proxy.ts:193` — `console.error` — kept (edge runtime) ✅

### API Utilities

- [x] `lib/api-client.ts:52` — ~~`logger.info`~~ → `logger.error` ✅
- [x] `lib/api-server.ts:76` — ~~`console.warn`~~ → `logger.warn` ✅
- [x] `lib/api-server.ts:85` — ~~`logger.info`~~ → `logger.debug` ✅
- [x] `lib/api-server.ts:94` — ~~`console.warn`~~ → `logger.warn` ✅
- [x] `lib/api-server.ts:119` — ~~`console.warn`~~ → `logger.warn` ✅

### API Routes

- [x] `app/api/assistant/route.ts:160` — ~~`console.error`~~ → `logger.error` ✅

### Feature — Auth (Actions)

- [ ] `features/auth/api/actions/GoogleLoginAction.ts:12` — `logger.info` — "Logging in user via Google" 🟡 Downgrade to `debug`
- [ ] `features/auth/api/actions/LoginUserAction.ts:12` — `logger.info` — "Logging in user" 🟡 Downgrade to `debug`
- [ ] `features/auth/api/actions/SignupUserAction.ts:16` — `logger.info` — "Signing up user" 🟡 Downgrade to `debug`
- [ ] `features/auth/api/actions/LogoutUserAction.ts:7` — `logger.info` — "Logging out user" 🟡 Downgrade to `debug`
- [ ] `features/auth/api/actions/VerifySignupEMailAction.ts:12` — `logger.info` — "Signup email verification action called" 🟡 Downgrade to `debug`

### Feature — Auth (Components)

- [ ] `features/auth/components/ChangePasswordCard.tsx:56` — `logger.info` — "Handle login result" 🟡 Downgrade to `debug`
- [ ] `features/auth/components/GoogleLogin.tsx:40` — `logger.info` — "Handle Google login result" 🟡 Downgrade to `debug`
- [ ] `features/auth/components/LoginForm.tsx:101` — `console.log` — "Sending password reset mail request" 🔴 **Remove — logs email**
- [ ] `features/auth/components/SignupForm.tsx:33` — `logger.info` — "Handllel signup result" 🟡 Downgrade to `debug` + fix typo

### Feature — Application (Actions)

- [ ] `features/application/api/actions/submitOnboardingApplicationAction.ts:11` — `logger.info` 🟡 Downgrade to `debug`
- [ ] `features/application/api/actions/submitDriverRenewalAction.ts:11` — `logger.info` 🟡 Downgrade to `debug`
- [ ] `features/application/api/actions/submitNewVehicleApplicationAction.ts:11` — `logger.info` 🟡 Downgrade to `debug`
- [ ] `features/application/api/actions/submitVehicleRenewalAction.ts:11` — `logger.info` 🟡 Downgrade to `debug`

### Feature — Application (Forms)

- [ ] `features/application/forms/OnboardingApplicationForm.tsx:56` — `logger.info` 🟡 Downgrade to `debug`
- [ ] `features/application/forms/DriverRenewalForm.tsx:51` — `logger.info` 🟡 Downgrade to `debug`
- [ ] `features/application/forms/NewVehicleApplicationForm.tsx:54` — `logger.info` 🟡 Downgrade to `debug`
- [ ] `features/application/forms/VehicleRenewalForm.tsx:51` — `logger.info` 🟡 Downgrade to `debug`

### Feature — Admin

- [ ] `features/admin/applications/api/actions/processApplicationAction.ts:17` — `logger.info` 🟡 Downgrade to `debug`

### Feature — Profile (Actions)

- [ ] `features/profile/api/actions/ChangeRoleAction.ts:10` — `logger.info` 🟡 Downgrade to `debug`
- [ ] `features/profile/api/actions/UpdateUserAction.ts:11` — `logger.info` 🟡 Downgrade to `debug`
- [ ] `features/profile/api/actions/resubmitDriverRenewalAction.ts:12` — `logger.info` 🟡 Downgrade to `debug`
- [ ] `features/profile/api/actions/resubmitNewVehicleApplicationAction.ts:12` — `logger.info` 🟡 Downgrade to `debug`
- [ ] `features/profile/api/actions/resubmitOnboardingApplicationAction.ts:12` — `logger.info` 🟡 Downgrade to `debug`
- [ ] `features/profile/api/actions/resubmitVehicleRenewalAction.ts:12` — `logger.info` 🟡 Downgrade to `debug`

### Feature — Profile (Forms)

- [x] `features/profile/forms/ProfileUpdateForm.tsx:151` — ~~`console.log`~~ Removed ✅

### Feature — Realtime (Socket Hooks)

- [ ] `features/realtime/hooks/useCallSocket.ts:23` — `logger.info` — "Call socket connected" 🟡 Downgrade to `debug`
- [ ] `features/realtime/hooks/useCallSocket.ts:24` — `logger.info` — "Call socket disconnected" 🟡 Downgrade to `debug`
- [ ] `features/realtime/hooks/useChatSocket.ts:24` — `logger.info` — "Chat socket connected" 🟡 Downgrade to `debug`
- [ ] `features/realtime/hooks/useChatSocket.ts:25` — `logger.info` — "Chat socket disconnected" 🟡 Downgrade to `debug`
- [ ] `features/realtime/hooks/useLiveLocationSocket.ts:23` — `logger.info` — "Journey socket connected" 🟡 Downgrade to `debug`
- [ ] `features/realtime/hooks/useLiveLocationSocket.ts:24` — `logger.info` — "Journey socket disconnected" 🟡 Downgrade to `debug`

### Feature — Map

- [ ] `features/map/services/mapbox/NavigationManager.ts:120` — `console.log` — "Current Route" 🔴 **Remove — high frequency**
- [ ] `features/map/services/mapbox/NavigationManager.ts:142` — `console.log` — "The new route is" 🔴 **Remove — high frequency**
- [x] `features/map/services/mapbox/MapboxCore.ts:132` — ~~`console.warn`~~ → `console.debug` ✅
- [x] `features/map/services/mapbox/MapboxCore.ts:179` — ~~`console.warn`~~ → `console.debug` ✅
- [x] `features/map/components/MapContainer.tsx:28` — ~~`console.warn`~~ → `console.debug` ✅

### Feature — Driver

- [x] `features/driver/trips/forms/CreateTripForm.tsx:64` — ~~`console.log`~~ Removed ✅
- [x] `features/driver/trips/forms/CreateTripForm.tsx:65` — ~~`console.log`~~ Removed ✅
- [x] `features/driver/trips/views/DriverTripDetailsView.tsx:123` — ~~`console.warn`~~ → `console.debug` ✅
- [x] `features/driver/journey/components/CurrentTargetCard.tsx:177` — ~~`console.log`~~ Removed ✅

### Feature — AI Chat

- [x] `features/ai-chat/components/ChatPanel.tsx:21` — ~~`console.log`~~ Removed ✅

---

## Summary

| Category | Count |
|----------|-------|
| 🔴 Remove / fix (debug leftovers, PII leaks, console→logger) | **~22** |
| 🟡 Downgrade `info` → `debug` | **~175** |
| ✅ Already resolved (morgan + logger level) | **~388** |

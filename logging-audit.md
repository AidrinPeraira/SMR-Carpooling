# Logging Audit — ShareMyRide

> Generated 2026-11-14. Every line that writes a log to the console across the monorepo.
> Use this checklist to reduce production log volume and standardise log structure.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]`  | Needs review / action |
| Level  | `info` `warn` `error` `debug` `http` `console.*` |
| Tag    | 🔴 Debug leftover — remove in prod · 🟡 Verbose — consider downgrading · 🟢 Keep |

---

## Backend — `smr-backend/`

### Morgan HTTP Request Logging (all services)

All five HTTP services use `morgan("dev")` piped through the logger. In production this logs **every request** at `http` level.

- [ ] `realtime-service/src/app.ts:22` — `morgan("dev")` 🟡
- [ ] `trip-service/src/app.ts:28` — `morgan("dev")` 🟡
- [ ] `mcp-service/src/app.ts:19` — `morgan("dev")` 🟡
- [ ] `user-service/src/app.ts:33` — `morgan("dev")` 🟡
- [ ] `api-gateway/src/app.ts:34` — `morgan("dev")` 🟡

---

### realtime-service

#### Startup / Infrastructure

- [ ] `src/index.ts:28` — `console.log` — Server startup port 🟢
- [ ] `src/index.ts:33` — `console.error` — Server start failure 🟢
- [ ] `src/infrastructure/database/connect-mongodb.ts:8` — `logger.info` — DB connected 🟢
- [ ] `src/infrastructure/database/connect-mongodb.ts:13` — `logger.error` — DB connection error 🟢
- [ ] `src/infrastructure/store/connect-redis.ts:17` — `logger.info` — Redis client error 🟢
- [ ] `src/infrastructure/store/connect-redis.ts:21` — `logger.info` — Connecting to Redis 🟡
- [ ] `src/infrastructure/store/connect-redis.ts:23` — `logger.info` — Connected to Redis 🟢
- [ ] `src/infrastructure/store/connect-redis.ts:25` — `logger.error` — Redis connection error 🟢

#### LoggerService (wrapper — all calls pass through here)

- [ ] `src/infrastructure/services/LoggerService.ts:19` — `logger.info` — pass-through 🟢
- [ ] `src/infrastructure/services/LoggerService.ts:23` — `logger.warn` — pass-through 🟢
- [ ] `src/infrastructure/services/LoggerService.ts:27` — `logger.error` — pass-through 🟢
- [ ] `src/infrastructure/services/LoggerService.ts:31` — `logger.debug` — pass-through 🟢

#### EventBus (RabbitMQ)

- [ ] `src/infrastructure/services/EventBus.ts:56` — `logger.info` — "Connecting to RabbitMQ" 🟢
- [ ] `src/infrastructure/services/EventBus.ts:59` — `logger.info` — "Rabbit MQ connected." 🟢
- [ ] `src/infrastructure/services/EventBus.ts:63` — `logger.error` — Connection error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:68` — `logger.info` — Connection closed, retrying 🟢
- [ ] `src/infrastructure/services/EventBus.ts:92` — `logger.info` — Exchange asserted 🟡
- [ ] `src/infrastructure/services/EventBus.ts:106` — `logger.info` — "RabbitMQ initialised successfully" 🟢
- [ ] `src/infrastructure/services/EventBus.ts:110` — `logger.info` — Connection failed (should be error) 🟡
- [ ] `src/infrastructure/services/EventBus.ts:111` — `logger.info` — Retrying connection 🟡
- [ ] `src/infrastructure/services/EventBus.ts:125` — `logger.error` — Error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:147` — `logger.info` — "Bound consumer queue for routing key" 🟡
- [ ] `src/infrastructure/services/EventBus.ts:150` — `logger.error` — Subscribe error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:168` — `logger.warn` — Warning 🟢
- [ ] `src/infrastructure/services/EventBus.ts:187` — `logger.info` — "Event published" 🟡
- [ ] `src/infrastructure/services/EventBus.ts:191` — `logger.warn` — Failed to publish 🟢
- [ ] `src/infrastructure/services/EventBus.ts:196` — `logger.error` — Publish error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:208` — `logger.error` — Error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:215` — `logger.info` — Consumer already running 🟡
- [ ] `src/infrastructure/services/EventBus.ts:222` — `logger.info` — "Subscribing consumer to queue" 🟡
- [ ] `src/infrastructure/services/EventBus.ts:229` — `logger.warn` — Consumer cancelled 🟢
- [ ] `src/infrastructure/services/EventBus.ts:237` — `logger.warn` — Consumer cancelled, forcing reconnect 🟢
- [ ] `src/infrastructure/services/EventBus.ts:248` — `logger.info` — "Event received" 🟡
- [ ] `src/infrastructure/services/EventBus.ts:254` — `logger.error` — Processing error, moving to DLQ 🟢
- [ ] `src/infrastructure/services/EventBus.ts:261` — `logger.error` — Consuming error 🟢

#### Socket Server

- [ ] `src/presentation/v1/sockets/SocketServer.ts:44` — `logger.info` — "Socket connection established" 🟡
- [ ] `src/presentation/v1/sockets/SocketServer.ts:49` — `logger.error` — Socket connection failed 🟢

#### SocketIOEmitter

- [ ] `src/infrastructure/sockets/SocketIOEmitter.ts:15` — `logger.warn` — joinRoom socket not found 🟢
- [ ] `src/infrastructure/sockets/SocketIOEmitter.ts:28` — `logger.warn` — leaveRoom socket not found 🟢
- [ ] `src/infrastructure/sockets/SocketIOEmitter.ts:36` — `logger.info` — leaveRoom socket removed 🟡

#### Controllers

- [ ] `src/presentation/v1/http/controllers/JourneyControllerV1.ts:30` — `logger.info` — "Getting share token" 🟡
- [ ] `src/presentation/v1/http/controllers/ChatControllerV1.ts:30` — `logger.info` — "Getting chat messages" 🟡
- [ ] `src/presentation/v1/http/controllers/ChatControllerV1.ts:32` — `console.log` — `"-----", req.body` 🔴 **Debug leftover**

#### Socket Handlers — Chat

- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:31` — `logger.info` — Registering handlers 🟡
- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:50` — `logger.info` — onJoinChat 🟡
- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:64` — `logger.error` — onJoinChat error 🟢
- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:71` — `logger.info` — onLeaveChat 🟡
- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:82` — `logger.error` — onLeaveChat error 🟢
- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:89` — `logger.info` — onSendMessage 🟡
- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:104` — `logger.error` — onSendMessage error 🟢
- [ ] `src/presentation/v1/sockets/handlers/ChatSocketHandler.ts:111` — `logger.info` — Socket disconnected 🟡

#### Socket Handlers — Call

- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:43` — `logger.info` — Registering handlers 🟡
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:74` — `logger.info` — onInitiateCall 🟡
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:88` — `logger.error` — onInitiateCall error 🟢
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:95` — `logger.info` — onAcceptCall 🟡
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:106` — `logger.error` — onAcceptCall error 🟢
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:113` — `logger.info` — onRejectCall 🟡
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:124` — `logger.error` — onRejectCall error 🟢
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:131` — `logger.info` — onCallTimeout 🟡
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:145` — `logger.error` — onCallTimeout error 🟢
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:152` — `logger.info` — onEndCall 🟡
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:163` — `logger.error` — onEndCall error 🟢
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:170` — `logger.info` — onRelaySignal 🟡
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:184` — `logger.error` — onRelaySignal error 🟢
- [ ] `src/presentation/v1/sockets/handlers/CallSocketHandler.ts:191` — `logger.info` — Call socket disconnected 🟡

#### Socket Handlers — Journey

- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:39` — `logger.info` — Registering handlers 🟡
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:66` — `logger.info` — onDriverJoin 🟡
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:80` — `logger.error` — onDriverJoin error 🟢
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:87` — `logger.info` — onPassengerJoin 🟡
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:101` — `logger.error` — onPassengerJoin error 🟢
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:110` — `logger.info` — onShareTokenJoin 🟡
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:122` — `logger.error` — onShareTokenJoin error 🟢
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:131` — `logger.info` — onLocationUpdate 🟡
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:142` — `logger.error` — onLocationUpdate error 🟢
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:151` — `logger.info` — onLeave 🟡
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:162` — `logger.error` — onLeave error 🟢
- [ ] `src/presentation/v1/sockets/handlers/JourneySocketHandler.ts:169` — `logger.info` — Journey socket disconnected 🟡

#### Event Handlers

- [ ] `src/presentation/v1/messaging/event-handlers/PassengerDroppedOffEventHandler.ts:17` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerDroppedOffEventHandler.ts:27` — `logger.info` — Success 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerDroppedOffEventHandler.ts:29` — `logger.error` — Failure 🟢
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerNoShowEventHandler.ts:17` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerNoShowEventHandler.ts:27` — `logger.info` — Success 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerNoShowEventHandler.ts:29` — `logger.error` — Failure 🟢
- [ ] `src/presentation/v1/messaging/event-handlers/UserSignupEventHandler.ts:21` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/UserSignupEventHandler.ts:31` — `logger.info` — Success 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/UserSignupEventHandler.ts:33` — `logger.error` — Failure 🟢
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerCancelBookingEventHandler.ts:22` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerCancelBookingEventHandler.ts:42` — `logger.info` — Success 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/PassengerCancelBookingEventHandler.ts:46` — `logger.error` — Failure 🟢
- [ ] `src/presentation/v1/messaging/event-handlers/DriverCancelTripEventHandler.ts:22` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/DriverCancelTripEventHandler.ts:51` — `logger.info` — Success 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/DriverCancelTripEventHandler.ts:55` — `logger.error` — Failure 🟢
- [ ] `src/presentation/v1/messaging/event-handlers/JourneyCompletedEventHandler.ts:17` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/JourneyCompletedEventHandler.ts:25` — `logger.info` — Success 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/JourneyCompletedEventHandler.ts:27` — `logger.error` — Failure 🟢
- [ ] `src/presentation/v1/messaging/event-handlers/NewTripEventHandler.ts:24` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/NewTripEventHandler.ts:41` — `logger.info` — Success 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/NewTripEventHandler.ts:45` — `logger.error` — Failure 🟢
- [ ] `src/presentation/v1/messaging/event-handlers/NewBookingEventHandler.ts:22` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/NewBookingEventHandler.ts:38` — `logger.info` — Success 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/NewBookingEventHandler.ts:42` — `logger.error` — Failure 🟢
- [ ] `src/presentation/v1/messaging/event-handlers/JourneyStartedEventHandler.ts:17` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/JourneyStartedEventHandler.ts:27` — `logger.info` — Success 🟡
- [ ] `src/presentation/v1/messaging/event-handlers/JourneyStartedEventHandler.ts:29` — `logger.error` — Failure 🟢

#### EventDispatcher

- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:19` — `logger.warn` — Rewriting handler 🟢
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:23` — `logger.info` — Handler registered 🟡
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:33` — `logger.warn` — No handler for event 🟢
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:38` — `logger.info` — Calling handler 🟡
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:41` — `logger.error` — Dispatch failed 🟢

---

### trip-service

#### Startup / Infrastructure

- [ ] `src/index.ts:21` — `logger.info` — Server startup port 🟢
- [ ] `src/index.ts:29` — `logger.error` — Server start failure 🟢
- [ ] `src/app.ts:49` — `logger.error` — Error handler middleware 🟢
- [ ] `src/infrastructure/store/connect-redis.ts:11` — `logger.info` — Redis client error (should be error level) 🟡
- [ ] `src/infrastructure/store/connect-redis.ts:15` — `logger.info` — Connecting to Redis 🟡
- [ ] `src/infrastructure/store/connect-redis.ts:17` — `logger.info` — Connected to Redis 🟢
- [ ] `src/infrastructure/store/connect-redis.ts:19` — `logger.error` — Redis connection error 🟢

#### LoggerService

- [ ] `src/infrastructure/services/LoggerService.ts:19-31` — pass-through wrapper (info/warn/error/debug) 🟢

#### EventBus (RabbitMQ) — same pattern as realtime-service

- [ ] `src/infrastructure/services/EventBus.ts:57` — `logger.info` — "Connecting to RabbitMQ" 🟢
- [ ] `src/infrastructure/services/EventBus.ts:60` — `logger.info` — "Rabbit MQ connected." 🟢
- [ ] `src/infrastructure/services/EventBus.ts:64` — `logger.error` — Connection error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:69` — `logger.info` — Connection closed, retrying 🟢
- [ ] `src/infrastructure/services/EventBus.ts:93` — `logger.info` — Exchange asserted 🟡
- [ ] `src/infrastructure/services/EventBus.ts:104` — `logger.info` — Initialised successfully 🟢
- [ ] `src/infrastructure/services/EventBus.ts:108` — `logger.info` — Connection failed (should be error) 🟡
- [ ] `src/infrastructure/services/EventBus.ts:109` — `logger.info` — Retrying 🟡
- [ ] `src/infrastructure/services/EventBus.ts:123` — `logger.error` — Error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:145` — `logger.info` — Bound queue 🟡
- [ ] `src/infrastructure/services/EventBus.ts:148` — `logger.error` — Subscribe error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:166` — `logger.warn` — Warning 🟢
- [ ] `src/infrastructure/services/EventBus.ts:185` — `logger.info` — Event published 🟡
- [ ] `src/infrastructure/services/EventBus.ts:189` — `logger.warn` — Failed to publish 🟢
- [ ] `src/infrastructure/services/EventBus.ts:194` — `logger.error` — Publish error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:206` — `logger.error` — Error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:213` — `logger.info` — Consumer already running 🟡
- [ ] `src/infrastructure/services/EventBus.ts:220` — `logger.info` — Subscribing consumer 🟡
- [ ] `src/infrastructure/services/EventBus.ts:227` — `logger.warn` — Consumer cancelled 🟢
- [ ] `src/infrastructure/services/EventBus.ts:235` — `logger.warn` — Consumer cancelled, reconnect 🟢
- [ ] `src/infrastructure/services/EventBus.ts:246` — `logger.info` — Event received 🟡
- [ ] `src/infrastructure/services/EventBus.ts:252` — `logger.error` — Processing error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:259` — `logger.error` — Consuming error 🟢

#### Controllers — Trip

- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:54` — `logger.info` — Creating trip 🟡
- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:83` — `logger.info` — Searching trips 🟡
- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:118` — `logger.info` — Getting journey details 🟡
- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:155` — `logger.info` — Fetching driver trips 🟡
- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:185` — `logger.info` — Fetching trip details 🟡
- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:216` — `logger.info` — Fetching today trip 🟡
- [ ] `src/presentation/v1/controllers/trip/TripControllerV1.ts:246` — `logger.info` — Canceling trip 🟡

#### Controllers — Booking

- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:62` — `logger.info` — Creating booking 🟡
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:94` — `logger.info` — Fetching driver bookings 🟡
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:123` — `logger.info` — Fetching booking details 🟡
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:154` — `logger.info` — Accepting booking 🟡
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:181` — `logger.info` — Rejecting booking 🟡
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:212` — `logger.info` — Fetching passenger bookings 🟡
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:245` — `logger.info` — Fetching passenger booking details 🟡
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:279` — `logger.info` — Withdrawing booking 🟡
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:309` — `logger.info` — Initiating payment 🟡
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:341` — `logger.info` — Canceling booking 🟡
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:368` — `logger.info` — Booking stats 🟡
- [ ] `src/presentation/v1/controllers/booking/BookingControllerV1.ts:396` — `logger.info` — Today trip 🟡

#### Controllers — Journey

- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:60` — `logger.info` — Starting journey 🟡
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:84` — `logger.info` — Driver journey details 🟡
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:114` — `logger.info` — Passenger journey details 🟡
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:148` — `logger.info` — Driver arrived at stop 🟡
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:175` — `logger.info` — Driver verifying OTP 🟡
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:202` — `logger.info` — Passenger confirming pickup 🟡
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:229` — `logger.info` — Driver dropping off 🟡
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:256` — `logger.info` — Passenger confirming dropoff 🟡
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:283` — `logger.info` — Marking no-show 🟡
- [ ] `src/presentation/v1/controllers/journey/JourneyControllerV1.ts:306` — `logger.info` — Completing journey 🟡

#### Controllers — Driver

- [ ] `src/presentation/v1/controllers/driver/DriverControllerV1.ts:29` — `logger.info` — Fetching driver details 🟡
- [ ] `src/presentation/v1/controllers/driver/DriverControllerV1.ts:53` — `logger.info` — Fetching driver stats 🟡

#### Controllers — Vehicle

- [ ] `src/presentation/v1/controllers/vehicle/VehicleControllerV1.ts:27` — `logger.info` — Fetching vehicles 🟡

#### Controllers — Admin

- [ ] `src/presentation/v1/controllers/admin/AdminTripControllerV1.ts:57` — `logger.info` — Admin fetching trips 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminTripControllerV1.ts:97` — `logger.info` — Admin trip details 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminTripControllerV1.ts:124` — `logger.info` — Admin journey details 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminTripControllerV1.ts:152` — `logger.info` — Admin trips count 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminTripControllerV1.ts:179` — `logger.info` — Admin trip trend 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminDriverControllerV1.ts:27` — `logger.info` — Admin driver details 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminBookingControllerV1.ts:49` — `logger.info` — Admin bookings list 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminBookingControllerV1.ts:89` — `logger.info` — Admin booking details 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminVehicleControllerV1.ts:27` — `logger.info` — Admin vehicle list 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminConfigurationControllerV1.ts:44` — `logger.info` — Admin fetching configs 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminConfigurationControllerV1.ts:96` — `logger.info` — Creating pricing rule 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminConfigurationControllerV1.ts:138` — `logger.info` — Updating pricing rule 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminConfigurationControllerV1.ts:169` — `logger.info` — Creating vehicle config 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminConfigurationControllerV1.ts:212` — `logger.info` — Updating vehicle config 🟡

#### Controllers — Webhook

- [ ] `src/presentation/v1/controllers/webhook/WebhookControllerV1.ts:39` — `logger.info` — Cleanup booking payment 🟡
- [ ] `src/presentation/v1/controllers/webhook/WebhookControllerV1.ts:69` — `logger.info` — Cleanup trips indexing 🟡

#### Event Handlers

- [ ] `src/presentation/v1/event-handlers/ApplicationApprovedEventHandler.ts:33` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/event-handlers/BookingPaymentFailedEventHandler.ts:14` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/event-handlers/BookingPaymentSuccessEventHandler.ts:17` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/event-handlers/UserBlockedEventHandler.ts:18` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/event-handlers/UserBlockedEventHandler.ts:24` — `logger.info` — Success 🟡
- [ ] `src/presentation/v1/event-handlers/NewUserEventHandler.ts:14` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/event-handlers/UserUnblockedEventHandler.ts:18` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/event-handlers/UserUnblockedEventHandler.ts:24` — `logger.info` — Success 🟡

#### EventDispatcher

- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:19` — `logger.warn` — Rewriting handler 🟢
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:23` — `logger.info` — Handler registered 🟡
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:33` — `logger.warn` — No handler for event 🟢
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:38` — `logger.info` — Calling handler 🟡
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:41` — `logger.error` — Dispatch failed 🟢

#### Use Cases / Repositories (Debug Leftovers)

- [ ] `src/application/use-case/trip/ListTripsUseCase.ts:25` — `console.log` — "Searching for trips" 🔴 **Debug leftover**
- [ ] `src/infrastructure/store/PlacesCacheStore.ts:27` — `console.log` — "Redis place cache matching error" 🔴 **Debug leftover — should use logger.error**
- [ ] `src/infrastructure/repository/TripsRepository.ts:484` — `console.log` — "Origin Places" 🔴 **Debug leftover**

#### Seed Script

- [ ] `src/infrastructure/database/prisma/seed.ts:34` — `console.log` — Reading POI data 🟢 (seed only)
- [ ] `src/infrastructure/database/prisma/seed.ts:41` — `console.log` — Found features 🟢 (seed only)
- [ ] `src/infrastructure/database/prisma/seed.ts:81` — `console.log` — Batch status 🟢 (seed only)
- [ ] `src/infrastructure/database/prisma/seed.ts:90` — `console.log` — Done 🟢 (seed only)
- [ ] `src/infrastructure/database/prisma/seed.ts:97` — `console.error` — Seed error 🟢 (seed only)

---

### notification-service

#### Startup / Infrastructure

- [ ] `src/index.ts:16` — `logger.info` — Server startup port 🟢
- [ ] `src/index.ts:24` — `logger.error` — Server start failure 🟢
- [ ] `src/app.ts:36` — `logger.error` — Error handler 🟢
- [ ] `src/app.ts:57` — `logger.error` — Error handler 🟢

#### LoggerService

- [ ] `src/infrastructure/services/LoggerService.ts:19-31` — pass-through wrapper 🟢

#### RabbitMQConsumer

- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:51` — `logger.info` — Connecting 🟢
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:54` — `logger.info` — Connected 🟢
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:58` — `logger.error` — Connection error 🟢
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:63` — `logger.info` — Connection closed, retrying 🟢
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:69` — `logger.info` — Asserting exchanges 🟡
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:116` — `logger.info` — Bound queue 🟡
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:122` — `logger.info` — Initialised 🟢
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:126` — `logger.error` — Init error 🟢
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:128` — `logger.info` — Retrying (should be warn) 🟡
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:136` — `logger.error` — Error 🟢
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:143` — `logger.info` — Consumer already running 🟡
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:150` — `logger.info` — Subscribing consumer 🟡
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:157` — `logger.warn` — Consumer cancelled 🟢
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:165` — `logger.warn` — Consumer cancelled, reconnect 🟢
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:176` — `logger.info` — Event received 🟡
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:182` — `logger.error` — Processing error 🟢
- [ ] `src/infrastructure/services/RabbitMQConsumer.ts:189` — `logger.error` — Consuming error 🟢

#### Event Handlers

- [ ] `src/presentation/event-handlers/TripCancelationEventHandler.ts:26` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/event-handlers/BookingPaymentSuccessHandler.ts:23` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/event-handlers/NewBookingHandler.ts:29` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/event-handlers/PasswordChangedHandler.ts:21` — `logger.info` — Sending notification 🟡
- [ ] `src/presentation/event-handlers/BookingPaymentFailedHandler.ts:23` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/event-handlers/PasswordChangeRequestHandler.ts:22` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/event-handlers/BookingCancellationHandler.ts:26` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/event-handlers/ApplicationApprovedHandler.ts:22` — `logger.info` — Sending notification 🟡
- [ ] `src/presentation/event-handlers/ApplicationRejectedHandler.ts:22` — `logger.info` — Sending notification 🟡
- [ ] `src/presentation/event-handlers/ApplicationReturnedHandler.ts:22` — `logger.info` — Sending notification 🟡
- [ ] `src/presentation/event-handlers/UserSignupHandler.ts:20` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/event-handlers/UserSignupHandler.ts:36` — `logger.info` — Sending verification 🟡

#### EventDispatcher

- [ ] `src/presentation/messaging/EventDispatcher.ts:19` — `logger.warn` — Rewriting handler 🟢
- [ ] `src/presentation/messaging/EventDispatcher.ts:23` — `logger.info` — Registered 🟡
- [ ] `src/presentation/messaging/EventDispatcher.ts:33` — `logger.warn` — No handler 🟢
- [ ] `src/presentation/messaging/EventDispatcher.ts:38` — `logger.info` — Calling handler 🟡
- [ ] `src/presentation/messaging/EventDispatcher.ts:41` — `logger.error` — Dispatch failed 🟢

#### Email Service

- [ ] `src/infrastructure/services/ResendEMailService.ts:14` — `logger.info` — Sending email 🟡
- [ ] `src/infrastructure/services/ResendEMailService.ts:24` — `logger.info` — Error sending email (should be error) 🟡
- [ ] `src/infrastructure/services/ResendEMailService.ts:26` — `logger.info` — Email sent successfully 🟡

#### Use Case (Debug Leftover)

- [ ] `src/application/use-case/SendSignupVerificationMailUseCase.ts:32` — `console.log` — Verification URL 🔴 **Debug leftover — leaks URL to console**

---

### payment-service

#### Startup / Infrastructure

- [ ] `src/index.ts:16` — `logger.error` — EventBus connection failure 🟢
- [ ] `src/index.ts:22` — `logger.info` — Server startup port 🟢
- [ ] `src/index.ts:30` — `logger.error` — Server start failure 🟢
- [ ] `src/app.ts:42` — `logger.error` — Error handler middleware 🟢
- [ ] `src/infrastructure/database/connect-mongodb.ts:8` — `logger.info` — DB connected 🟢
- [ ] `src/infrastructure/database/connect-mongodb.ts:13` — `logger.error` — DB connection error 🟢

#### LoggerService

- [ ] `src/infrastructure/services/LoggerService.ts:19-31` — pass-through wrapper 🟢

#### EventBus (RabbitMQ) — same pattern

- [ ] `src/infrastructure/services/EventBus.ts:57` — `logger.info` — Connecting 🟢
- [ ] `src/infrastructure/services/EventBus.ts:60` — `logger.info` — Connected 🟢
- [ ] `src/infrastructure/services/EventBus.ts:64` — `logger.error` — Connection error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:69` — `logger.info` — Connection closed, retrying 🟢
- [ ] `src/infrastructure/services/EventBus.ts:93` — `logger.info` — Exchange asserted 🟡
- [ ] `src/infrastructure/services/EventBus.ts:104` — `logger.info` — Initialised 🟢
- [ ] `src/infrastructure/services/EventBus.ts:108` — `logger.info` — Connection failed (should be error) 🟡
- [ ] `src/infrastructure/services/EventBus.ts:109` — `logger.info` — Retrying 🟡
- [ ] `src/infrastructure/services/EventBus.ts:123` — `logger.error` — Error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:145` — `logger.info` — Bound queue 🟡
- [ ] `src/infrastructure/services/EventBus.ts:148` — `logger.error` — Subscribe error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:166` — `logger.warn` — Warning 🟢
- [ ] `src/infrastructure/services/EventBus.ts:185` — `logger.info` — Event published 🟡
- [ ] `src/infrastructure/services/EventBus.ts:189` — `logger.warn` — Failed to publish 🟢
- [ ] `src/infrastructure/services/EventBus.ts:194` — `logger.error` — Publish error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:206` — `logger.error` — Error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:213` — `logger.info` — Consumer already running 🟡
- [ ] `src/infrastructure/services/EventBus.ts:220` — `logger.info` — Subscribing consumer 🟡
- [ ] `src/infrastructure/services/EventBus.ts:227` — `logger.warn` — Consumer cancelled 🟢
- [ ] `src/infrastructure/services/EventBus.ts:235` — `logger.warn` — Consumer cancelled, reconnect 🟢
- [ ] `src/infrastructure/services/EventBus.ts:246` — `logger.info` — Event received 🟡
- [ ] `src/infrastructure/services/EventBus.ts:252` — `logger.error` — Processing error 🟢
- [ ] `src/infrastructure/services/EventBus.ts:259` — `logger.error` — Consuming error 🟢

#### Controllers

- [ ] `src/presentation/v1/controllers/WebhookControllerV1.ts:22` — `logger.info` — Handling webhook 🟡
- [ ] `src/presentation/v1/controllers/AdminControllerV1.ts:56` — `logger.info` — Admin fetching transactions 🟡
- [ ] `src/presentation/v1/controllers/AdminControllerV1.ts:79` — `logger.info` — Transactions fetched 🟡
- [ ] `src/presentation/v1/controllers/AdminControllerV1.ts:95` — `logger.info` — Fetching summary 🟡
- [ ] `src/presentation/v1/controllers/AdminControllerV1.ts:113` — `logger.info` — Revenue trend 🟡
- [ ] `src/presentation/v1/controllers/WalletControllerV1.ts:45` — `logger.info` — Fetching wallet transactions 🟡
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:45` — `logger.info` — Creating payment order 🟡
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:49` — `logger.info` — Order created 🟡
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:71` — `logger.info` — Verifying payment 🟡
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:78` — `logger.info` — Payment verified 🟡
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:95` — `logger.info` — Processing wallet payment 🟡
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:99` — `logger.info` — Wallet payment completed 🟡
- [ ] `src/presentation/v1/controllers/PaymentControllerV1.ts:123` — `logger.info` — Fetching earnings 🟡
- [ ] `src/presentation/v1/controllers/PayoutControllerV1.ts:51` — `logger.info` — Fetching payouts 🟡
- [ ] `src/presentation/v1/controllers/PayoutControllerV1.ts:81` — `logger.info` — Admin fetching payouts 🟡
- [ ] `src/presentation/v1/controllers/PayoutControllerV1.ts:112` — `logger.info` — Admin payout details 🟡
- [ ] `src/presentation/v1/controllers/PayoutControllerV1.ts:130` — `logger.info` — Admin approving payout 🟡

#### Event Handlers

- [ ] `src/presentation/v1/event-handlers/JourneyPassengerDroppedOffEventHandler.ts:14` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/event-handlers/UserBlockedEventHandler.ts:15` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/event-handlers/UserUnblockedEventHandler.ts:15` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/event-handlers/BookingCancelledByPassengerEventHandler.ts:14` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/event-handlers/NewUserEventHandler.ts:16` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/event-handlers/TripCancelledByDriverEventHandler.ts:14` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/event-handlers/TripCancelledByDriverEventHandler.ts:20` — `logger.info` — Processing refund 🟡

#### EventDispatcher

- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:16` — `logger.warn` — Rewriting handler 🟢
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:19` — `logger.info` — Registered 🟡
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:25` — `logger.warn` — No handler 🟢
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:30` — `logger.info` — Calling handler 🟡
- [ ] `src/presentation/v1/messaging/EventDispatcher.ts:33` — `logger.error` — Dispatch failed 🟢

---

### user-service

#### Startup / Infrastructure

- [ ] `src/index.ts:25` — `logger.info` — Server startup port 🟢
- [ ] `src/index.ts:31` — `logger.error` — Server start failure 🟢
- [ ] `src/app.ts:53` — `logger.error` — Error handler middleware 🟢
- [ ] `src/infrastructure/database/connect-mongodb.ts:8` — `logger.info` — DB connected 🟢
- [ ] `src/infrastructure/database/connect-mongodb.ts:13` — `logger.error` — DB connection error 🟢
- [ ] `src/infrastructure/database/connect-redis.ts:11` — `logger.info` — Redis client error (should be error) 🟡
- [ ] `src/infrastructure/database/connect-redis.ts:15` — `logger.info` — Connecting to Redis 🟡
- [ ] `src/infrastructure/database/connect-redis.ts:17` — `logger.info` — Connected to Redis 🟢
- [ ] `src/infrastructure/database/connect-redis.ts:19` — `logger.error` — Redis connection error 🟢

#### LoggerService

- [ ] `src/infrastructure/services/LoggerService.ts:19-31` — pass-through wrapper 🟢

#### RabbitMQEventBus — same pattern

- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:61` — `logger.info` — Connecting 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:64` — `logger.info` — Connected 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:68` — `logger.error` — Connection error 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:73` — `logger.info` — Connection closed, retrying 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:97` — `logger.info` — Exchange asserted 🟡
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:104` — `logger.info` — Initialised 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:109` — `logger.info` — Connection failed (should be error) 🟡
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:110` — `logger.info` — Retrying 🟡
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:124` — `logger.error` — Error 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:146` — `logger.info` — Bound queue 🟡
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:149` — `logger.error` — Subscribe error 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:167` — `logger.warn` — Warning 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:186` — `logger.info` — Event published 🟡
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:190` — `logger.warn` — Failed to publish 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:195` — `logger.error` — Publish error 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:207` — `logger.error` — Error 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:214` — `logger.info` — Consumer already running 🟡
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:221` — `logger.info` — Subscribing consumer 🟡
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:228` — `logger.warn` — Consumer cancelled 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:236` — `logger.warn` — Consumer cancelled, reconnect 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:247` — `logger.info` — Event received 🟡
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:253` — `logger.error` — Processing error 🟢
- [ ] `src/infrastructure/services/RabbitMQEventBus.ts:260` — `logger.error` — Consuming error 🟢

#### Controllers — Auth

- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:54` — `logger.info` — Signing up user 🟡
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:62` — `logger.info` — Signed up user (logs full user object!) 🔴 **Leaks user data**
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:79` — `logger.info` — Verify signup email 🟡
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:86` — `logger.info` — Verification success 🟡
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:106` — `logger.info` — Logging in user (logs email!) 🔴 **Leaks PII**
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:110` — `logger.info` — Login success (logs userId) 🟡
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:127` — `logger.info` — Google login attempt 🟡
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:131` — `logger.info` — Google auth success 🟡
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:152` — `logger.info` — Token refresh request 🟡
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:156` — `logger.info` — Tokens refreshed 🟡
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:178` — `logger.info` — Password change request 🟡
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:185` — `logger.warn` — Password change token failed 🟢
- [ ] `src/presentation/v1/controllers/AuthControllerV1.ts:199` — `logger.info` — Changing password (logs email!) 🔴 **Leaks PII**

#### Controllers — Profile

- [ ] `src/presentation/v1/controllers/ProfileControllerV1.ts:47` — `logger.info` — Getting user data 🟡
- [ ] `src/presentation/v1/controllers/ProfileControllerV1.ts:141` — `logger.info` — Switching role 🟡

#### Controllers — Application

- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:66` — `logger.info` — File upload URL 🟡
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:88` — `logger.info` — Submitting application 🟡
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:110` — `logger.info` — Application action 🟡
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:135` — `logger.info` — Application action 🟡
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:160` — `logger.info` — Application action 🟡
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:192` — `logger.info` — Resubmitting onboarding 🟡
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:221` — `logger.info` — Resubmitting vehicle 🟡
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:250` — `logger.info` — Resubmitting renewal 🟡
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:279` — `logger.info` — Application action 🟡
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:305` — `logger.info` — Getting applications 🟡
- [ ] `src/presentation/v1/controllers/ApplicationControllerV1.ts:326` — `logger.info` — Application action 🟡

#### Controllers — Admin

- [ ] `src/presentation/v1/controllers/admin/AdminVehicleRecordControllerV1.ts:32` — `logger.info` — Admin fetching records 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminVehicleRecordControllerV1.ts:52` — `logger.info` — Admin record details 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminUserController.ts:48` — `logger.info` — Admin fetching users 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminUserController.ts:79` — `logger.info` — Admin user profile 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminUserController.ts:164` — `logger.info` — Admin users count 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminApplicationControllerV1.ts:38` — `logger.info` — Admin applications 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminApplicationControllerV1.ts:62` — `logger.info` — Admin application details 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminApplicationControllerV1.ts:88` — `logger.info` — Admin processing app 🟡
- [ ] `src/presentation/v1/controllers/admin/AdminApplicationControllerV1.ts:109` — `logger.info` — Admin application count 🟡

#### Event Handlers

- [ ] `src/presentation/v1/messages/event-handler/NewVehicleConfigHandler.ts:16` — `logger.info` — Handling event 🟡
- [ ] `src/presentation/v1/messages/event-handler/UpdateVehicleConfigHandler.ts:18` — `logger.info` — Handling event 🟡

#### EventDispatcher

- [ ] `src/presentation/v1/messages/EventDispatcher.ts:27` — `logger.warn` — Rewriting handler 🟢
- [ ] `src/presentation/v1/messages/EventDispatcher.ts:31` — `logger.info` — Registered 🟡
- [ ] `src/presentation/v1/messages/EventDispatcher.ts:43` — `logger.warn` — No handler 🟢
- [ ] `src/presentation/v1/messages/EventDispatcher.ts:48` — `logger.info` — Calling handler 🟡
- [ ] `src/presentation/v1/messages/EventDispatcher.ts:51` — `logger.error` — Dispatch failed 🟢

#### Use Cases (Debug Leftovers)

- [ ] `src/application/use-case/auth/VerifySignupEmailUseCase.ts:55` — `console.debug` — Token existence 🔴 **Debug leftover**
- [ ] `src/application/use-case/auth/VerifySignupEmailUseCase.ts:56` — `console.debug` — Token equality 🔴 **Debug leftover — leaks token**
- [ ] `src/application/use-case/auth/VerifySignupEmailUseCase.ts:60` — `console.debug` — Debug output 🔴 **Debug leftover**
- [ ] `src/application/use-case/profile/GetUserUseCase.ts:44` — `console.log` — "Profile URL" 🔴 **Debug leftover**
- [ ] `src/application/use-case/profile/UpdateAvatarUseCase.ts:54` — `logger.warn` — Failed to delete avatar 🟢

#### External Services

- [ ] `src/infrastructure/services/GoogleAuthService.ts:43` — `console.log` — Logs full Google user object 🔴 **Debug leftover — leaks PII**

---

### mcp-service

#### Startup / Infrastructure

- [ ] `src/index.ts:12` — `logger.info` — Server startup port 🟢
- [ ] `src/index.ts:19` — `logger.error` — Server start failure 🟢
- [ ] `src/app.ts:42` — `logger.error` — Error handler middleware 🟢

#### LoggerService

- [ ] `src/services/LoggerService.ts:19-31` — pass-through wrapper 🟢

#### Gateway Service

- [ ] `src/services/GatewayService.ts:18` — `logger.error` — Gateway call error 🟢

#### Tool Handlers (all error-level on failure)

- [ ] `src/tools/driver/handlers/ListBookingsToolHandler.ts:44` — `logger.error` 🟢
- [ ] `src/tools/driver/handlers/GetTodayTripToolHandler.ts:43` — `logger.error` 🟢
- [ ] `src/tools/driver/handlers/GetDriverStatsToolHandler.ts:43` — `logger.error` 🟢
- [ ] `src/tools/driver/handlers/GetBookingDetailsToolHandler.ts:43` — `logger.error` 🟢
- [ ] `src/tools/driver/handlers/GetTripDetailsToolHandler.ts:43` — `logger.error` 🟢
- [ ] `src/tools/driver/handlers/ListTripsToolHandler.ts:44` — `logger.error` 🟢
- [ ] `src/tools/driver/handlers/AcceptBookingToolHandler.ts:42` — `logger.error` 🟢
- [ ] `src/tools/driver/handlers/CancelTripToolHandler.ts:42` — `logger.error` 🟢
- [ ] `src/tools/driver/handlers/CreateTripToolHandler.ts:42` — `logger.error` 🟢
- [ ] `src/tools/driver/handlers/GetVehiclesToolHandler.ts:43` — `logger.error` 🟢
- [ ] `src/tools/driver/handlers/RejectBookingToolHandler.ts:42` — `logger.error` 🟢
- [ ] `src/tools/passenger/handlers/GetBookingStatsToolHandler.ts:43` — `logger.error` 🟢
- [ ] `src/tools/passenger/handlers/WithdrawBookingToolHandler.ts:42` — `logger.error` 🟢
- [ ] `src/tools/passenger/handlers/CreateBookingToolHandler.ts:42` — `logger.error` 🟢
- [ ] `src/tools/passenger/handlers/SearchTripToolHandler.ts:47` — `logger.error` 🟢
- [ ] `src/tools/passenger/handlers/ListBookingsToolHandler.ts:44` — `logger.error` 🟢
- [ ] `src/tools/passenger/handlers/CancelBookingToolHandler.ts:42` — `logger.error` 🟢
- [ ] `src/tools/passenger/handlers/GetBookingDetailsToolHandler.ts:43` — `logger.error` 🟢
- [ ] `src/tools/passenger/handlers/GetJourneyDetailsToolHandler.ts:43` — `logger.error` 🟢
- [ ] `src/tools/passenger/handlers/GetTodayTripToolHandler.ts:43` — `logger.error` 🟢

---

### api-gateway

#### Startup / Infrastructure

- [ ] `src/index.ts:13` — `logger.info` — Redis connected 🟢
- [ ] `src/index.ts:15` — `logger.error` — Redis connection failure 🟢
- [ ] `src/index.ts:24` — `logger.info` — Server startup port 🟢
- [ ] `src/index.ts:30` — `logger.error` — Server start failure 🟢

#### LoggerService

- [ ] `src/services/LoggerService.ts:19-31` — pass-through wrapper 🟢

#### Redis Config

- [ ] `src/config/redis.config.ts:10` — `console.error` — Redis client error 🟡 (should use logger)

#### Middleware

- [ ] `src/middleware/blacklist.middleware.ts:51` — `console.error` — Blacklist middleware error 🔴 **Should use logger**
- [ ] `src/middleware/auth.middleware.ts:60` — `console.log` — Auth middleware error 🔴 **Debug leftover — should use logger.error**

#### Proxy Error Handlers

- [ ] `src/app.ts:72` — `logger.error` — User service proxy error 🟢
- [ ] `src/app.ts:103` — `logger.error` — Trip service proxy error 🟢
- [ ] `src/app.ts:132` — `logger.error` — Payment service proxy error 🟢
- [ ] `src/app.ts:159` — `logger.error` — Realtime service proxy error 🟢
- [ ] `src/app.ts:181` — `logger.error` — MCP service proxy error 🟢
- [ ] `src/app.ts:200` — `logger.error` — Error handler 🟢
- [ ] `src/app.ts:221` — `logger.error` — Error handler 🟢

#### Blacklist Service

- [ ] `src/services/blacklist.service.ts:20` — `console.error` — Blacklist check error 🔴 **Should use logger**

---

## Frontend — `smr-frontend/`

### Logger Utility

- [ ] `lib/logger.ts:7-11` — Defines `error`, `info`, `warn`, `http`, `debug` wrapping `console.*` 🟢 (wrapper)

### Middleware / Proxy

- [ ] `proxy.ts:38` — `console.log` — Error getting new tokens 🔴 **Should use logger.error**
- [ ] `proxy.ts:78` — `console.log` — Middleware running on path 🔴 **Debug leftover — very high volume**
- [ ] `proxy.ts:193` — `console.error` — Token verification failed 🟡

### API Utilities

- [ ] `lib/api-client.ts:52` — `logger.info` — "Error making client side fetch" 🟡 (should be error level)
- [ ] `lib/api-server.ts:76` — `console.warn` — API warning 🟡
- [ ] `lib/api-server.ts:85` — `logger.info` — "Access token expired, attempting refresh" 🟡
- [ ] `lib/api-server.ts:94` — `console.warn` — API warning 🟡
- [ ] `lib/api-server.ts:113` — `logger.error` — Token refresh failed 🟢
- [ ] `lib/api-server.ts:119` — `console.warn` — Failed to clear cookies 🟡

### API Routes

- [ ] `app/api/[[...slug]]/route.ts:36` — `logger.warn` — Failed to read request body 🟢
- [ ] `app/api/[[...slug]]/route.ts:66` — `logger.error` — API proxy error 🟢
- [ ] `app/api/token/route.ts:54` — `logger.error` — Token refresh failed 🟢
- [ ] `app/api/assistant/route.ts:160` — `console.error` — Assistant route error 🟡
- [ ] `app/error.tsx:20` — `logger.error` — Error boundary caught error 🟢

### Feature — Auth (Actions)

- [ ] `features/auth/api/actions/GoogleLoginAction.ts:12` — `logger.info` — "Logging in user via Google" 🟡
- [ ] `features/auth/api/actions/GoogleLoginAction.ts:26` — `logger.error` — Google login request failed 🟢
- [ ] `features/auth/api/actions/GoogleLoginAction.ts:52` — `logger.error` — Google login action error 🟢
- [ ] `features/auth/api/actions/LoginUserAction.ts:12` — `logger.info` — "Logging in user" 🟡
- [ ] `features/auth/api/actions/LoginUserAction.ts:28` — `logger.error` — Login request failed 🟢
- [ ] `features/auth/api/actions/LoginUserAction.ts:55` — `logger.error` — Login action error 🟢
- [ ] `features/auth/api/actions/SignupUserAction.ts:16` — `logger.info` — "Signing up user" 🟡
- [ ] `features/auth/api/actions/SignupUserAction.ts:34` — `logger.error` — Signup action failed 🟢
- [ ] `features/auth/api/actions/SignupUserAction.ts:57` — `logger.error` — Signup action error 🟢
- [ ] `features/auth/api/actions/LogoutUserAction.ts:7` — `logger.info` — "Logging out user" 🟡
- [ ] `features/auth/api/actions/LogoutUserAction.ts:15` — `logger.error` — Error clearing cookies 🟢
- [ ] `features/auth/api/actions/ChangePasswordAction.ts:23` — `logger.error` — Password change failed 🟢
- [ ] `features/auth/api/actions/ChangePasswordAction.ts:46` — `logger.error` — Change password error 🟢
- [ ] `features/auth/api/actions/VerifySignupEMailAction.ts:12` — `logger.info` — "Signup email verification action called" 🟡
- [ ] `features/auth/api/actions/VerifySignupEMailAction.ts:27` — `logger.error` — Verify signup email failed 🟢
- [ ] `features/auth/api/actions/VerifySignupEMailAction.ts:60` — `logger.error` — Verify signup email error 🟢

### Feature — Auth (Components)

- [ ] `features/auth/components/ChangePasswordCard.tsx:56` — `logger.info` — "Handle login result" 🟡
- [ ] `features/auth/components/ChangePasswordCard.tsx:70` — `logger.error` — Password update submit error 🟢
- [ ] `features/auth/components/GoogleLogin.tsx:40` — `logger.info` — "Handle Google login result" 🟡
- [ ] `features/auth/components/GoogleLogin.tsx:63` — `logger.error` — Google login error 🟢
- [ ] `features/auth/components/LoginForm.tsx:70` — `logger.error` — Login form submit error 🟢
- [ ] `features/auth/components/LoginForm.tsx:101` — `console.log` — "Sending password reset mail request" 🔴 **Debug leftover — logs email**
- [ ] `features/auth/components/LoginForm.tsx:122` — `logger.error` — Password change request error 🟢
- [ ] `features/auth/components/SignupForm.tsx:33` — `logger.info` — "Handllel signup result" 🟡 (also has typo)
- [ ] `features/auth/components/SignupForm.tsx:46` — `logger.error` — Signup form submit error 🟢
- [ ] `features/auth/components/VerifySignupEmailCard.tsx:65` — `logger.error` — Verify signup email error 🟢

### Feature — Application (Actions)

- [ ] `features/application/api/actions/submitOnboardingApplicationAction.ts:11` — `logger.info` — "Submitting onboarding application" 🟡
- [ ] `features/application/api/actions/submitOnboardingApplicationAction.ts:28` — `logger.error` — Action failed 🟢
- [ ] `features/application/api/actions/submitOnboardingApplicationAction.ts:50` — `logger.error` — Action error 🟢
- [ ] `features/application/api/actions/submitDriverRenewalAction.ts:11` — `logger.info` — "Submitting driver renewal" 🟡
- [ ] `features/application/api/actions/submitDriverRenewalAction.ts:27` — `logger.error` — Action failed 🟢
- [ ] `features/application/api/actions/submitDriverRenewalAction.ts:49` — `logger.error` — Action error 🟢
- [ ] `features/application/api/actions/submitNewVehicleApplicationAction.ts:11` — `logger.info` — "Submitting new vehicle application" 🟡
- [ ] `features/application/api/actions/submitNewVehicleApplicationAction.ts:29` — `logger.error` — Action failed 🟢
- [ ] `features/application/api/actions/submitNewVehicleApplicationAction.ts:51` — `logger.error` — Action error 🟢
- [ ] `features/application/api/actions/submitVehicleRenewalAction.ts:11` — `logger.info` — "Submitting vehicle renewal" 🟡
- [ ] `features/application/api/actions/submitVehicleRenewalAction.ts:28` — `logger.error` — Action failed 🟢
- [ ] `features/application/api/actions/submitVehicleRenewalAction.ts:50` — `logger.error` — Action error 🟢

### Feature — Application (Forms)

- [ ] `features/application/forms/OnboardingApplicationForm.tsx:56` — `logger.info` — "Submitting Onboarding Application data" 🟡
- [ ] `features/application/forms/OnboardingApplicationForm.tsx:78` — `logger.error` — Form submit error 🟢
- [ ] `features/application/forms/DriverRenewalForm.tsx:51` — `logger.info` — "Submitting Driver Renewal Application data" 🟡
- [ ] `features/application/forms/DriverRenewalForm.tsx:73` — `logger.error` — Form submit error 🟢
- [ ] `features/application/forms/NewVehicleApplicationForm.tsx:54` — `logger.info` — "Submitting New Vehicle Application data" 🟡
- [ ] `features/application/forms/NewVehicleApplicationForm.tsx:76` — `logger.error` — Form submit error 🟢
- [ ] `features/application/forms/VehicleRenewalForm.tsx:51` — `logger.info` — "Submitting Vehicle Renewal Application data" 🟡
- [ ] `features/application/forms/VehicleRenewalForm.tsx:73` — `logger.error` — Form submit error 🟢

### Feature — Admin

- [ ] `features/admin/applications/api/actions/processApplicationAction.ts:17` — `logger.info` — "Processing application" 🟡
- [ ] `features/admin/applications/api/actions/processApplicationAction.ts:38` — `logger.error` — Action failed 🟢
- [ ] `features/admin/applications/api/actions/processApplicationAction.ts:52` — `logger.error` — Action error 🟢

### Feature — Profile (Actions)

- [ ] `features/profile/api/actions/ChangeRoleAction.ts:10` — `logger.info` — "Requesting user role switch" 🟡
- [ ] `features/profile/api/actions/ChangeRoleAction.ts:23` — `logger.error` — Role switch failed 🟢
- [ ] `features/profile/api/actions/ChangeRoleAction.ts:49` — `logger.error` — Role switch error 🟢
- [ ] `features/profile/api/actions/UpdateUserAction.ts:11` — `logger.info` — "Updating the user" 🟡
- [ ] `features/profile/api/actions/UpdateUserAction.ts:26` — `logger.error` — Update failed 🟢
- [ ] `features/profile/api/actions/UpdateUserAction.ts:50` — `logger.error` — Update error 🟢
- [ ] `features/profile/api/actions/resubmitDriverRenewalAction.ts:12` — `logger.info` — "Resubmitting driver renewal" 🟡
- [ ] `features/profile/api/actions/resubmitDriverRenewalAction.ts:29` — `logger.error` — Resubmit failed 🟢
- [ ] `features/profile/api/actions/resubmitDriverRenewalAction.ts:43` — `logger.error` — Resubmit error 🟢
- [ ] `features/profile/api/actions/resubmitNewVehicleApplicationAction.ts:12` — `logger.info` — "Resubmitting vehicle application" 🟡
- [ ] `features/profile/api/actions/resubmitNewVehicleApplicationAction.ts:29` — `logger.error` — Resubmit failed 🟢
- [ ] `features/profile/api/actions/resubmitNewVehicleApplicationAction.ts:43` — `logger.error` — Resubmit error 🟢
- [ ] `features/profile/api/actions/resubmitOnboardingApplicationAction.ts:12` — `logger.info` — "Resubmitting onboarding application" 🟡
- [ ] `features/profile/api/actions/resubmitOnboardingApplicationAction.ts:29` — `logger.error` — Resubmit failed 🟢
- [ ] `features/profile/api/actions/resubmitOnboardingApplicationAction.ts:43` — `logger.error` — Resubmit error 🟢
- [ ] `features/profile/api/actions/resubmitVehicleRenewalAction.ts:12` — `logger.info` — "Resubmitting vehicle renewal" 🟡
- [ ] `features/profile/api/actions/resubmitVehicleRenewalAction.ts:29` — `logger.error` — Resubmit failed 🟢
- [ ] `features/profile/api/actions/resubmitVehicleRenewalAction.ts:43` — `logger.error` — Resubmit error 🟢

### Feature — Profile (Requests & Forms)

- [ ] `features/profile/api/requests/getAvatarUploadUrlRequest.ts:19` — `logger.error` — Failed to get avatar upload URL 🟢
- [ ] `features/profile/api/requests/getDriverDetailsRequest.ts:13` — `logger.error` — Failed to get driver details 🟢
- [ ] `features/profile/api/requests/getDriverVehiclesRequest.ts:13` — `logger.error` — Failed to get driver vehicles 🟢
- [ ] `features/profile/api/requests/getUserRequest.ts:13` — `logger.error` — Failed to get user details 🟢
- [ ] `features/profile/api/requests/updateAvatarRequest.ts:16` — `logger.error` — Failed to update avatar 🟢
- [ ] `features/profile/forms/ProfileUpdateForm.tsx:129` — `logger.error` — Failed to update profile 🟢
- [ ] `features/profile/forms/ProfileUpdateForm.tsx:136` — `logger.error` — Error updating profile 🟢
- [ ] `features/profile/forms/ProfileUpdateForm.tsx:151` — `console.log` — "Sending password reset mail request" 🔴 **Debug leftover — logs email**
- [ ] `features/profile/forms/ProfileUpdateForm.tsx:172` — `logger.error` — Password change request error 🟢
- [ ] `features/profile/views/ProfilePageView.tsx:19` — `logger.error` — Error fetching user data 🟢

### Feature — Realtime (Socket Hooks)

- [ ] `features/realtime/hooks/useCallSocket.ts:23` — `logger.info` — "Call socket connected" 🟡
- [ ] `features/realtime/hooks/useCallSocket.ts:24` — `logger.info` — "Call socket disconnected" 🟡
- [ ] `features/realtime/hooks/useCallSocket.ts:26` — `logger.error` — Call socket error 🟢
- [ ] `features/realtime/hooks/useChatSocket.ts:24` — `logger.info` — "Chat socket connected" 🟡
- [ ] `features/realtime/hooks/useChatSocket.ts:25` — `logger.info` — "Chat socket disconnected" 🟡
- [ ] `features/realtime/hooks/useChatSocket.ts:27` — `logger.error` — Chat socket error 🟢
- [ ] `features/realtime/hooks/useLiveLocationSocket.ts:23` — `logger.info` — "Journey socket connected" 🟡
- [ ] `features/realtime/hooks/useLiveLocationSocket.ts:24` — `logger.info` — "Journey socket disconnected" 🟡
- [ ] `features/realtime/hooks/useLiveLocationSocket.ts:26` — `logger.error` — Journey socket error 🟢

### Feature — Map

- [ ] `features/map/services/mapbox/NavigationManager.ts:120` — `console.log` — "Current Route" 🔴 **Debug leftover — high frequency**
- [ ] `features/map/services/mapbox/NavigationManager.ts:142` — `console.log` — "The new route is" 🔴 **Debug leftover — high frequency**
- [ ] `features/map/services/mapbox/NavigationManager.ts:262` — `console.warn` — Watch position error 🟢
- [ ] `features/map/services/mapbox/MapboxCore.ts:132` — `console.warn` — Map warning 🟡
- [ ] `features/map/services/mapbox/MapboxCore.ts:162` — `console.error` — Geolocate error 🟢
- [ ] `features/map/services/mapbox/MapboxCore.ts:179` — `console.warn` — Geolocate removal 🟡
- [ ] `features/map/components/MapSearchInput.tsx:53` — `console.error` — Place details error 🟢
- [ ] `features/map/components/MapSearchInput.tsx:84` — `console.error` — Search suggestions error 🟢
- [ ] `features/map/components/MapContainer.tsx:28` — `console.warn` — Map setup warning 🟡

### Feature — Driver

- [ ] `features/driver/trips/forms/CreateTripForm.tsx:64` — `console.log` — "Dest: " 🔴 **Debug leftover**
- [ ] `features/driver/trips/forms/CreateTripForm.tsx:65` — `console.log` — "Origin: " 🔴 **Debug leftover**
- [ ] `features/driver/trips/forms/CreateTripForm.tsx:106` — `console.error` — Failed to update route 🟢
- [ ] `features/driver/trips/forms/CreateTripForm.tsx:111` — `console.warn` — Fallback route error 🟢
- [ ] `features/driver/trips/forms/CreateTripForm.tsx:321` — `logger.error` — Failed to submit create trip form 🟢
- [ ] `features/driver/trips/views/DriverTripDetailsView.tsx:123` — `console.warn` — Map setup failed 🟡
- [ ] `features/driver/bookings/views/DriverBookingDetailsView.tsx:161` — `console.error` — Map route error 🟢
- [ ] `features/driver/journey/components/CurrentTargetCard.tsx:177` — `console.log` — Bare error log 🔴 **Debug leftover**

### Feature — Passenger

- [ ] `features/passenger/bookings/views/PassengerBookingDetailsView.tsx:84` — `console.error` — Map route error 🟢
- [ ] `features/passenger/trips/components/TripSearchBar.tsx:63` — `console.error` — Map marker error 🟢
- [ ] `features/passenger/trips/views/PassengerTripsView.tsx:101` — `console.error` — Search trips error 🟢
- [ ] `features/passenger/journey/views/PassengerJourneyView.tsx:39` — `console.error` — Journey socket error 🟢
- [ ] `features/passenger/trips/components/TripListingCard.tsx:51` — `console.error` — Turf distance error 🟢
- [ ] `features/passenger/trips/components/TripListingCard.tsx:131` — `console.error` — Booking submit error 🟢
- [ ] `features/passenger/trips/components/TripListingCard.tsx:173` — `console.error` — Render trip route error 🟢
- [ ] `features/passenger/trips/components/TripListingCard.tsx:195` — `console.error` — Load journey error 🟢
- [ ] `features/passenger/trips/components/TripListingCard.tsx:240` — `console.error` — Update markers error 🟢

### Feature — AI Chat

- [ ] `features/ai-chat/components/ChatPanel.tsx:21` — `console.log` — Logs chat messages 🔴 **Debug leftover — PII risk**

### Feature — Call

- [ ] `features/call/CallModals.tsx:95` — `.catch(console.error)` — Audio play error 🟢

---

## Summary

| Category | Count |
|----------|-------|
| **Total log statements** | **~585** |
| 🔴 Debug leftovers (remove) | **~22** |
| 🟡 Verbose / consider downgrading | **~200** |
| 🟢 Keep as-is | **~363** |

### Key Issues to Address

1. **Debug `console.log` leftovers** — ~22 instances of raw `console.log`/`console.debug` in production code that should be removed
2. **PII leaks** — Email addresses, user objects, Google user profiles, and verification tokens logged at `info` level in user-service and frontend
3. **Morgan `"dev"` format** — All 5 HTTP services use dev-mode request logging; switch to `"combined"` or `"short"` for production, or disable below a threshold
4. **Inconsistent console vs logger** — `api-gateway` middleware, `proxy.ts`, and several use cases use raw `console.*` instead of the project's `LoggerService`
5. **Wrong log levels** — Redis errors logged as `info`, RabbitMQ connection failures logged as `info` instead of `error`/`warn`, fetch errors logged as `logger.info`
6. **Controller verbosity** — Every backend controller method logs entry at `info` level; consider `debug` for routine requests
7. **EventBus duplication** — EventBus logging is copy-pasted across 4 services with identical messages; any structural change needs 4 edits
8. **Event handler pattern** — Every handler logs "Handling X event" + "Successfully handled" at `info`; the success log adds noise
9. **Frontend `proxy.ts:78`** — Logs every middleware invocation, extremely high volume in production
10. **Frontend action verbosity** — Every server action logs entry at `info` level; consider `debug` for routine actions

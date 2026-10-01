# Clean Architecture Specification: `realtime-service`

## 1. System Overview & Dependency Rules

The `realtime-service` follows **Clean Architecture** patterns established across the ShareMyRide monorepo.

```
Presentation ───┐
                ▼
Infrastructure ───► Application ───► Domain (Core / Pure TypeScript)
```

1. **Domain**: Pure business rules and entities. Zero dependencies on Socket.IO, Redis, Mongo, or Express.
2. **Application**: Orchestration layer containing use cases, application DTOs (`camelCase`), and interface contracts (`IRepository`, `ISocketEmitter`, `ILocationStore`).
3. **Infrastructure**: Technical implementations (Redis Geo repositories, Socket.IO adapter, MongoDB models, RabbitMQ event bus, Logger).
4. **Presentation**: External entry points (Socket.IO event handlers, REST health-check routes, RabbitMQ event handlers, manual Dependency Injection module).

---

## 2. Directory & File Tree

```
smr-backend/realtime-service/
├── .env.example
├── package.json
├── tsconfig.json
└── src/
    ├── application.config.ts                  # Validated environment variables (Zod)
    ├── app.ts                                 # Express app setup (health checks, CORS)
    ├── index.ts                               # HTTP + Socket.IO server bootstrap
    ├── instrumentation.ts                     # OpenTelemetry / tracing (consistent with other services)
    │
    ├── domain/                                # ─── LAYER 1: PURE BUSINESS RULES ───
    │   └── entities/
    │       ├── CallSessionEntity.ts           # Call state entity
    │       ├── ChatEntity.ts                  # Chat room entity
    │       ├── ChatMessageEntity.ts           # Message entity with timestamps and delivery state
    │       └── MemeberEntity.ts               # Member entity (user presence/active trips)
    │
    ├── application/                           # ─── LAYER 2: USE CASES & INTERFACES ───
    │   ├── dto/
    │   │   └── MemberDTO.ts                   # Internal camelCase application DTO
    │   │
    │   ├── interfaces/
    │   │   ├── messaging/
    │   │   │   ├── IEventBus.ts               # Contract for RabbitMQ publishing/consumption
    │   │   │   ├── IEventDispatcher.ts         # Contract for routing events to handlers
    │   │   │   └── IEventHandler.ts            # Contract for individual event handlers
    │   │   ├── repository/
    │   │   │   ├── IBaseRepository.ts          # Generic repository contract
    │   │   │   ├── ICallSessionRepository.ts   # Contract for call session persistence/state
    │   │   │   ├── IChatRepository.ts          # Contract for chat room persistence
    │   │   │   ├── IMemberRepository.ts        # Contract for member persistence
    │   │   │   └── IMessageRepository.ts       # Contract for MongoDB chat message storage
    │   │   ├── services/
    │   │   │   └── IUniqueIDGenerator.ts       # Contract for UID generation
    │   │   ├── sockets/
    │   │   │   └── ISocketEmitter.ts           # Contract to emit events to rooms/users
    │   │   └── use-cases/
    │   │       ├── chat/
    │   │       │   ├── IAddChatMembersUseCase.ts
    │   │       │   ├── ICloseChatUseCase.ts
    │   │       │   ├── ICreateNewChatUseCase.ts
    │   │       │   └── IRemoveChatMembersUseCase.ts
    │   │       └── members/
    │   │           ├── IAddActiveTripUseCase.ts
    │   │           ├── ICreateMemberUseCase.ts
    │   │           └── IRemoveActiveTripUseCase.ts
    │   │
    │   └── use-cases/
    │       ├── chat/
    │       │   ├── AddChatMemberUseCase.ts
    │       │   ├── CloseChatUseCase.ts
    │       │   ├── CreateNewChatUseCase.ts
    │       │   └── RemoveChatMembersUseCase.ts
    │       └── members/
    │           ├── AddActiveTripUseCase.ts
    │           ├── CreateMemeberUseCase.ts
    │           └── RemoveActiveTripUseCase.ts
    │
    ├── infrastructure/                        # ─── LAYER 3: FRAMEWORKS & DRIVERS ───
    │   ├── database/
    │   │   ├── connect-mongodb.ts             # MongoDB client connection
    │   │   └── model/
    │   │       ├── MongoCallSessionModel.ts
    │   │       ├── MongoChatModel.ts
    │   │       ├── MongoMemberModel.ts
    │   │       └── MongoMessageModel.ts
    │   ├── repository/
    │   │   ├── BaseRepository.ts              # Generic Mongo repository base
    │   │   ├── CallSessionRepository.ts       # Implements ICallSessionRepository
    │   │   ├── ChatRepository.ts              # Implements IChatRepository
    │   │   ├── MemberRepository.ts            # Implements IMemberRepository
    │   │   └── MessageRepository.ts           # Implements IMessageRepository
    │   └── services/
    │       ├── CryptoUIDService.ts            # Implements IUniqueIDGenerator
    │       ├── EventBus.ts                    # Implements IEventBus (RabbitMQ)
    │       └── LoggerService.ts               # Implements ILogger from @sharemyride/shared
    │
    └── presentation/                          # ─── LAYER 4: ENTRY POINTS & SOCKETS ───
        ├── realtime-service.module.ts         # Manual DI container (instantiates and wires everything)
        ├── middleware/
        │   ├── gateway-key.middleware.ts       # Validates API gateway key on requests
        │   └── http-metrics.middleware.ts      # HTTP metrics collection
        ├── utils/
        │   └── traces-decorator.ts            # @Trace decorator for OpenTelemetry spans
        └── v1/
            ├── messaging/
            │   ├── EventDispatcher.ts         # Routes domain events to registered handlers
            │   └── event-handlers/
            │       ├── DriverCancelTripEventHandler.ts
            │       ├── NewBookingEventHandler.ts
            │       ├── NewTripEventHandler.ts
            │       ├── PassengerCancelBookingEventHandler.ts
            │       └── UserSignupEventHandler.ts
            └── sockets/
                ├── SocketServer.ts            # Socket.IO setup, CORS, middleware attachment
                ├── interfaces/
                │   └── ISocketHandler.ts      # register(socket) contract for socket handlers
                ├── middlewares/
                │   └── socket-auth.middleware.ts  # Verifies JWT on socket handshake
                └── handlers/
                    └── ChatSocketHandler.ts   # Handles chat socket events (send_message, etc.)
```

---

## 3. Layer Responsibilities & Examples

### 3.1 Domain Layer (`src/domain/`)
Pure, decoupled business rules and validation.

```typescript
// src/domain/entities/DriverLocation.ts
export class DriverLocation {
  constructor(
    public readonly tripId: string,
    public readonly driverId: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly heading: number = 0,
    public readonly speed: number = 0,
    public readonly timestamp: number = Date.now(),
  ) {
    if (latitude < -90 || latitude > 90) throw new Error("Invalid latitude");
    if (longitude < -180 || longitude > 180) throw new Error("Invalid longitude");
  }
}
```

---

### 3.2 Application Layer (`src/application/`)
Orchestrates operations without knowing whether Redis, Mongo, or Socket.IO is used.

```typescript
// src/application/use-cases/location/UpdateDriverLocationUseCase.ts
export class UpdateDriverLocationUseCase {
  constructor(
    private readonly locationStore: ILocationStore,
    private readonly socketEmitter: ISocketEmitter,
  ) {}

  async execute(input: UpdateLocationInputDTO): Promise<void> {
    const location = new DriverLocation(
      input.tripId,
      input.driverId,
      input.latitude,
      input.longitude,
      input.heading,
      input.speed,
      input.timestamp,
    );

    await this.locationStore.saveDriverLocation(location);

    await this.socketEmitter.emitToRoom(
      `trip_tracking_${input.tripId}`,
      "trip:location_tick",
      {
        trip_id: location.tripId,
        latitude: location.latitude,
        longitude: location.longitude,
        heading: location.heading,
        speed: location.speed,
        timestamp: location.timestamp,
      }
    );
  }
}
```

---

### 3.3 Infrastructure Layer (`src/infrastructure/`)
Implements the interfaces using concrete technologies.

```typescript
// src/infrastructure/store/RedisLocationStore.ts
export class RedisLocationStore implements ILocationStore {
  constructor(private readonly redis: RedisClientType) {}

  async saveDriverLocation(location: DriverLocation): Promise<void> {
    const key = `trip:live_loc:${location.tripId}`;
    await this.redis.hSet(key, {
      lat: location.latitude.toString(),
      lng: location.longitude.toString(),
      heading: location.heading.toString(),
      speed: location.speed.toString(),
      timestamp: location.timestamp.toString(),
    });
    await this.redis.expire(key, 900);
  }
}
```

---

### 3.4 Presentation Layer (`src/presentation/`)

#### Socket Handlers
Each handler is a class that implements `ISocketHandler` with a `register(socket)` method. Dependencies (use cases, logger) are constructor-injected. One instance is created at startup and reused across all connections.

```typescript
// src/presentation/v1/sockets/handlers/ChatSocketHandler.ts
export class ChatSocketHandler implements ISocketHandler {
  constructor(
    private readonly _logger: ILogger,
    private readonly _sendMessageUseCase: ISendMessageUseCase,
  ) {}

  register(socket: Socket): void {
    socket.on("chat:send", (data) => this.onSendMessage(socket, data));
    socket.on("chat:typing", (data) => this.onTyping(socket, data));
  }

  private async onSendMessage(socket: Socket, data: unknown): Promise<void> {
    // DTO mapping, validation, call use case
  }

  private async onTyping(socket: Socket, data: unknown): Promise<void> {
    // ...
  }
}
```

#### Socket Server
The `SocketServer` receives an array of `ISocketHandler` instances and calls `register(socket)` on each when a new connection arrives.

```typescript
// src/presentation/v1/sockets/SocketServer.ts
export function createSocketServer(
  httpServer: HttpServer,
  logger: ILogger,
  handlers: ISocketHandler[],
) {
  const io = new Server(httpServer, { cors: { origin: "*" } });

  io.engine.use(gatewayKeyMiddleware);
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    for (const handler of handlers) {
      handler.register(socket);
    }

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });

    socket.on("connect_error", (err) => {
      logger.error(err.message);
    });
  });

  return io;
}
```

#### RabbitMQ Event Handlers
Each handler is a class implementing `IEventHandler<T>` with a `handle(event)` method. The `EventDispatcher` routes incoming domain events to the matching handler by `EventName`.

```typescript
// src/presentation/v1/messaging/event-handlers/NewBookingEventHandler.ts
export class NewBookingEventHandler implements IEventHandler<NewBookingEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _addActiveTripUseCase: IAddActiveTripUseCase,
    private readonly _addChatMembersUseCase: IAddChatMembersUseCase,
  ) {}

  @Trace("realtime-service-event-handler")
  async handle(event: NewBookingEvent): Promise<void> {
    await this._addActiveTripUseCase.execute({
      userId: event.payload.passengerId,
      tripId: event.payload.tripId,
    });

    await this._addChatMembersUseCase.execute(
      event.payload.tripId,
      event.payload.passengerId,
    );
  }
}
```

---

## 4. Monorepo Integration Checklist

1. **`pnpm-workspace.yaml`**: `smr-backend/*` automatically includes `smr-backend/realtime-service`.
2. **`package.json` Name**: `@smr/realtime-service`.
3. **Internal Path Aliasing**: Map `"#/*": ["./src/*"]` in `tsconfig.json` matching other backend services.
4. **Port Allocation**: Port `4005` (Gateway: `4000`, User: `4001`, Trip: `4002`, Payment: `4003`, Comm: `4004`).
5. **Gateway Proxy**: In `smr-backend/api-gateway/src/app.ts`, route `/realtime.io/**` (or unified `/socket.io/**`) to `REALTIME_SERVICE_URL`.

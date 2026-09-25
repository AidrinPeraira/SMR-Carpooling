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
4. **Presentation**: External entry points (Socket.IO event handlers, REST health-check routes, manual Dependency Injection module).

---

## 2. Directory & File Tree

```
smr-backend/realtime-service/
├── .env.example
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── application.config.ts                  # Validated environment variables (Zod)
    ├── app.ts                                 # Express app setup (health checks, CORS)
    ├── index.ts                               # HTTP + Socket.IO server bootstrap & DI wiring
    ├── instrumentation.ts                     # OpenTelemetry / tracing (consistent with other services)
    │
    ├── domain/                                # ─── LAYER 1: PURE BUSINESS RULES ───
    │   ├── entities/
    │   │   ├── DriverLocation.ts              # Location entity (lat, lng, heading, speed, timestamp)
    │   │   ├── CallSession.ts                 # Call state machine (IDLE, RINGING, ACTIVE, ENDED)
    │   │   └── ChatMessage.ts                 # Message entity with timestamps and delivery state
    │   └── value-objects/
    │       ├── Coordinates.ts                 # Validated latitude [-90, 90] & longitude [-180, 180]
    │       └── CallSessionId.ts               # Unique session identifier value object
    │
    ├── application/                           # ─── LAYER 2: USE CASES & INTERFACES ───
    │   ├── dto/
    │   │   ├── location/
    │   │   │   ├── UpdateLocationInputDTO.ts  # Internal camelCase application DTO
    │   │   │   └── BroadcastLocationDTO.ts
    │   │   ├── call/
    │   │   │   ├── InitiateCallInputDTO.ts
    │   │   │   └── RelaySignalInputDTO.ts
    │   │   └── chat/
    │   │       └── SendMessageInputDTO.ts
    │   │
    │   ├── interfaces/
    │   │   ├── store/
    │   │   │   └── ILocationStore.ts          # Contract for Redis Geospatial caching
    │   │   ├── repository/
    │   │   │   ├── ICallSessionRepository.ts  # Contract for call session persistence/state
    │   │   │   └── IMessageRepository.ts      # Contract for MongoDB chat storage
    │   │   ├── services/
    │   │   │   ├── ISocketEmitter.ts          # Contract to emit events to rooms/users
    │   │   │   └── ITokenVerifier.ts          # Contract to verify client JWT on connection
    │   │   └── messaging/
    │   │       └── IEventBus.ts               # Contract for RabbitMQ publishing/consumption
    │   │
    │   └── use-cases/
    │       ├── location/
    │       │   ├── UpdateDriverLocationUseCase.ts
    │       │   └── GetLatestTripLocationUseCase.ts
    │       ├── call/
    │       │   ├── InitiateCallUseCase.ts
    │       │   ├── AcceptCallUseCase.ts
    │       │   ├── RejectCallUseCase.ts
    │       │   ├── EndCallUseCase.ts
    │       │   └── RelayCallSignalUseCase.ts
    │       └── chat/
    │           ├── SendMessageUseCase.ts
    │           ├── SyncChatHistoryUseCase.ts
    │           └── JoinChatUseCase.ts
    │
    ├── infrastructure/                        # ─── LAYER 3: FRAMEWORKS & DRIVERS ───
    │   ├── store/
    │   │   ├── connect-redis.ts               # Redis client connection
    │   │   └── RedisLocationStore.ts          # Implements ILocationStore (GEOADD, GEOPOS, HSET)
    │   ├── database/
    │   │   ├── connect-mongodb.ts             # MongoDB client connection (for Chat history)
    │   │   └── models/
    │   │       ├── ChatMessageModel.ts
    │   │       └── CallSessionModel.ts
    │   ├── repository/
    │   │   ├── MongoMessageRepository.ts      # Implements IMessageRepository
    │   │   └── MongoCallSessionRepository.ts  # Implements ICallSessionRepository
    │   └── services/
    │       ├── SocketIOEmitter.ts             # Implements ISocketEmitter using io.to(room)
    │       ├── JwtTokenVerifier.ts            # Implements ITokenVerifier (Jose / JWT verification)
    │       ├── RabbitMQEventBus.ts            # Implements IEventBus
    │       └── WinstonLoggerService.ts        # Implements ILogger from @sharemyride/shared
    │
    └── presentation/                          # ─── LAYER 4: ENTRY POINTS & SOCKETS ───
        ├── realtime-service.module.ts         # Manual DI container (instantiates and wires repos & use cases)
        ├── http/
        │   ├── routes/
        │   │   └── health.route.ts            # GET /health, GET /metrics
        │   └── controllers/
        │       └── HealthController.ts
        └── sockets/
            ├── SocketServer.ts                # Socket.IO setup + Redis Adapter attachment
            ├── middlewares/
            │   └── socket-auth.middleware.ts  # Verifies JWT on handshake before allowing socket connection
            └── handlers/                      # Dispatches socket events to application use cases
                ├── LocationSocketHandler.ts   # Handles 'location:update', 'trip:join_tracking'
                ├── CallSocketHandler.ts       # Handles 'initiate_call', 'accept_call', 'relay_signal'
                └── ChatSocketHandler.ts       # Handles 'send_message', 'sync_history', 'join_chat'
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

    // 1. Cache latest in-memory coordinate
    await this.locationStore.saveDriverLocation(location);

    // 2. Broadcast to passengers in this trip's tracking room
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
    // Set 15-minute TTL so abandoned trips clean up automatically
    await this.redis.expire(key, 900);
  }
}
```

---

### 3.4 Presentation Layer (`src/presentation/`)
Thin routing/dispatching layer that attaches Socket.IO events to use cases.

```typescript
// src/presentation/sockets/handlers/LocationSocketHandler.ts
export class LocationSocketHandler {
  constructor(private readonly updateLocationUseCase: UpdateDriverLocationUseCase) {}

  register(socket: Socket): void {
    socket.on("location:update", async (data: DriverLocationUpdateDTO) => {
      try {
        await this.updateLocationUseCase.execute({
          tripId: data.trip_id,
          driverId: socket.data.userId,
          latitude: data.latitude,
          longitude: data.longitude,
          heading: data.heading ?? 0,
          speed: data.speed ?? 0,
          timestamp: data.timestamp ?? Date.now(),
        });
      } catch (err: unknown) {
        socket.emit("error", { message: "Failed to process location tick" });
      }
    });

    socket.on("trip:join_tracking", ({ tripId }: { tripId: string }) => {
      void socket.join(`trip_tracking_${tripId}`);
    });

    socket.on("trip:leave_tracking", ({ tripId }: { tripId: string }) => {
      void socket.leave(`trip_tracking_${tripId}`);
    });
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

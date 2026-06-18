# RabbitMQ Event-Driven Guidelines

We use **RabbitMQ (v3.x)** as our asynchronous message broker, mediated via the Node.js **amqplib (v2.0+)** client.

---

## 1. Message Broker Topology
To keep the microservices decoupled and extensible:
1.  **Topic Exchange**: We use a single main topic exchange named `sharemyride.events` configured on startup.
2.  **Routing Keys**: Events must be published with a routing key following the format: `<service-name>.<entity-name>.<action-name>` (e.g., `user-service.user.registered`, `trip-service.booking.created`).
3.  **Queues**: Each microservice that needs to consume an event defines its own private queue and binds it to the exchange with the relevant routing key pattern (e.g. `notification-service.on-user-signup` bound to `user-service.user.registered`).

---

## 2. Event Contracts
All event payloads published to RabbitMQ must be strictly validated before transmission:
*   Event schemas are maintained centrally in [smr-shared/src/event/](file:///home/aidrin-peraira/Projects/ShareMyRide/smr-shared/src/event).
*   Event DTOs must include metadata (event ID, timestamp, correlation ID, origin service) along with the domain-specific data payload.

#### Example Event Publishing Pattern
```typescript
import { IEventBus } from "#/application/interfaces/services/IEventBus";
import { UserRegisteredEvent } from "@smr/shared";

export class RegisterUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _eventBus: IEventBus
  ) {}

  async execute(dto: SignUpRequestDTO): Promise<SignUpResult> {
    // ... business logic, saving to DB ...
    
    // Publish event
    const event = new UserRegisteredEvent({
      userId: newUser.userId,
      emailId: newUser.emailId,
      firstName: newUser.firstName,
    });
    
    await this._eventBus.publish("user-service.user.registered", event);
  }
}
```

---

## 3. Reliability and Error Handling
To prevent message loss:
1.  **Publisher Confirms**: Publishers must verify that the broker has acknowledged receipt of the message.
2.  **Explicit Message Acknowledgments**: Consumers must use manual acknowledgments (`channel.ack(message)`). Do not configure `noAck: true`.
3.  **Dead Letter Exchanges (DLX)**:
    *   All application queues must be declared with a Dead Letter Exchange (`x-dead-letter-exchange: sharemyride.dlx`) and routing keys.
    *   If processing fails repeatedly or the message is malformed, reject the message without requeueing (`channel.nack(message, false, false)`). This automatically routes it to the Dead Letter Queue (DLQ) for investigation.

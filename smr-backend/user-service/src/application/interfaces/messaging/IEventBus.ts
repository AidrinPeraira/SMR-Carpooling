import { DomainEvent, EventName } from "@sharemyride/shared";

/**
 * Interface for the Message Broker to handle Event-Driven Architecture.
 */
export interface IEventBus {
  /**
   * Connects to the message broker.
   */
  connect?(): Promise<void>;

  /**
   * Publishes domain events to the topic exchange.
   */
  publish<EventPayloadType>(
    event: DomainEvent<EventPayloadType>,
  ): Promise<void>;

  /**
   * Asserts the service queue and binds it to specified event routing keys.
   */
  subscribe?(eventsToListenTo?: EventName[]): Promise<void>;

  /**
   * Starts consuming messages from the queue.
   */
  consume?(): Promise<void>;
}

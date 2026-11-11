import { DomainEvent, EventName } from "@sharemyride/shared";

/**
 * Interface for the Message Broker to handle Event-Driven Architecture.
 * Follows the Pub/Sub design pattern using RabbitMQ topic exchanges.
 */
export interface IEventBus {
  /**
   * Connects to the message broker, sets up reconnect listeners,
   * and asserts base exchange and Dead Letter Queues (DLQ).
   */
  connect(): Promise<void>;

  /**
   * Publishes domain events to the topic exchange.
   *
   * @param event - Domain event with payload and metadata
   */
  publish<EventPayloadType>(
    event: DomainEvent<EventPayloadType>,
  ): Promise<void>;

  /**
   * Asserts the service queue and binds it to specified event routing keys on the exchange.
   *
   * @param eventsToListenTo - List of event names/routing keys to subscribe to.
   */
  subscribe(eventsToListenTo?: EventName[]): Promise<void>;

  /**
   * Starts the worker listener to consume messages from the queue,
   * deserialize payloads, and dispatch events to handlers.
   */
  consume(): Promise<void>;
}

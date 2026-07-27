import { DomainEvent } from "@sharemyride/shared";

/**
 * This is the interface for the Message Broker to handle
 * event driven architecture. It should follow the pub-sub design pattern with the topic exchange approach.
 */
export interface IEventBus {
  /**
   * This method conncects and assers queues / exchanges to the message broker
   */
  connect(): Promise<void>;

  /**
   * This method publishes events for other services to consume
   *
   * @param event: Domain event with payload
   */
  publish<EventPayloadType>(
    event: DomainEvent<EventPayloadType>,
  ): Promise<void>;

  /*
   * Starts the event listener that checks for events
   * It calls the event dispatcher which inturn calls the right handler to consume
   * the event
   */
  consume(): Promise<void>;
}

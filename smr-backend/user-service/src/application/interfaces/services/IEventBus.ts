import { DomainEvent } from "@smr/shared";

/**
 * This is the interface for the Message Broker to handle
 * event driven architecture. It should follow the pub-sub design pattern with the topic exchange approach.
 */
export interface IEventBus {
  publish<EventPayloadType>(
    event: DomainEvent<EventPayloadType>,
  ): Promise<void>;
}

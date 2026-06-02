import { DomainEvent } from "@smr/shared";

export interface IEventBus {
  publish<EventPayloadType>(
    event: DomainEvent<EventPayloadType>,
  ): Promise<void>;
}

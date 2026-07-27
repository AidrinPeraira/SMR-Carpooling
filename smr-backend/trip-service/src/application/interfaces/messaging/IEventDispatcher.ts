import { DomainEvent, EventName } from "@sharemyride/shared";

/**
 * This class acts as a register for all events and their corresponding handlers.
 * It keeps tracks of the events and the handlers which call the right use case.
 * It handles routing the event to the right handler
 */
export interface IEventDispatcher {
  register(eventName: EventName, handler: IEventHandler): Promise<void>;

  dispatch(event: DomainEvent<unknown>): Promise<void>;
}

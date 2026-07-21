import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { DomainEvent, EventName } from "@sharemyride/shared";

export interface IEventDispatcher {
  /**
   * This method adds event names and correspinding handler to memory
   * It tracks like a register
   */
  register(eventName: EventName, handler: IEventHandler): Promise<void>;

  /**
   * This method takes the domain event, checks the name and calls the correct handler
   */
  dispatch(event: DomainEvent<unknown>): Promise<void>;
}

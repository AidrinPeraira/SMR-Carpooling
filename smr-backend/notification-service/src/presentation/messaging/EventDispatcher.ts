import { IEventDispatcher } from "#/application/interfaces/messaging/IEventDispatcher";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { DomainEvent, EventName, ILogger } from "@smr/shared";

export class EventDispatcher implements IEventDispatcher {
  private readonly _handlersList: Map<EventName, IEventHandler>;
  private readonly _logger: ILogger;

  constructor(logger: ILogger) {
    this._logger = logger;
    this._handlersList = new Map<EventName, IEventHandler>();
  }

  /**
   * Register new event and corresponding handler
   */
  async register(eventName: EventName, handler: IEventHandler): Promise<void> {
    if (this._handlersList.has(eventName)) {
      this._logger.warn("Rewriting existin event handler: ", eventName);
    }
    this._handlersList.set(eventName, handler);

    this._logger.info("Succesfully registered event handler for ", eventName);
  }

  /**
   * This method finds the right handler from the list
   * Calls it according to the event
   */
  async dispatch(event: DomainEvent<unknown>): Promise<void> {
    const handler = this._handlersList.get(event.eventName);
    if (!handler) {
      this._logger.warn("No handler registered for event: ", event);
      return;
    }

    try {
      this._logger.info("Calling event hanler for ", event.eventName);
      await handler.handle(event);
    } catch (error: unknown) {
      this._logger.error("Failed to dipatch event: ", error);
      throw error;
    }
  }
}

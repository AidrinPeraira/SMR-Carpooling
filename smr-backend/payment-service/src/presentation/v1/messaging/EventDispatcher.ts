import { IEventDispatcher } from "#/application/interfaces/messaging/IEventDispatcher";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { DomainEvent, EventName, ILogger } from "@sharemyride/shared";

export class EventDispatcher implements IEventDispatcher {
  private readonly _handlersList: Map<EventName, IEventHandler>;
  private readonly _logger: ILogger;

  constructor(logger: ILogger) {
    this._logger = logger;
    this._handlersList = new Map<EventName, IEventHandler>();
  }

  async register(eventName: EventName, handler: IEventHandler): Promise<void> {
    if (this._handlersList.has(eventName)) {
      this._logger.warn("Rewriting existing event handler: ", eventName);
    }
    this._handlersList.set(eventName, handler);
    this._logger.info("Successfully registered event handler for ", eventName);
  }

  async dispatch(event: DomainEvent<unknown>): Promise<void> {
    const handler = this._handlersList.get(event.eventName);
    if (!handler) {
      this._logger.warn("No handler registered for event: ", event.eventName);
      return;
    }

    try {
      this._logger.info("Calling event handler for ", event.eventName);
      await handler.handle(event);
    } catch (error: unknown) {
      this._logger.error("Failed to dispatch event: ", error);
      throw error;
    }
  }
}

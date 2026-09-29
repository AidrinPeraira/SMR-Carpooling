/**
 * Event handler that calls the use case. This is class acts like a controller that calls the use case.
 */
export interface IEventHandler<EventType = unknown> {
  /**
   * This method processes a particular domain event and that event alone
   * The type is passed as a generic
   * It takes the event maps it into the dto and calls the use Case
   */
  handle(event: EventType): Promise<void>;
}

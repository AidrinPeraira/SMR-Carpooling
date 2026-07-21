export interface IMessageConsumer {
  /**
   * This method conncects and assers queues / exchanges to the message broker
   */
  connect(): Promise<void>;

  /*
   * Starts the event listener that checks for events
   */
  consume(): Promise<void>;
}

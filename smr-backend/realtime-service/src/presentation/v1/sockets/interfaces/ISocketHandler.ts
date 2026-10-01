import { Socket } from "socket.io";

/**
 * This interface defines the methods needed for
 * handler classes that call handle presentation layer
 * DTO mapping of the payload and calls the right use
 * case based on the event.
 *
 * Each use case is called in the corresponding event listner in the register method
 */
export interface ISocketHandler {
  readonly nameSpace: string;
  register(socket: Socket): Promise<void>;
}

import { ISocketHandler } from "#/presentation/v1/sockets/interfaces/ISocketHandler";
import { ILogger } from "@sharemyride/shared";
import { Socket } from "socket.io";

/**
 * This class implements a handler for the socket events
 * for chat messaging
 */
export class ChatSocketHandler implements ISocketHandler {
  constructor(
    readonly nameSpace: string,
    private readonly _logger: ILogger,
  ) {}

  async register(socket: Socket): Promise<void> {}
}

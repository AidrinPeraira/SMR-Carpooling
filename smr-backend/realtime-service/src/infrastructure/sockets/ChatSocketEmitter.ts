import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { Server } from "socket.io";

export class ChatSocketEmitter implements ISocketEmitter {
  constructor(
    private readonly _socketServer: Server,
    private readonly _nameSpace: string,
  ) {}
}

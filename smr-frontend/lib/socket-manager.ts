import { Manager } from "socket.io-client";

let socketManager: Manager | null = null;

export function getSocketManager(): Manager {
  if (socketManager) return socketManager;

  socketManager = new Manager(process.env.NEXT_PUBLIC_BACKEND_BASE_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socketManager;
}

export function destroySocketManager() {
  if (socketManager) {
    socketManager._close();
    socketManager = null;
  }
}

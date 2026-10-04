"use client";

import { createContext, useContext } from "react";
import { Manager } from "socket.io-client";

export interface SocketIOContextValue {
  manager: Manager;
}

export const SocketIOContext = createContext<SocketIOContextValue | null>(
  null
);

export function useSocketIOManager() {
  const context = useContext(SocketIOContext);

  if (!context) {
    throw new Error(
      "SocketIO manager not found. Use hook inside SocketIOProvider."
    );
  }

  return context.manager;
}

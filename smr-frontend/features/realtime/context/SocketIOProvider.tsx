"use client";

import { SocketIOContext } from "@/features/realtime/context/SocketIOContext";
import { getSocketManager } from "@/lib/socket-manager";
import { ReactNode, useEffect, useMemo, useState } from "react";

type Props = {
  children: ReactNode;
};

export function SocketIOProvider({ children }: Props) {
  const [manager] = useState(getSocketManager);

  useEffect(() => {
    manager.open();

    return () => {
      manager._close();
    };
  }, [manager]);

  const value = useMemo(() => ({ manager }), [manager]);

  return (
    <SocketIOContext.Provider value={value}>
      {children}
    </SocketIOContext.Provider>
  );
}

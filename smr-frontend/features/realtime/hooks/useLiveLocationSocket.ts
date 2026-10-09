"use client";

import { getAccessToken } from "@/features/realtime/api/getAccessToken";
import { useSocketIOManager } from "@/features/realtime/context/SocketIOContext";
import { logger } from "@/lib/logger";
import { useEffect, useMemo } from "react";

function sendAuthToken(cb: (data: object) => void) {
  getAccessToken()
    .then((token) => cb({ token }))
    .catch(() => cb({ token: "" }));
}

export function useLiveLocationSocket() {
  const manager = useSocketIOManager();

  const journeySocket = useMemo(
    () => manager.socket("/journey", { auth: sendAuthToken }),
    [manager],
  );

  useEffect(() => {
    const onConnect = () => logger.info("Journey socket connected");
    const onDisconnect = () => logger.info("Journey socket disconnected");
    const onError = (error: Error) =>
      logger.error("Journey socket error: ", error.message ?? error);

    journeySocket.on("connect", onConnect);
    journeySocket.on("disconnect", onDisconnect);
    journeySocket.on("connect_error", onError);
    journeySocket.connect();

    return () => {
      journeySocket.off("connect", onConnect);
      journeySocket.off("disconnect", onDisconnect);
      journeySocket.off("connect_error", onError);
      journeySocket.disconnect();
    };
  }, [journeySocket]);

  return journeySocket;
}

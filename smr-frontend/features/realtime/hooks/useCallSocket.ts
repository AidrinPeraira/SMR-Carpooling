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

export function useCallSocket() {
  const manager = useSocketIOManager();

  const callSocket = useMemo(
    () => manager.socket("/call", { auth: sendAuthToken }),
    [manager],
  );

  useEffect(() => {
    const onConnect = () => logger.info("Call socket connected");
    const onDisconnect = () => logger.info("Call socket disconnected");
    const onError = (error: Error) =>
      logger.error("Call socket error: ", error.message ?? error);

    callSocket.on("connect", onConnect);
    callSocket.on("disconnect", onDisconnect);
    callSocket.on("connect_error", onError);
    callSocket.connect();

    return () => {
      callSocket.off("connect", onConnect);
      callSocket.off("disconnect", onDisconnect);
      callSocket.off("connect_error", onError);
      callSocket.disconnect();
    };
  }, [callSocket]);

  return callSocket;
}

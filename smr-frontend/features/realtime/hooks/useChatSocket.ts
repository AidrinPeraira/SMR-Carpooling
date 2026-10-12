"use client";

import { getAccessToken } from "@/features/realtime/api/getAccessToken";
import { useSocketIOManager } from "@/features/realtime/context/SocketIOContext";
import { logger } from "@/lib/logger";
import { useEffect, useMemo } from "react";

// runs on every connect/reconnect, so the socket always gets a fresh token
function sendAuthToken(cb: (data: object) => void) {
  getAccessToken()
    .then((token) => cb({ token }))
    .catch(() => cb({ token: "" }));
}

export function useChatSocket() {
  const manager = useSocketIOManager();

  const chatSocket = useMemo(
    () => manager.socket("/chat", { auth: sendAuthToken }),
    [manager],
  );

  useEffect(() => {
    const onConnect = () => logger.info("Chat socket connected");
    const onDisconnect = () => logger.info("Chat socket disconnected");
    const onError = (error: Error) =>
      logger.error("Chat socket error: ", error.message ?? error);

    chatSocket.on("connect", onConnect);
    chatSocket.on("disconnect", onDisconnect);
    chatSocket.on("connect_error", onError);
    chatSocket.connect();

    return () => {
      chatSocket.off("connect", onConnect);
      chatSocket.off("disconnect", onDisconnect);
      chatSocket.off("connect_error", onError);
      chatSocket.disconnect();
    };
  }, [chatSocket]);

  return chatSocket;
}

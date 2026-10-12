import { apiClientFetch } from "@/lib/api-client";
import {
  SyncChatMessagesRequest,
  SyncChatMessagesResponse,
} from "@sharemyride/shared";

export async function getChatHistory(
  tripId: string,
): Promise<SyncChatMessagesResponse> {
  const endpoint = "/api/v1/chat/messages";

  const body: SyncChatMessagesRequest = { trip_id: tripId };

  const response = await apiClientFetch<SyncChatMessagesResponse>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.success || !response.payload) {
    throw new Error(response.message || "Failed to fetch chat history");
  }

  return response.payload;
}

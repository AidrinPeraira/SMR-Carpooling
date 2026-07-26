import { logger } from "@/lib/logger";
import { UpdateAvatarRequest, UpdateAvatarResult } from "@sharemyride/shared";

export async function updateAvatarRequest(
  data: UpdateAvatarRequest,
): Promise<UpdateAvatarResult> {
  const response = await fetch("/api/v1/profile/avatar", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    logger.error("Failed to update user avatar", await response.json());
    throw new Error("Failed to update user avatar");
  }

  const result = await response.json();
  return result.payload as UpdateAvatarResult;
}

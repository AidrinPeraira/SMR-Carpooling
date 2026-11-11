import { logger } from "@/lib/logger";
import {
  GetAvatarUploadUrlRequest,
  GetAvatarUploadUrlResult,
} from "@sharemyride/shared";

export async function getAvatarUploadUrlRequest(
  data: GetAvatarUploadUrlRequest,
): Promise<GetAvatarUploadUrlResult> {
  const response = await fetch("/api/v1/profile/avatar/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    logger.error("Failed to get avatar upload URL", await response.json());
    throw new Error("Failed to get avatar upload URL");
  }

  const result = await response.json();
  return result.payload as GetAvatarUploadUrlResult;
}

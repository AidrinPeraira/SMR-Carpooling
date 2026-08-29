import { apiClientFetch } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { GetUserResult } from "@sharemyride/shared";

export async function getUserRequest(): Promise<GetUserResult> {
  try {
    const result = await apiClientFetch<GetUserResult>("/api/v1/profile");
    if (!result.success || !result.payload) {
      throw new Error(result.message || "Failed to fetch user data");
    }
    return result.payload;
  } catch (error) {
    logger.error("Failed to get user details", { error });
    throw error;
  }
}

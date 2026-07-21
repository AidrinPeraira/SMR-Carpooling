import { logger } from "@/lib/logger";
import { GetUserResult } from "@sharemyride/shared";

export async function getUserRequest(): Promise<GetUserResult> {
  const response = await fetch("/api/v1/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    logger.error("Failed to get user datails");
    throw new Error("Failed to fetch user data");
  }

  const result = await response.json();
  return result.payload as GetUserResult;
}

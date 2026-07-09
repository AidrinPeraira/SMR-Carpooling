"use server";

import { clearAuthCookies } from "@/lib/auth-cookies";
import { logger } from "@/lib/logger";

export async function logoutUserAction(): Promise<{ success: boolean; message: string }> {
  logger.info("Logging out user...");
  try {
    await clearAuthCookies();
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: unknown) {
    logger.error("Error clearing auth cookies: ", error);
    return {
      success: false,
      message: "Failed to clear authentication cookies",
    };
  }
}

"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, LoginResult } from "@smr/shared";
import { setAuthCookies } from "@/lib/auth-cookies";

export async function googleLoginAction(
  auth_token: string,
): Promise<ActionResponse<LoginResult>> {
  logger.info("Logging in user via Google");

  try {
    const response = await apiServerFetch("/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ auth_token }),
    });

    const result = (await response.json()) as ApiResponse<LoginResult>;

    if (!response.ok) {
      const failureDetails = !result.success
        ? result.message
        : "Internal error";
      logger.error("Google login request failed: ", result);
      return {
        success: false,
        errorMessage: "Google login request failed!",
        description: failureDetails,
      };
    }

    if (result.success && result.payload) {
      const { access_token, refresh_token } = result.payload;
      await setAuthCookies(access_token, refresh_token);

      return {
        success: true,
        message: "Google login success!",
        description: result.message,
        payload: result.payload,
      };
    } else {
      return {
        success: false,
        errorMessage: "Google login request failed",
        description: "Please try again later",
      };
    }
  } catch (error: unknown) {
    logger.error("Google login action error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later",
    };
  }
}

"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, LoginResult, VerifyEmailRequest } from "@smr/shared";
import { setAuthCookies } from "@/lib/auth-cookies";

export async function VerifySignupEmailAction(
  data: VerifyEmailRequest,
): Promise<ActionResponse> {
  logger.info("Signup email verification action called");

  try {
    const response = await apiServerFetch("/api/v1/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as ApiResponse<LoginResult>;

    if (!response.ok) {
      const failureDetails = !result.success
        ? result.message
        : "Internal error";

      logger.error("Verify signup email action failed.", result);
      return {
        success: false,
        errorMessage: "Verify signup email failed",
        description: failureDetails,
      };
    }

    if (!result.success) {
      return {
        success: false,
        errorMessage: "Verify email request failed",
        description: result.message,
      };
    }

    if (!result.payload) {
      return {
        success: false,
        errorMessage: "Email verified. Auto login failed.",
        description: "Please try loggin in",
      };
    }

    const { access_token, refresh_token } = result.payload;
    await setAuthCookies(access_token, refresh_token);

    return {
      success: true,
      message: result.message,
      payload: result.payload,
    };
  } catch (error: unknown) {
    logger.error("Verify signup email action error: ", error);
    return {
      success: false,
      errorMessage: "Internal action error.",
      description: "Please try again later",
    };
  }
}

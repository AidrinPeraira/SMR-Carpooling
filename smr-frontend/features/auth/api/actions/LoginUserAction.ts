"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, LoginRequest, LoginResult } from "@sharemyride/shared";
import { setAuthCookies } from "@/lib/auth-cookies";

export async function loginUserAction(
  data: LoginRequest,
): Promise<ActionResponse<LoginResult>> {
  logger.info("Logging in user: ", {
    email_id: data.email_id,
  });

  try {
    const response = await apiServerFetch("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as ApiResponse<LoginResult>;

    if (!response.ok) {
      const failureDetails = !result.success
        ? result.message
        : "Internal error";
      logger.error("Login request failed: ", result);
      return {
        success: false,
        errorMessage: "User login request failed!",
        description: failureDetails,
      };
    }

    if (result.success && result.payload) {
      const { access_token, refresh_token } = result.payload;
      await setAuthCookies(access_token, refresh_token);

      return {
        success: true,
        message: "User login success!",
        description: result.message,
        payload: result.payload,
      };
    } else {
      //fallback
      return {
        success: false,
        errorMessage: "Login request failed",
        description: "Please try again later",
      };
    }
  } catch (error: unknown) {
    logger.error("Login action error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later",
    };
  }
}

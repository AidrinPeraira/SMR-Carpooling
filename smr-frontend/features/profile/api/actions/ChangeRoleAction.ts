"use server";

import { apiServerFetch } from "@/lib/api-server";
import { setAuthCookies } from "@/lib/auth-cookies";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, LoginResult } from "@sharemyride/shared";

export async function changeRoleAction(): Promise<ActionResponse<LoginResult>> {
  logger.info("Requesting user role switch");

  try {
    const response = await apiServerFetch("/api/v1/profile/role", {
      method: "PATCH",
    });

    const result = (await response.json()) as ApiResponse<LoginResult>;

    if (!response.ok) {
      const failureDetails = !result.success
        ? result.message
        : "Internal error";
      logger.error("Role switch request failed: ", result);
      return {
        success: false,
        errorMessage: "Role switch request failed!",
        description: failureDetails,
      };
    }

    if (result.success && result.payload) {
      const { access_token, refresh_token } = result.payload;
      await setAuthCookies(access_token, refresh_token);

      return {
        success: true,
        message: "User role updated successfully!",
        description: result.message,
        payload: result.payload,
      };
    } else {
      return {
        success: false,
        errorMessage: "Role switch request failed",
        description: "Please try again later",
      };
    }
  } catch (error: unknown) {
    logger.error("Role switch action error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later",
    };
  }
}

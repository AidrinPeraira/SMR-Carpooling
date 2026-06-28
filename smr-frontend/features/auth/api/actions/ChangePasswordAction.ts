"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, ChangePasswordRequest } from "@smr/shared";

export async function changePasswordAction(
  data: ChangePasswordRequest,
): Promise<ActionResponse> {
  try {
    const response = await apiServerFetch("/api/v1/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as ApiResponse;

    if (!response.ok) {
      const failureDetails = !result.success
        ? result.message
        : "Internal error";
      logger.error("Password change request failed: ", result);
      return {
        success: false,
        errorMessage: "Password change request failed!",
        description: failureDetails,
      };
    }

    if (result.success) {
      return {
        success: true,
        message: "Password updated succesfully.",
        description: result.message,
      };
    } else {
      //fallback
      return {
        success: false,
        errorMessage: " Change password failed",
        description: "Please try again later",
      };
    }
  } catch (error: unknown) {
    logger.error("Change password action error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later",
    };
  }
}

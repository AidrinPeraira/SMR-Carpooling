"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, GetUserResult, UpdateUserRequest } from "@smr/shared";

export async function updateUserAction(
  data: UpdateUserRequest,
): Promise<ActionResponse<GetUserResult>> {
  logger.info("Updating the user: ", {
    email_id: data.user_id,
  });

  try {
    const response = await apiServerFetch("/api/v1/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    const result = (await response.json()) as ApiResponse<GetUserResult>;

    if (!response.ok) {
      const failureDetails = !result.success
        ? result.message
        : "Internal error";
      logger.error("Update user request failed: ", result);
      return {
        success: false,
        errorMessage: "Update user request failed!",
        description: failureDetails,
      };
    }

    if (result.success && result.payload) {
      return {
        success: true,
        message: "User update success!",
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
    logger.error("Update user action error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later",
    };
  }
}

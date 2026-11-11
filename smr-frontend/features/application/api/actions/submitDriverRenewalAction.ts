"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, RenewDriverApplicationRequest } from "@sharemyride/shared";

export async function submitDriverRenewalAction(
  data: RenewDriverApplicationRequest,
): Promise<ActionResponse<void>> {
  logger.info("Submitting driver renewal action...", {
    license_number: data.license_number,
  });

  try {
    const response = await apiServerFetch("/api/v1/applications/renew/driver", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as ApiResponse<void>;

    if (!response.ok) {
      const failureDetails = !result.success
        ? result.message
        : "Failed to submit driver renewal application.";
      logger.error("Driver renewal action failed: ", result);
      return {
        success: false,
        errorMessage: "Application submission failed!",
        description: failureDetails,
      };
    }

    if (result.success) {
      return {
        success: true,
        message: "Driver Renewal Submitted!",
        description: result.message || "Your driver renewal application has been submitted successfully.",
      };
    } else {
      return {
        success: false,
        errorMessage: "Application submission failed",
        description: "Please try again later",
      };
    }
  } catch (error: unknown) {
    logger.error("Driver renewal action error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later",
    };
  }
}

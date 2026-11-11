"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, RenewVehicleApplicationRequest } from "@sharemyride/shared";

export async function submitVehicleRenewalAction(
  data: RenewVehicleApplicationRequest,
): Promise<ActionResponse<void>> {
  logger.info("Submitting vehicle renewal action...", {
    registration_number: data.registration_number,
    insurance_number: data.insurance_number,
  });

  try {
    const response = await apiServerFetch("/api/v1/applications/renew/vehicle", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as ApiResponse<void>;

    if (!response.ok) {
      const failureDetails = !result.success
        ? result.message
        : "Failed to submit vehicle renewal application.";
      logger.error("Vehicle renewal action failed: ", result);
      return {
        success: false,
        errorMessage: "Application submission failed!",
        description: failureDetails,
      };
    }

    if (result.success) {
      return {
        success: true,
        message: "Vehicle Renewal Submitted!",
        description: result.message || "Your vehicle renewal application has been submitted successfully.",
      };
    } else {
      return {
        success: false,
        errorMessage: "Application submission failed",
        description: "Please try again later",
      };
    }
  } catch (error: unknown) {
    logger.error("Vehicle renewal action error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later",
    };
  }
}

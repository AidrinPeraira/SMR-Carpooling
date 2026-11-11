"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, NewVehicleApplicationRequest } from "@sharemyride/shared";

export async function submitNewVehicleApplicationAction(
  data: NewVehicleApplicationRequest,
): Promise<ActionResponse<void>> {
  logger.info("Submitting new vehicle application action...", {
    vehicle_make: data.vehicle_make,
    vehicle_model: data.vehicle_model,
    registration_number: data.registration_number,
  });

  try {
    const response = await apiServerFetch("/api/v1/applications/vehicle", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as ApiResponse<void>;

    if (!response.ok) {
      const failureDetails = !result.success
        ? result.message
        : "Failed to submit new vehicle application.";
      logger.error("New vehicle application action failed: ", result);
      return {
        success: false,
        errorMessage: "Application submission failed!",
        description: failureDetails,
      };
    }

    if (result.success) {
      return {
        success: true,
        message: "New Vehicle Application Submitted!",
        description: result.message || "Your vehicle application has been submitted successfully.",
      };
    } else {
      return {
        success: false,
        errorMessage: "Application submission failed",
        description: "Please try again later",
      };
    }
  } catch (error: unknown) {
    logger.error("New vehicle application action error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later",
    };
  }
}

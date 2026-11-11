"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, ResubmitNewVehicleApplicationRequest } from "@sharemyride/shared";

export async function resubmitNewVehicleApplicationAction(
  applicationId: string,
  data: ResubmitNewVehicleApplicationRequest,
): Promise<ActionResponse<void>> {
  logger.info("Resubmitting vehicle application action...", {
    applicationId,
  });

  try {
    const response = await apiServerFetch(
      `/api/v1/applications/resubmit/vehicle/${applicationId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );

    const result = (await response.json()) as ApiResponse<void>;

    if (!response.ok || !result.success) {
      const failureDetails = result?.message || "Failed to resubmit vehicle application.";
      logger.error("Resubmit vehicle application failed: ", result);
      return {
        success: false,
        errorMessage: "Resubmission failed!",
        description: failureDetails,
      };
    }

    return {
      success: true,
      message: "Vehicle Application Resubmitted!",
      description: result.message || "Your vehicle application has been resubmitted for admin review.",
    };
  } catch (error: unknown) {
    logger.error("Resubmit vehicle application error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later.",
    };
  }
}

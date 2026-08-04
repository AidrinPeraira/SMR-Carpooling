"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, ResubmitRenewVehicleApplicationRequest } from "@sharemyride/shared";

export async function resubmitVehicleRenewalAction(
  applicationId: string,
  data: ResubmitRenewVehicleApplicationRequest,
): Promise<ActionResponse<void>> {
  logger.info("Resubmitting vehicle renewal application action...", {
    applicationId,
  });

  try {
    const response = await apiServerFetch(
      `/api/v1/applications/resubmit/renew/vehicle/${applicationId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );

    const result = (await response.json()) as ApiResponse<void>;

    if (!response.ok || !result.success) {
      const failureDetails = result?.message || "Failed to resubmit vehicle renewal application.";
      logger.error("Resubmit vehicle renewal failed: ", result);
      return {
        success: false,
        errorMessage: "Resubmission failed!",
        description: failureDetails,
      };
    }

    return {
      success: true,
      message: "Vehicle Renewal Resubmitted!",
      description: result.message || "Your vehicle renewal has been resubmitted for admin review.",
    };
  } catch (error: unknown) {
    logger.error("Resubmit vehicle renewal error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later.",
    };
  }
}

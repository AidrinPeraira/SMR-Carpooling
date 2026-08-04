"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, ResubmitRenewDriverApplicationRequest } from "@sharemyride/shared";

export async function resubmitDriverRenewalAction(
  applicationId: string,
  data: ResubmitRenewDriverApplicationRequest,
): Promise<ActionResponse<void>> {
  logger.info("Resubmitting driver renewal application action...", {
    applicationId,
  });

  try {
    const response = await apiServerFetch(
      `/api/v1/applications/resubmit/renew/driver/${applicationId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );

    const result = (await response.json()) as ApiResponse<void>;

    if (!response.ok || !result.success) {
      const failureDetails = result?.message || "Failed to resubmit driver renewal application.";
      logger.error("Resubmit driver renewal failed: ", result);
      return {
        success: false,
        errorMessage: "Resubmission failed!",
        description: failureDetails,
      };
    }

    return {
      success: true,
      message: "Driver Renewal Resubmitted!",
      description: result.message || "Your driver renewal has been resubmitted for admin review.",
    };
  } catch (error: unknown) {
    logger.error("Resubmit driver renewal error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later.",
    };
  }
}

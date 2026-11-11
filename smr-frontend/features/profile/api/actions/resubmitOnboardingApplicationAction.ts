"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, ResubmitOnboardingApplicationRequest } from "@sharemyride/shared";

export async function resubmitOnboardingApplicationAction(
  applicationId: string,
  data: ResubmitOnboardingApplicationRequest,
): Promise<ActionResponse<void>> {
  logger.info("Resubmitting onboarding application action...", {
    applicationId,
  });

  try {
    const response = await apiServerFetch(
      `/api/v1/applications/resubmit/onboarding/${applicationId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );

    const result = (await response.json()) as ApiResponse<void>;

    if (!response.ok || !result.success) {
      const failureDetails = result?.message || "Failed to resubmit onboarding application.";
      logger.error("Resubmit onboarding application failed: ", result);
      return {
        success: false,
        errorMessage: "Resubmission failed!",
        description: failureDetails,
      };
    }

    return {
      success: true,
      message: "Onboarding Application Resubmitted!",
      description: result.message || "Your application has been resubmitted for admin review.",
    };
  } catch (error: unknown) {
    logger.error("Resubmit onboarding application error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later.",
    };
  }
}

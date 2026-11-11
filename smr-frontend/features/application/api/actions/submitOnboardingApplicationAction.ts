"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, OnboardingApplicationRequest } from "@sharemyride/shared";

export async function submitOnboardingApplicationAction(
  data: OnboardingApplicationRequest,
): Promise<ActionResponse<void>> {
  logger.info("Submitting onboarding application action...", {
    license_number: data.license_number,
    registration_number: data.registration_number,
  });

  try {
    const response = await apiServerFetch("/api/v1/applications/onboarding", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as ApiResponse<void>;

    if (!response.ok) {
      const failureDetails = !result.success
        ? result.message
        : "Failed to submit onboarding application.";
      logger.error("Onboarding application action failed: ", result);
      return {
        success: false,
        errorMessage: "Application submission failed!",
        description: failureDetails,
      };
    }

    if (result.success) {
      return {
        success: true,
        message: "Onboarding Application Submitted!",
        description: result.message || "Your driver and vehicle onboarding application has been submitted successfully.",
      };
    } else {
      return {
        success: false,
        errorMessage: "Application submission failed",
        description: "Please try again later",
      };
    }
  } catch (error: unknown) {
    logger.error("Onboarding application action error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later",
    };
  }
}

"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import { ApiResponse, ApplicationStatus } from "@sharemyride/shared";

export interface ProcessApplicationInput {
  application_id: string;
  application_status: ApplicationStatus;
  comment: string;
}

export async function processApplicationAction(
  data: ProcessApplicationInput,
): Promise<ActionResponse<void>> {
  logger.info("Processing application action...", {
    application_id: data.application_id,
    application_status: data.application_status,
  });

  try {
    const response = await apiServerFetch("/api/v1/admin/applications/process", {
      method: "POST",
      body: JSON.stringify({
        application_id: data.application_id,
        application_status: data.application_status,
        admin_comment: {
          comment: data.comment,
        },
      }),
    });

    const result = (await response.json()) as ApiResponse<void>;

    if (!response.ok || !result.success) {
      const failureDetails = result?.message || "Failed to process application.";
      logger.error("Process application action failed: ", result);
      return {
        success: false,
        errorMessage: "Failed to process application!",
        description: failureDetails,
      };
    }

    return {
      success: true,
      message: `Application ${data.application_status} successfully!`,
      description: result.message || `Application status updated to ${data.application_status}.`,
    };
  } catch (error: unknown) {
    logger.error("Process application action error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later.",
    };
  }
}

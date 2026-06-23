"use server";

import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { ActionResponse } from "@/types/ResponseType";
import {
  ApiResponse,
  LoginResult,
  SignUpResult,
  SignUpUserSchemaType,
} from "@smr/shared";

export async function signupUserAction(
  data: SignUpUserSchemaType,
): Promise<ActionResponse<LoginResult>> {
  logger.info("Signing up user: ", {
    email_id: data.email_id,
    first_name: data.first_name,
    last_name: data.last_name,
  });

  try {
    const response = await apiServerFetch("/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as ApiResponse<SignUpResult>;

    if (!response.ok) {
      const failureDetails = !result.success
        ? result.message
        : "Internal error";
      logger.error("Signup action failed: ", result);
      return {
        success: false,
        errorMessage: "User signup failed!",
        description: failureDetails,
      };
    }

    if (result.success) {
      return {
        success: true,
        message: "User signup success!",
        description: result.message,
      };
    } else {
      //fallback
      return {
        success: false,
        errorMessage: "Signup request failed",
        description: "Please try again later",
      };
    }
  } catch (error: unknown) {
    logger.error("Signup action error: ", error);
    return {
      success: false,
      errorMessage: "Something went wrong.",
      description: "Please try again later",
    };
  }
}

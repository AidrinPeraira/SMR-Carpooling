import { logger } from "@/lib/logger";
import { ApiResponse } from "@sharemyride/shared";

/**
 * This function is a fetch request wrapper for client side use.
 * It is used to make fetch requests s to the next js route.ts file proxy
 * It is used for requests origniation from the client side.
 */
export async function apiClientFetch<PayloadType = unknown>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<PayloadType>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to make client side request";
      try {
        const failedResponse = await response.json();
        errorMessage =
          failedResponse.message ||
          failedResponse.error?.message ||
          (typeof failedResponse.error === "string"
            ? failedResponse.error
            : "") ||
          response.statusText ||
          errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      // handle failed request
      throw new Error(errorMessage, {
        cause: {
          url: url,
          method: options?.method,
          message: "API request failed",
        },
      });
    }

    const result = (await response.json()) as ApiResponse<PayloadType>;

    return result;
  } catch (error: unknown) {
    logger.info("Error making client side fetch: ", { url: url, error: error });
    throw error;
  }
}

import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@sharemyride/shared";
import { cookies } from "next/headers";

/**
 * helper function to refresh tokens
 */
async function getNewTokens(
  refreshToken: string,
): Promise<{ access_token: string; refresh_token: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    },
  );

  if (!response.ok) {
    throw new Error("Token refresh request failed");
  }

  const result = (await response.json()) as ApiResponse<{
    access_token: string;
    refresh_token: string;
  }>;

  if (!result.success || !result.payload) {
    throw new Error(result.message || "Failed to refresh token payload");
  }

  return result.payload;
}

/**
 * This is the reusable wrapperr for a native next js fetch request
 * It handles refresh logic
 *  - during refresh setting cookies might throw error in fully server side components
 *  - so we have try catch wrappper for set and clear cookies
 */
export async function apiServerFetch(
  urlPath: string,
  options?: RequestInit,
): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    "x-frontend-key": String(process.env.FRONTEND_KEY || ""),
    ...options?.headers,
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${urlPath}`;
  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 && refreshToken) {
    logger.info("Access token expired (401), attempting to refresh token...");
    try {
      const tokens = await getNewTokens(refreshToken);

      try {
        await setAuthCookies(tokens.access_token, tokens.refresh_token);
      } catch (cookieError) {
        console.warn(
          "apiServerFetch: Failed to set cookies (expected in Server Components)",
          cookieError,
        );
      }

      //retry request and return response
      const retryHeaders: HeadersInit = {
        ...headers,
        Authorization: `Bearer ${tokens.access_token}`,
      };

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });
    } catch (refreshError) {
      logger.error(
        "apiServerFetch: Silent refresh failed. Logging out user.",
        refreshError,
      );

      //clear auth cookies on refresh falure
      try {
        await clearAuthCookies();
      } catch (cookieError) {
        console.warn("apiServerFetch: Failed to clear cookies", cookieError);
      }
    }
  }

  return response;
}

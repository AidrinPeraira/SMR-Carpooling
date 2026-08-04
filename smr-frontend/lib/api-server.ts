import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@sharemyride/shared";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
        "x-frontend-key": String(process.env.FRONTEND_KEY || ""),
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
 *  - if such a case happens we redirect to "/" with error in query param and let proxy.ts handle clearing the cookies
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

  if (response.status === 403) {
    //user is user is forbiden
    try {
      await clearAuthCookies();
    } catch (error: unknown) {
      //clear cookies might fail in server componetns
      //redirect instead and let middleware / proxy.ts handle clearign cookies
      console.warn(
        "api-server: Failed to clear cookies. Redirecting to force clear from middleware.",
        error,
      );
      redirect("/?error=user_forbidden");
    }
  }

  if (response.status === 401 && refreshToken) {
    logger.info("Access token expired (401), attempting to refresh token...");
    try {
      const tokens = await getNewTokens(refreshToken);

      try {
        await setAuthCookies(tokens.access_token, tokens.refresh_token);
      } catch (cookieError) {
        //this might hit if the request came from a server comoponent
        //just ignore it. another valid request will refresh the cookie again.
        console.warn(
          "api-server: Failed to set new tokens in cookies.",
          cookieError,
        );
      }

      //retry orgiginal request and return response
      const retryHeaders: HeadersInit = {
        ...headers,
        Authorization: `Bearer ${tokens.access_token}`,
      };

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });
    } catch (refreshError) {
      //refresh attempt fails
      //the helper throws an error
      logger.error("api-server: Token refresh failed", refreshError);

      //clear auth cookies on refresh falure
      try {
        await clearAuthCookies();
      } catch (cookieError) {
        console.warn("apiServerFetch: Failed to clear cookies", cookieError);
        //in case the clear cookies fail we send a redirect request
        redirect("/?error=user_forbidden");
      }
    }
  }

  return response;
}

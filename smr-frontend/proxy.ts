import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export interface TokenRefreshResult {
  refresh_token: string;
  access_token: string;
}

/**
 * Helper function to handle refresh request
 */
async function getNewTokens(token: string): Promise<TokenRefreshResult> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-frontend-key": String(process.env.FRONTEND_KEY || ""),
        },
        body: JSON.stringify({ refresh_token: token }),
      },
    );

    if (!response.ok) {
      throw new Error("Token refrsh requst failed");
    }

    const { refresh_token, access_token } = (await response.json())
      .payload as TokenRefreshResult;

    return {
      access_token,
      refresh_token,
    };
  } catch (error: unknown) {
    console.log("Error getting new tokens: ", error);
    throw error;
  }
}

/**
 * Helper function to set new tokens in cookies
 */
function setCookiesInResponse(
  response: NextResponse,
  access_token: string,
  refresh_token: string,
) {
  const accessTokenMaxAge = parseInt(
    process.env.ACCESS_TOKEN_LIFE_SECONDS || "900",
    10,
  );
  const refreshTokenMaxAge = parseInt(
    process.env.REFRESH_TOKEN_LIFE_SECONDS || "172800",
    10,
  );
  response.cookies.set("access_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: accessTokenMaxAge,
  });

  response.cookies.set("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: refreshTokenMaxAge,
  });
}

export default async function proxy(request: NextRequest) {
  return NextResponse.next();

  const path = request.nextUrl.pathname;
  console.log("Next middleware running on path: ", path);

  /**
   * when server componets get a forbidden request or fails token refresh
   * the redirect to "/" with a "user_forbidden" error in query pram
   * This conditional block catches it and clears cookies and redirects to shoe the toast
   * to the user.
   *
   * This is needed because server components can't handle cookie changes
   */
  const errorParam = request.nextUrl.searchParams.get("error");
  if (errorParam == "user_forbidden") {
    const response = NextResponse.redirect(
      new URL("/?error=You'r account has been blocked.", request.url),
    );
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  let accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  //lets add the cases to check routes here
  const isPublicRoute = path === "/" || path.startsWith("/auth/");
  const isDriverRoute =
    path.startsWith("/driver") ||
    path.startsWith("/profile") ||
    path.startsWith("/application");
  const isPassengerRoute =
    path.startsWith("/passenger") ||
    path.startsWith("/profile") ||
    path.startsWith("/application");
  const isAdminRoute = path.startsWith("/admin");

  let isRefreshed = false;
  let newRefreshToken = "";
  let newAccessToken = "";

  try {
    //refresh if there is no access token
    if (!accessToken && refreshToken) {
      const tokens = await getNewTokens(refreshToken);
      isRefreshed = true;
      newRefreshToken = tokens.refresh_token;
      newAccessToken = tokens.access_token;
      accessToken = tokens.access_token;

      request.cookies.set("access_token", newAccessToken);
      request.cookies.set("refresh_token", newRefreshToken);
    }

    //no access token and no refresh token
    //not logged in user
    if (!accessToken) {
      if (!isPublicRoute) {
        return NextResponse.redirect(
          new URL("/?error=Please login to continue!", request.url),
        );
      }

      const response = NextResponse.next();
      if (isRefreshed)
        setCookiesInResponse(response, newAccessToken, newRefreshToken);

      return response;
    }

    //for logged in user
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    const { payload } = await jwtVerify(accessToken, secret);

    //next js docs asks not to import globals so we redefine shape here
    const user = payload.user as
      | {
          userId: string;
          userRole: string;
          firstName: string;
          lastName: string;
          emailId: string;
        }
      | undefined;

    const role = user?.userRole;

    if (role === "admin" && !isAdminRoute) {
      const response = NextResponse.redirect(
        new URL("/admin?error=Not authorised", request.url),
      );
      if (isRefreshed)
        setCookiesInResponse(response, newAccessToken, newRefreshToken);

      return response;
    }

    if (role === "passenger" && !isPassengerRoute) {
      const response = NextResponse.redirect(
        new URL("/passenger?error=Not authorised", request.url),
      );
      if (isRefreshed)
        setCookiesInResponse(response, newAccessToken, newRefreshToken);

      return response;
    }

    if (role === "driver" && !isDriverRoute) {
      const response = NextResponse.redirect(
        new URL("/driver?error=Not authorised", request.url),
      );
      if (isRefreshed)
        setCookiesInResponse(response, newAccessToken, newRefreshToken);

      return response;
    }
  } catch (error: unknown) {
    console.error("Token verification failed in middleware:", error);

    // Redirect unauthenticated user to landing page and clear stale cookies
    if (!isPublicRoute) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  const response = NextResponse.next();
  if (isRefreshed)
    setCookiesInResponse(response, newAccessToken, newRefreshToken);

  return response;
}

export const config = {
  matcher: [
    // Match all routes except API, static files, image optimizations, and asset formats
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$).*)",
  ],
};

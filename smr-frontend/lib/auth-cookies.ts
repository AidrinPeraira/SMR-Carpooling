import { cookies } from "next/headers";

const ACCESS_TOKEN_NAME = "access_token";
const REFRESH_TOKEN_NAME = "refresh_token";

/**
 * This is a reusable function to set refresh tokens in auth cookies
 * It will work in any route.ts file and any server action
 *
 * @param accessToken : string for new access token
 * @param refreshToken : string for new refresh token
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies();

  const accessTokenMaxAge = parseInt(
    process.env.ACCESS_TOKEN_LIFE_SECONDS || "900",
    10,
  );
  const refreshTokenMaxAge = parseInt(
    process.env.REFRESH_TOKEN_LIFE_SECONDS || "172800",
    10,
  );

  cookieStore.set(ACCESS_TOKEN_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: accessTokenMaxAge,
  });

  cookieStore.set(REFRESH_TOKEN_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: refreshTokenMaxAge,
  });
}

/**
 * This is a reusable function to clear auth tokens
 * this works in any route.ts file or server actions
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_NAME);
  cookieStore.delete(REFRESH_TOKEN_NAME);
}

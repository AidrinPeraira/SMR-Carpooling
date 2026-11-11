import { getNewTokens } from "@/lib/api-server";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies";
import { logger } from "@/lib/logger";
import { HttpStatusCodes } from "@sharemyride/shared";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// refresh slightly early so the token can't expire mid socket handshake
const EXPIRY_BUFFER_MS = 30_000;

function isExpiringSoon(token: string) {
  try {
    const { exp } = decodeJwt(token);
    return !exp || exp * 1000 - Date.now() < EXPIRY_BUFFER_MS;
  } catch {
    return true;
  }
}

function tokenResponse(token: string) {
  return NextResponse.json({
    success: true,
    message: "Access token fetched successfully",
    payload: { token },
  });
}

function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "No token found. Login to Continue" },
    { status: HttpStatusCodes.Unauthorized },
  );
}

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (accessToken && !isExpiringSoon(accessToken)) {
    return tokenResponse(accessToken);
  }

  if (!refreshToken) {
    return unauthorizedResponse();
  }

  try {
    const tokens = await getNewTokens(refreshToken);
    await setAuthCookies(tokens.access_token, tokens.refresh_token);
    return tokenResponse(tokens.access_token);
  } catch (error) {
    logger.error("api/token: Token refresh failed", error);
    await clearAuthCookies();
    return unauthorizedResponse();
  }
}

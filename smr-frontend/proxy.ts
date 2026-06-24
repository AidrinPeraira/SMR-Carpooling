import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log("Next middleware running on path: ", path);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  //lets add the cases to check routes here
  const isPublicRoute = path === "/" || path.startsWith("/auth/");
  const isDriverRoute =
    path.startsWith("/driver") || path.startsWith("/profile");
  const isPassengerRoute =
    path.startsWith("/passenger") || path.startsWith("/profile");
  const isAdminRoute = path.startsWith("/admin");

  //not logged in user
  if (!accessToken) {
    if (!isPublicRoute) {
      return NextResponse.redirect(
        new URL("/?error=Please login to continue!", request.url),
      );
    }
    return NextResponse.next();
  }

  //for logged in user
  try {
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
      return NextResponse.redirect(
        new URL("/passenger?error=Not authorised", request.url),
      );
    }

    if (role === "passenger" && !isPassengerRoute) {
      return NextResponse.redirect(
        new URL("/passenger?error=Not authorised", request.url),
      );
    }

    if (role === "driver" && !isDriverRoute) {
      return NextResponse.redirect(
        new URL("/driver?error=Not authorised", request.url),
      );
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except API, static files, image optimizations, and asset formats
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$).*)",
  ],
};

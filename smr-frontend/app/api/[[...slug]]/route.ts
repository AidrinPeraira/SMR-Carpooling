import { apiServerFetch } from "@/lib/api-server";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ slug?: string[] }>;
};

/**
 * Function that handles proxying result from backend
 */
async function handleProxy(request: NextRequest, ctx: RouteContext) {
  const { slug } = await ctx.params;
  const path = slug ? `/api/${slug.join("/")}` : "/api";
  const searchParams = request.nextUrl.search;
  const fullPath = `${path}${searchParams}`;

  //copy over original headers
  //else we lose fields like user device, language pref etc
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!["host", "content-length", "connection"].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const method = request.method;
  const hasBody = !["GET", "HEAD"].includes(method);

  //to resove body being consumed error
  let body: ArrayBuffer | undefined = undefined;
  if (hasBody) {
    try {
      body = await request.arrayBuffer();
    } catch (e) {
      logger.warn("API Proxy: Failed to read request body as ArrayBuffer:", e);
    }
  }

  //make the request
  try {
    const response = await apiServerFetch(fullPath, {
      method,
      headers,
      body,
    });

    const responseBody = await response.text();

    //copy headers for response also
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      //some headers are set by next. ignore those
      if (
        !["content-encoding", "transfer-encoding"].includes(key.toLowerCase())
      ) {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    logger.error("API proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 502 },
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;

import { createGoogle } from "@ai-sdk/google";
import { createMCPClient, MCPClient } from "@ai-sdk/mcp";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  UIMessage,
} from "ai";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies";
import { getNewTokens } from "@/lib/api-server";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { RIDE_ASSISTANT_INSTRUCTIONS } from "@/lib/ai-instructions";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const google = createGoogle({
  apiKey: process.env.GEMINI_API_KEY,
});

let cachedMapboxClient: MCPClient | null = null;

async function getMapboxClient(): Promise<MCPClient> {
  if (!cachedMapboxClient) {
    cachedMapboxClient = await createMCPClient({
      transport: {
        type: "http",
        url: process.env.MAPBOX_MCP_URL || "",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
        },
      },
    });
  }
  return cachedMapboxClient;
}

const smrClientCache = new Map<string, MCPClient>();

async function getSmrClient(
  accessToken: string,
  userRole: string,
): Promise<MCPClient> {
  const key = `${userRole}:${accessToken}`;
  let client = smrClientCache.get(key);
  if (!client) {
    // Evict stale entries for this role when the token rotates
    for (const k of smrClientCache.keys()) {
      if (k.startsWith(`${userRole}:`)) smrClientCache.delete(k);
    }
    client = await createMCPClient({
      transport: {
        type: "http",
        url:
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mcp/${userRole}` || "",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-frontend-key": String(process.env.FRONTEND_KEY || ""),
        },
      },
    });
    smrClientCache.set(key, client);
  }
  return client;
}

async function getValidatedToken(): Promise<{
  accessToken: string;
  userRole: string;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    throw new Error("unauthenticated");
  }

  const token = accessToken;

  if (token) {
    const payload = decodeJwt(token);
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp > now) {
      const user = payload.user as { userRole: string } | undefined;
      if (!user?.userRole) throw new Error("unauthenticated");
      return { accessToken: token, userRole: user.userRole };
    }
  }

  if (!refreshToken) throw new Error("unauthenticated");

  try {
    const tokens = await getNewTokens(refreshToken);
    await setAuthCookies(tokens.access_token, tokens.refresh_token);

    const payload = decodeJwt(tokens.access_token);
    const user = payload.user as { userRole: string } | undefined;
    if (!user?.userRole) throw new Error("unauthenticated");

    return { accessToken: tokens.access_token, userRole: user.userRole };
  } catch {
    await clearAuthCookies();
    throw new Error("unauthenticated");
  }
}

export async function POST(req: Request) {
  let accessToken: string;
  let userRole: string;

  try {
    ({ accessToken, userRole } = await getValidatedToken());
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }

  logger.info("[assistant] auth OK", { userRole });

  logger.info("[assistant] env check", {
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasMapboxUrl: !!process.env.MAPBOX_MCP_URL,
    hasMapboxToken: !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    hasBackendUrl: !!process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    hasFrontendKey: !!process.env.FRONTEND_KEY,
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    mapboxUrl: process.env.MAPBOX_MCP_URL,
  });

  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    logger.info("[assistant] creating MCP clients...");

    let smrMcpClient: MCPClient;
    let mapBoxMcpClient: MCPClient;

    try {
      smrMcpClient = await getSmrClient(accessToken, userRole);
      logger.info("[assistant] SMR MCP client connected");
    } catch (error) {
      logger.error("[assistant] SMR MCP client FAILED", {
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }

    try {
      mapBoxMcpClient = await getMapboxClient();
      logger.info("[assistant] Mapbox MCP client connected");
    } catch (error) {
      logger.error("[assistant] Mapbox MCP client FAILED", {
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }

    logger.info("[assistant] fetching tools...");

    const [smrTools, mapboxTools] = await Promise.all([
      smrMcpClient.tools(),
      mapBoxMcpClient.tools(),
    ]);

    logger.info("[assistant] tools loaded", {
      smrToolCount: Object.keys(smrTools).length,
      mapboxToolCount: Object.keys(mapboxTools).length,
    });

    const result = streamText({
      model: google("gemini-3.5-flash-lite"),
      instructions: RIDE_ASSISTANT_INSTRUCTIONS
        .replace("{role}", userRole)
        .replace(
          "{datetime}",
          new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "full",
            timeStyle: "long",
          }),
        ),
      tools: {
        ...mapboxTools,
        ...smrTools,
      },
      messages: await convertToModelMessages(messages),
      stopWhen: isStepCount(5),
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    logger.error("[assistant] FINAL ERROR", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

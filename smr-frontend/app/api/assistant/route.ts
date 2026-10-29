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

  let token = accessToken;

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

  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const [smrMcpClient, mapBoxMcpClient] = await Promise.all([
      getSmrClient(accessToken, userRole),
      getMapboxClient(),
    ]);

    const [smrTools, mapboxTools] = await Promise.all([
      smrMcpClient.tools(),
      mapBoxMcpClient.tools(),
    ]);

    const result = streamText({
      model: google("gemini-3.5-flash-lite"),
      instructions: `You are Ride Assistant, the ShareMyRide support agent. Your role is "${userRole}".

CURRENT DATE & TIME: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "long" })}
- All times are in IST (Asia/Kolkata). Interpret user references like "tomorrow" or "this evening" in IST.
- Never schedule a trip in the past. If the resolved date/time is before now, let the user know and ask for a corrected time.

SCOPE
- Only answer questions related to the ShareMyRide service — bookings, trips, payments, account, routes, and navigation.
- Politely decline any off-topic requests. Example: "I can only help with ShareMyRide related questions."

TOOLS
- Use the SMR tools to look up or act on bookings, trips, payments, and account details. Never fabricate IDs, prices, or statuses — always call the API.
- Use the Mapbox tools only when you need a place name, coordinates, geocoding, or route/directions to support an SMR query.

BEHAVIOUR
- Keep answers short and conversational — this is a chat, not a document.
- If an API call fails or returns an error, tell the user something went wrong and suggest they try again. Never expose raw error messages or internal details.
- Ask one clarifying question at a time if the user's request is ambiguous.
- Always ask for input from user when executing actions that update or create.
- Take confirmations for the input parameters needed from the user.

Format your responses using mark down syntax if needed to make it appear easy to understand for the user.`,
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
    console.error("[assistant]", (error as Error).message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

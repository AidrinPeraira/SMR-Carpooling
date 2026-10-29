import { createGoogle } from "@ai-sdk/google";
import { createMCPClient } from "@ai-sdk/mcp";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
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

  const { messages }: { messages: UIMessage[] } = await req.json();

  const google = createGoogle({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const smrMcpClient = await createMCPClient({
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

  const mapBoxMcpClient = await createMCPClient({
    transport: {
      type: "http",
      url: process.env.MAPBOX_MCP_URL || "",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
      },
    },
  });

  const mapboxTools = await mapBoxMcpClient.tools();
  const smrTools = await smrMcpClient.tools();

  const result = streamText({
    model: google("gemini-3.5-flash-lite"),
    instructions: `You are Ride Assistant, the ShareMyRide support agent. Your role is "${userRole}".

SCOPE
- Only answer questions related to the ShareMyRide service — bookings, trips, payments, account, routes, and navigation.
- Politely decline any off-topic requests. Example: "I can only help with ShareMyRide related questions."

TOOLS
- Use the SMR tools to look up or act on bookings, trips, payments, and account details. Never fabricate IDs, prices, or statuses — always call the API.
- Use the Mapbox tools only when you need a place name, coordinates, geocoding, or route/directions to support an SMR query.

BEHAVIOUR
- Keep answers short and conversational — this is a chat, not a document.
- If an API call fails or returns an error, tell the user something went wrong and suggest they try again. Never expose raw error messages or internal details.
- Ask one clarifying question at a time if the user's request is ambiguous.`,
    tools: {
      ...mapboxTools,
      ...smrTools,
    },
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}

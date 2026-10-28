import { createGoogle } from "@ai-sdk/google";
import { createMCPClient } from "@ai-sdk/mcp";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  UIMessage,
} from "ai";
import { cookies } from "next/headers";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const google = createGoogle({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const smrMcpClient = await createMCPClient({
    transport: {
      type: "http",
      url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mcp` || "",
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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
    instructions: "You are a helpful assistant.",
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

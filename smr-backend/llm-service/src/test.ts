import { AppConfig } from "#/application.config";
import { createGoogle } from "@ai-sdk/google";
import { createMCPClient } from "@ai-sdk/mcp";
import { generateText, streamText } from "ai";

async function testMCP() {
  const google = createGoogle({
    apiKey: AppConfig.GEMINI_API_KEY,
  });

  const smrMcpClient = await createMCPClient({
    transport: {
      type: "http",
      url: "http://localhost:4007/mcp",
    },
  });

  const mapBoxMcpClient = await createMCPClient({
    transport: {
      type: "http",
      url: AppConfig.MAPBOX_MCP_URL,
      headers: {
        Authorization: `Bearer ${AppConfig.MAPBOX_TOKEN}`,
      },
    },
  });

  const mapboxTools = await mapBoxMcpClient.tools();
  const smrTools = await smrMcpClient.tools();

  // const result = await generateText({
  //   model: google("gemini-3.5-flash-lite"),
  //   tools: {
  //     ...mapboxTools
  //     k
  //     ...smrTools,
  //   },
  //   maxSteps: 5,
  //   prompt:
  //     "Can you search for trips between ernakulam and kozhikode scheduled for tomorrow?",
  // });
  //
  // console.log(JSON.stringify(result));
  //
  // writeFileSync("./result.json", JSON.stringify(result, null, 2), "utf-8");

  const result = streamText({
    model: google("gemini-3.5-flash-lite"),
    tools: {
      ...mapboxTools,
      ...smrTools,
    },
    prompt:
      "Can you search for trips between ernakulam and kozhikode scheduled for tomorrow?",
  });

  for (const a of await result.content) {
    console.log(".....logging a stream");
    console.log(a);
  }
}

await testMCP();

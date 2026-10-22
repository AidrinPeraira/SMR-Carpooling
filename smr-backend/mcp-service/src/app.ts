import { createMcpServer } from "#/tools";
import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";

export async function createApp() {
  const handler = createMcpHandler(() => createMcpServer());

  const app = createMcpExpressApp();
  const node = toNodeHandler(handler);
  app.all("/mcp", (req, res) => void node(req, res, req.body));

  return app;
}

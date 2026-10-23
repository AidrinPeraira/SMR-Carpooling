import { createMcpServer } from "#/tools";
import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { HttpStatusCode } from "axios";

export async function createApp() {
  const handler = createMcpHandler(() => createMcpServer());

  const app = createMcpExpressApp();
  const node = toNodeHandler(handler);

  app.get("/mcp/health", (_req, res) => {
    res.status(HttpStatusCode.Ok).json({ status: "OK" });
  });

  app.all("/mcp", (req, res) => void node(req, res, req.body));

  return app;
}

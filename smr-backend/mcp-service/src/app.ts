import { createPassengerMcpServer, createDriverMcpServer } from "#/tools";
import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { HttpStatusCode } from "axios";

export async function createApp() {
  const passengerHandler = createMcpHandler(() => createPassengerMcpServer());
  const driverHandler = createMcpHandler(() => createDriverMcpServer());

  const app = createMcpExpressApp();
  const passengerNode = toNodeHandler(passengerHandler);
  const driverNode = toNodeHandler(driverHandler);

  app.get("/mcp/health", (_req, res) => {
    res.status(HttpStatusCode.Ok).json({ status: "OK" });
  });

  app.all("/mcp/passenger", (req, res) => void passengerNode(req, res, req.body));
  app.all("/mcp/driver", (req, res) => void driverNode(req, res, req.body));

  return app;
}

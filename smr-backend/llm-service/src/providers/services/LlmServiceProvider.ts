import { ILlmProvider } from "#/contracts/interfaces/services/ILlmProvider";
import { createMCPClient, MCPClient } from "@ai-sdk/mcp";

export class LlmServiceProvider implements ILlmProvider {
  private _mcpClients: Map<string, MCPClient>;

  constructor() {}

  async registerMcpClients(clientName: string, clientUrl: string) {
    const newClient = await createMCPClient({});
  }
}

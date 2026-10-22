import type {
  CallToolResult,
  ServerContext,
  StandardSchemaWithJSON,
  ToolAnnotations,
} from "@modelcontextprotocol/server";

export interface ToolDefinition<
  T extends StandardSchemaWithJSON = StandardSchemaWithJSON,
> {
  title: string;
  description: string;
  inputSchema: T;
  annotations?: ToolAnnotations;
}

export type ToolHandler<TInput = unknown> = (
  input: TInput,
  ctx: ServerContext,
) => Promise<CallToolResult>;

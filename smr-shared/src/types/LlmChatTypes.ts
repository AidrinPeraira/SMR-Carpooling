export interface ToolCall {
  name: string;
  provider: string;
  args: Record<string, unknown>;
  result: unknown;
  success: boolean;
}

import { ChatRole, ToolCall } from "@sharemyride/shared";

export interface ChatMessageEntity {
  content: string;
  role: ChatRole;
  toolCalls?: ToolCall[];
  timestamp: Date;
}

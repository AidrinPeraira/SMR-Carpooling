import { ChatMessageEntity } from "#/contracts/entity/ChatMessageEntity";
import { UserRole } from "@sharemyride/shared";

export interface ChatSession {
  userId: string;
  userRole: UserRole;
  messages: ChatMessageEntity[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

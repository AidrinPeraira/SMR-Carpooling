import { UserRole } from "@sharemyride/shared";

export interface NewChatSessionRequestDTO {
  userId: string;
  userRole: UserRole;
}

export interface NewChatMessageRequestDTO {
  userId: string;
  content: string;
}

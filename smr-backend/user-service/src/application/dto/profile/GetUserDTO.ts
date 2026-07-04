import { UserRole } from "@smr/shared";

export interface GetUserResultDTO {
  user: {
    firstName: string;
    lastName: string;
    emailId: string;
    userRole: UserRole;
    userId: string;
    profileImage?: string;
  };
}

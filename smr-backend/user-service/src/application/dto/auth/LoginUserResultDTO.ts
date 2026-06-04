import { UserRole } from "@smr/shared";

export interface LoginUserResultDTO {
  user: {
    firstName: string;
    lastName: string;
    emailId: string;
    userRole: UserRole;
    userId: string;
    profileImage?: string;
  };
  accessToken: string;
  refreshToken: string;
}

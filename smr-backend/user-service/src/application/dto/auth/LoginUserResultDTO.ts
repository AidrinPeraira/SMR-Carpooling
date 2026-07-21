import { UserRole } from "@sharemyride/shared";

export interface LoginUserResultDTO {
  user: {
    firstName: string;
    lastName: string;
    emailId: string;
    userRole: UserRole;
    userId: string;
    phoneNumber: string;
    isDriver: boolean;
    createdAt: Date;
    profileImage?: string;
  };
  accessToken: string;
  refreshToken: string;
}

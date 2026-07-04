import { UserRole } from "@smr/shared";

export interface GetUserResultDTO {
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
}

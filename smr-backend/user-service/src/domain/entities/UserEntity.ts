import { VerificationToken } from "#/domain/ValueObjects/VerificationToken";
import { AccountStatus, UserRole } from "@sharemyride/shared";

export interface UserEntity {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  passwordHash: string;
  profileImage?: string;
  userRole: UserRole;
  emailVerified: boolean;
  isDriver: boolean;
  accountStatus: AccountStatus;
  verificationToken?: VerificationToken;
  createdAt: Date;
  updatedAt: Date;
}

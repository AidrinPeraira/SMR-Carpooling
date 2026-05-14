import { AccountStatus, UserRole } from "@smr/shared"


export interface UserEntity {
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  profileImage: string | null; role: UserRole
  userRole: UserRole,
  emailVerified: boolean,
  isDriver: boolean,
  accountStatus: AccountStatus,
  createdAt: Date,
  updatedAt: Date,
}

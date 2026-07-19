import { UserEntity } from "#/domain/entities/UserEntity";
import { AccountStatus, QueryDTO, UserRole } from "@smr/shared";

export type GetAllUsersRequestQueryDTO = QueryDTO<UserEntity>;

export interface GetAllUsersResponseDTO {
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  userRole: UserRole;
  accountStatus: AccountStatus;
  isDriver: boolean;
  createdAt: Date;
}

export interface ChangeUserStatusRequestDTO {
  userId: string;
  status: AccountStatus;
}

export interface GetFullUserProfileResponseDTO {
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  userRole: UserRole;
  accountStatus: AccountStatus;
  emailVerified: boolean;
  isDriver: boolean;
  phoneNumber: string;
  profileImage?: string;
  createdAt: Date;
}

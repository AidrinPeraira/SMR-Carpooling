import { UserEntity } from "#/domain/entities/UserEntity";
import { QueryDTO, UserRole } from "@smr/shared";

export interface GetUserResultDTO {
  firstName: string;
  lastName: string;
  emailId: string;
  userRole: UserRole;
  userId: string;
  phoneNumber: string;
  isDriver: boolean;
  createdAt: Date;
  profileImage?: string;
}

export interface UpdateUserRequestDTO {
  firstName?: string;
  lastName?: string;
  userId: string;
  password: string;
  phoneNumber?: string;
  profileImage?: string;
}

export type GetAllUsersRequestQueryDTO = QueryDTO<UserEntity>;

import { UserEntity } from "#/domain/entities/UserEntity";
import { AccountStatus, QueryDTO } from "@smr/shared";

export type GetAllUsersRequestQueryDTO = QueryDTO<UserEntity>;

export interface ChangeUserStatusRequestDTO {
  userId: string;
  status: AccountStatus;
}

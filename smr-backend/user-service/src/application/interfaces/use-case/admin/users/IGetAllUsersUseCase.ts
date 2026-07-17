import {
  GetAllUsersResponseDTO,
  GetAllUsersRequestQueryDTO,
} from "#/application/dto/admin/users/AdminUsersDTO";
import { PaginatedPayload } from "@smr/shared";

/**
 * This is for the change user status use case
 * The method should chnage Account Status for users
 * If the user is blocked it should update session store to blacklist the user
 */
export interface IGetAllUsersUseCase {
  execute(
    query: GetAllUsersRequestQueryDTO,
  ): Promise<PaginatedPayload<GetAllUsersResponseDTO[]>>;
}

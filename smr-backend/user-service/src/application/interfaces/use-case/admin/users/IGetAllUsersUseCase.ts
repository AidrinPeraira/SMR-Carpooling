import { GetUserResultDTO } from "#/application/dto/profile/UserProfileDTO";
import { GetAllUsersRequestQueryDTO } from "#/application/dto/admin/users/AdminUsersDTO";

/**
 * This is for the change user status use case
 * The method should chnage Account Status for users
 * If the user is blocked it should update session store to blacklist the user
 */
export interface IGetAllUsersUseCase {
  execute(query: GetAllUsersRequestQueryDTO): Promise<GetUserResultDTO[]>;
}

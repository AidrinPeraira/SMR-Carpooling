import { GetUsersCountResponseDTO } from "#/application/dto/admin/users/AdminUsersDTO";

/**
 * This use case aggreagates the user count
 * details
 */
export interface IGetUsersCountUseCase {
  execute(): Promise<GetUsersCountResponseDTO>;
}

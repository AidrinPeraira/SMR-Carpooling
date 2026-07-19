import { GetFullUserProfileResponseDTO } from "#/application/dto/admin/users/AdminUsersDTO";

/**
 * This use cases fetches all the data needed for the admin to view the full user profile
 * based on the user id provided
 */
export interface IGetFullUserProfileUseCase {
  /**
   * This method should find the right user from the repo.
   * Throw execeptions if not found or bad data
   * and retutn the user as response DTO
   */
  execute(userId: string): Promise<GetFullUserProfileResponseDTO>;
}

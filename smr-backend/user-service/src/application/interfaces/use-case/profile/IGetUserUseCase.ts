import { GetUserResultDTO } from "#/application/dto/profile/GetUserDTO";

export interface IGetUserUseCase {
  /**
   * This method finds returns basic user data
   * The user id comes from auth headers set by the auth middleware
   */
  execute(userId: string): Promise<GetUserResultDTO>;
}

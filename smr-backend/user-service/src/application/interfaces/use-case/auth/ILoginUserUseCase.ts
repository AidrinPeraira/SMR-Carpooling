import { LoginUserRequestDTO } from "#/application/dto/auth/LoginUserRequestDTO";
import { LoginUserResultDTO } from "#/application/dto/auth/LoginUserResultDTO";

/**
 * Interface for handiling the login logic for a user
 */
export interface ILoginUserUseCase {
  /**
   * This method is reposible for loggin in existing users.
   * The method should handle the following.
   *  - check for existing user and verify credentinals
   *  - issue access and refresh tokens
   *  - create a user session in session repository
   *
   *    @param data : validated user data from controller
   *    @return result object with data for response to client
   */
  execute(data: LoginUserRequestDTO): Promise<LoginUserResultDTO>;
}

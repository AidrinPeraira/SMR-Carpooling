import { LoginUserResultDTO } from "#/application/dto/auth/LoginUserResultDTO";
import { VerifySignupEmailRequestDTO } from "#/application/dto/auth/VerifySignupEmailRequestDTO";

export interface IVerifySignupEmailUseCase {
  /**
   * This method is reposible for verifying the email of new users and logging them in
   * The method should handle the following.
   *    - verify email
   *    - update user's email verified status
   *    - login user (issue tokens and cerate sessions)
   *
   *    @param data : email verification token
   *    @return result object with data for response to client
   */
  execute(data: VerifySignupEmailRequestDTO): Promise<LoginUserResultDTO>;
}

import { SignUpRequestDTO } from "#/application/dto/auth/SignUpRequestDTO";
import { SignUpResultDTO } from "#/application/dto/auth/SignUpResultDTO";

export interface ISignupUserUseCase {
  /**
   * This method is reposible for signing up new users.
   * The method should handle the following.
   *  - Register user into user db.
   *  - Create a token with limited life for email verification.
   *  - Publish user sign up event
   *    - Event should have token and email in payload for notification service to send mail to verify the email.
   *
   *    @param data : validated user data from controller
   *    @return result object with data for response to client
   */
  execute(data: SignUpRequestDTO): Promise<SignUpResultDTO>;
}

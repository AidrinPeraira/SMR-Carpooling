import { LoginUserResultDTO } from "#/application/dto/auth/LoginUserResultDTO";

export interface IGoogleAuthUseCase {
  /**
   * This method takes the google auth token from the client
   * verifies it with google auth api
   * cretaes a new user / logs in existing user
   * throws error if invalid
   *
   * @param authToken : Authenticatoin token shared by google to client
   * @returns Data of logged in user
   */
  execute(authToken: string): Promise<LoginUserResultDTO>;
}

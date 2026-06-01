import { ISignupUserUseCase } from "#/application/interfaces/use-case/ISignUpUserUseCase";
import { IAuthControllerV1 } from "#/presentation/v1/interfaces/IAuthControllerV1";
import {
  toSignUpDTO,
  toSignUpResult,
} from "#/presentation/v1/mapper/AuthMapper";
import {
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  SignUpResult,
  UserSuccessMessage,
} from "@smr/shared";
import { Request, Response } from "express";
export class AuthControllerV1 implements IAuthControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _signUpUserUseCase: ISignupUserUseCase,
  ) {}

  /**
   * This function gets the validated user request in the body of the request object and maps it into the signup request dto and calls the signup user use case.
   * After succesful signup it maps the result into signup response and sends back the response
   *
   * @param req : Express request object with user data in body
   * @param res : Express response object.
   * @return void
   */
  async signup(req: Request, res: Response): Promise<void> {
    const userData = toSignUpDTO(req.body);

    this._logger.info("Signing up new user: ", userData);

    const newUser = await this._signUpUserUseCase.execute(userData);

    this._logger.info("Signed up new user: ", newUser);

    res
      .status(HttpStatusCodes.Created)
      .json(
        makeSuccessResponse<SignUpResult>(
          UserSuccessMessage.REGISTERED,
          toSignUpResult(newUser),
        ),
      );
  }
}

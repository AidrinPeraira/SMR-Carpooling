import { ILoginUserUseCase } from "#/application/interfaces/use-case/ILoginUserUseCase";
import { ISignupUserUseCase } from "#/application/interfaces/use-case/ISignUpUserUseCase";
import { IVerifySignupEmailUseCase } from "#/application/interfaces/use-case/IVerifySignupEmailUseCase";
import { IAuthControllerV1 } from "#/presentation/v1/interfaces/IAuthControllerV1";
import {
  toLoginDTO,
  toLoginResult,
  toSignUpDTO,
  toSignUpResult,
  toVerifyEmailDTO,
} from "#/presentation/v1/mapper/AuthMapper";
import {
  HttpStatusCodes,
  ILogger,
  LoginResult,
  makeSuccessResponse,
  SignUpResult,
  UserSuccessMessage,
} from "@smr/shared";
import { Request, Response } from "express";

export class AuthControllerV1 implements IAuthControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _signUpUserUseCase: ISignupUserUseCase,
    private readonly _loginUserUseCase: ILoginUserUseCase,
    private readonly _verifySignupEmailUseCase: IVerifySignupEmailUseCase,
  ) {}

  async signup(req: Request, res: Response): Promise<void> {
    console.debug("This is the body: ", req.body);
    const userData = toSignUpDTO(req.body);

    this._logger.info("Signing up new user: ", {
      firstName: userData.firstName,
      lastName: userData.lastName,
      emailId: userData.emailId,
    });

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

  async verifySignupEmail(req: Request, res: Response): Promise<void> {
    const data = toVerifyEmailDTO(req.query);

    this._logger.info(
      "Verifying signup email with token: ",
      data.verificationToken,
    );

    const result = await this._verifySignupEmailUseCase.execute(data);

    this._logger.info(
      "Email verified successfully for user: ",
      result.user.userId,
    );

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse<LoginResult>(
          UserSuccessMessage.LOGGED_IN,
          toLoginResult(result),
        ),
      );
  }

  async login(req: Request, res: Response): Promise<void> {
    const loginData = toLoginDTO(req.body);

    this._logger.info("Logging in user: ", loginData.emailId);

    const result = await this._loginUserUseCase.execute(loginData);

    this._logger.info("User logged in successfully: ", result.user.userId);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse<LoginResult>(
          UserSuccessMessage.LOGGED_IN,
          toLoginResult(result),
        ),
      );
  }
}

import { IGoogleAuthUseCase } from "#/application/interfaces/use-case/IGoogleAuthUseCase";
import { ILoginUserUseCase } from "#/application/interfaces/use-case/ILoginUserUseCase";
import { IRefreshTokenUseCase } from "#/application/interfaces/use-case/IRefreshTokenUseCase";
import { ISignupUserUseCase } from "#/application/interfaces/use-case/ISignUpUserUseCase";
import { IVerifySignupEmailUseCase } from "#/application/interfaces/use-case/IVerifySignupEmailUseCase";
import { IGeneratePasswordChangeTokenUseCase } from "#/application/interfaces/use-case/IGeneratePasswordChangeToken";
import { IChangePasswordUseCase } from "#/application/interfaces/use-case/IChangePasswordUseCase";
import { IAuthControllerV1 } from "#/presentation/v1/interfaces/IAuthControllerV1";
import {
  toLoginDTO,
  toLoginResult,
  toSignUpDTO,
  toSignUpResult,
  toVerifyEmailDTO,
  toGoogleLoginDTO,
  toRefreshTokenDTO,
  toRefreshTokenResult,
  toForgotPasswordDTO,
  toChangePasswordDTO,
} from "#/presentation/v1/mapper/AuthMapper";
import {
  HttpStatusCodes,
  ILogger,
  LoginResult,
  makeSuccessResponse,
  RefreshTokenResult,
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
    private readonly _googleAuthUseCase: IGoogleAuthUseCase,
    private readonly _refreshTokensUseCase: IRefreshTokenUseCase,
    private readonly _generatePasswordChangeTokenUseCase: IGeneratePasswordChangeTokenUseCase,
    private readonly _changePasswordUseCase: IChangePasswordUseCase,
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
    const data = toVerifyEmailDTO(req.body);

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

  async googleAuth(req: Request, res: Response): Promise<void> {
    const token = toGoogleLoginDTO(req.body);

    this._logger.info("Google login attempt.");

    const result = await this._googleAuthUseCase.execute(token);

    this._logger.info("Google auth atempt success: ", {
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      emailId: result.user.emailId,
    });

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse<LoginResult>(
          UserSuccessMessage.LOGGED_IN,
          toLoginResult(result),
        ),
      );
  }

  async refreshTokens(req: Request, res: Response): Promise<void> {
    console.log("Refreesh tooken....: ", req.body);
    const refreshTokenData = toRefreshTokenDTO(req.body);

    this._logger.info("Token refresh request: ");

    const result = await this._refreshTokensUseCase.execute(refreshTokenData);

    this._logger.info("Tokens refreshed successfully.");

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse<RefreshTokenResult>(
          UserSuccessMessage.TOKEN_REFRESHED,
          toRefreshTokenResult(result),
        ),
      );
  }

  async generatePasswordChangeToken(
    req: Request,
    res: Response,
  ): Promise<void> {
    const dto = toForgotPasswordDTO(req.body);
    this._logger.info(
      "Requesting password change token for user: ",
      dto.emailId,
    );
    try {
      await this._generatePasswordChangeTokenUseCase.execute(dto);
    } catch (error) {
      this._logger.warn("Password change token generation failed: ", error);
    }
    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(UserSuccessMessage.PASSWORD_RESET_LINK_SENT));
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    const dto = toChangePasswordDTO(req.body);
    this._logger.info("Changing password for user: ", dto.emailId);
    await this._changePasswordUseCase.execute(dto);
    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(UserSuccessMessage.PASSWORD_CHANGED));
  }
}

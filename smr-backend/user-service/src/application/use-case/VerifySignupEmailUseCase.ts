import { AppConfig } from "#/application.config";
import { LoginUserResultDTO } from "#/application/dto/auth/LoginUserResultDTO";
import { VerifySignupEmailRequestDTO } from "#/application/dto/auth/VerifySignupEmailRequestDTO";
import { ISessionRepository } from "#/application/interfaces/repository/ISessionRepository";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { IVerifySignupEmailUseCase } from "#/application/interfaces/use-case/IVerifySignupEmailUseCase";
import {
  AccountStatus,
  ApplicationError,
  AuthSession,
  AuthTokenPayload,
  EmailVerificationTokenPayload,
  ErrorCode,
  HttpStatusCodes,
  TokenType,
  UserErrorMessage,
} from "@smr/shared";

export class VerifySignupEmailUseCase implements IVerifySignupEmailUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _sessionRepository: ISessionRepository,
    private readonly _tokenService: ITokenService,
  ) {}

  async execute(
    data: VerifySignupEmailRequestDTO,
  ): Promise<LoginUserResultDTO> {
    const tokenPayload =
      this._tokenService.verifyToken<EmailVerificationTokenPayload>(
        data.verificationToken,
      );

    const existingUser = await this._userRepository.findByCustomId(
      tokenPayload.userId,
    );

    if (!existingUser) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        { userId: tokenPayload.userId, emailId: tokenPayload.emailId },
      );
    }

    if (
      !existingUser.verificationToken ||
      existingUser.verificationToken.value !== data.verificationToken ||
      existingUser.verificationToken.isExpired()
    ) {
      throw new ApplicationError(
        UserErrorMessage.INVALID_CREDENTIALS,
        HttpStatusCodes.Unauthorized,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        { userId: tokenPayload.userId, emailId: tokenPayload.emailId },
      );
    }

    await this._userRepository.updateByCustomId(existingUser.userId, {
      emailVerified: true,
      accountStatus: AccountStatus.VERIFIIED,
      verificationToken: undefined,
    });

    const now = Math.floor(Date.now() / 1000);
    const aceessTokenExpiry = now + AppConfig.ACCESS_TOKEN_LIFE_SECONDS;
    const refreshTokenExpiry = now + AppConfig.REFRESH_TOKEN_LIFE_SECONDS;

    const accessTokenPayload: AuthTokenPayload = {
      user: {
        userId: existingUser.userId,
        userRole: existingUser.userRole,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        emailId: existingUser.emailId,
      },
      tokenType: TokenType.ACCESS_TOKEN,
      iat: now,
      exp: aceessTokenExpiry,
    };

    const refreshTokenPayload: AuthTokenPayload = {
      user: {
        userId: existingUser.userId,
        userRole: existingUser.userRole,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        emailId: existingUser.emailId,
      },
      tokenType: TokenType.REFRESH_TOKEN,
      iat: now,
      exp: refreshTokenExpiry,
    };

    const accessToken =
      this._tokenService.generateAccessToken(accessTokenPayload);

    const refreshToken =
      this._tokenService.generateRefreshToken(refreshTokenPayload);

    const sessionName = `auth:session:${existingUser.userId}`;
    const existingSession =
      await this._sessionRepository.getSession(sessionName);

    const activeRefreshTokens = existingSession
      ? [...existingSession.activeRefreshTokens, refreshToken]
      : [refreshToken];

    const session: AuthSession = {
      userId: existingUser.userId,
      activeRefreshTokens,
    };

    await this._sessionRepository.updateSession(sessionName, session);

    return {
      user: {
        userId: existingUser.userId,
        userRole: existingUser.userRole,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        emailId: existingUser.emailId,
        profileImage: existingUser.profileImage,
      },
      accessToken,
      refreshToken,
    };
  }
}

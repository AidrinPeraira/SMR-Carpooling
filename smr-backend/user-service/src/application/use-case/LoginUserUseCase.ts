import { AppConfig } from "#/application.config";
import { LoginUserRequestDTO } from "#/application/dto/auth/LoginUserRequestDTO";
import { LoginUserResultDTO } from "#/application/dto/auth/LoginUserResultDTO";
import { ISessionRepository } from "#/application/interfaces/repository/ISessionRepository";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IHashingService } from "#/application/interfaces/services/IHashingService";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { ILoginUserUseCase } from "#/application/interfaces/use-case/ILoginUserUseCase";
import {
  AccountStatus,
  ApplicationError,
  AuthSession,
  AuthTokenPayload,
  ErrorCode,
  HttpStatusCodes,
  TokenType,
  UserErrorMessage,
} from "@smr/shared";

export class LoginUserUseCase implements ILoginUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _hashingService: IHashingService,
    private readonly _tokenService: ITokenService,
    private readonly _sessionRepository: ISessionRepository,
  ) {}

  async execute(data: LoginUserRequestDTO): Promise<LoginUserResultDTO> {
    const existingUser = await this._userRepository.findByEmail(data.emailId);
    if (!existingUser) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        { emailId: data.emailId },
      );
    }

    //verifying credentials and user
    const passwordMatch = this._hashingService.compareHash(
      data.password,
      existingUser.passwordHash,
    );

    if (!passwordMatch) {
      throw new ApplicationError(
        UserErrorMessage.INVALID_CREDENTIALS,
        HttpStatusCodes.Unauthorized,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        { emailId: data.emailId },
      );
    }

    if (!existingUser.emailVerified) {
      throw new ApplicationError(
        UserErrorMessage.UNVERIFIED_EMAIL,
        HttpStatusCodes.Unauthorized,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        { emailId: data.emailId },
      );
    }

    if (existingUser.accountStatus !== AccountStatus.VERIFIIED) {
      throw new ApplicationError(
        UserErrorMessage.ACCOUNT_SUSPENDED,
        HttpStatusCodes.Unauthorized,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        { emailId: data.emailId },
      );
    }

    //generate token and session

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

    //add session to redis
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

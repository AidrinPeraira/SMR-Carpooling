import { AppConfig } from "#/application.config";
import { RefreshTokenRequestDTO } from "#/application/dto/auth/RefreshTokenRequestDTO";
import { RefreshTokenResultDTO } from "#/application/dto/auth/RefreshTokenResultDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { IRefreshTokenUseCase } from "#/application/interfaces/use-case/auth/IRefreshTokenUseCase";
import {
  AccountStatus,
  ApplicationError,
  AuthTokenPayload,
  ErrorCode,
  GenericErrorMessage,
  HttpStatusCodes,
  TokenType,
  UserErrorMessage,
} from "@sharemyride/shared";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService,
  ) {}

  async execute(data: RefreshTokenRequestDTO): Promise<RefreshTokenResultDTO> {
    const tokenPayload = this._tokenService.verifyRefreshToken(
      data.refreshToken,
    );

    if (tokenPayload.tokenType !== TokenType.REFRESH_TOKEN) {
      throw new ApplicationError(
        GenericErrorMessage.UNAUTHORIZED,
        HttpStatusCodes.Unauthorized,
        ErrorCode.INPUT_UNAUTHORIZED,
        {
          location: "Refresh token use case",
          description: "Token is not a refresh token",
        },
      );
    }

    const existingUser = await this._userRepository.findByCustomId(
      tokenPayload.user.userId,
    );

    if (!existingUser) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        {
          location: "Refresh token use case",
          description: "User not found matching refresh token owner ID",
        },
      );
    }

    if (existingUser.accountStatus == AccountStatus.BLOCKED) {
      throw new ApplicationError(
        UserErrorMessage.ACCOUNT_BLOCKED,
        HttpStatusCodes.Forbidden,
        ErrorCode.INPUT_FORBIDDEN,
        {
          location: "Refresh token use case",
          description: "User account status is blocked",
        },
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

    return { accessToken, refreshToken };
  }
}

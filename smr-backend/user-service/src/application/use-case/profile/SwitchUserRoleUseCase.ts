import { AppConfig } from "#/application.config";
import { LoginUserResultDTO } from "#/application/dto/auth/LoginUserResultDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { ISwitchUserRoleUseCase } from "#/application/interfaces/use-case/profile/ISwitchUserRoleUseCase";
import {
  ApplicationError,
  AuthTokenPayload,
  ErrorCode,
  HttpStatusCodes,
  TokenType,
  UserErrorMessage,
  UserRole,
} from "@sharemyride/shared";

export class SwitchUserRoleUseCase implements ISwitchUserRoleUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService,
  ) {}

  async execute(userId: string): Promise<LoginUserResultDTO> {
    const existingUser = await this._userRepository.findByCustomId(userId);
    if (!existingUser) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        {
          location: "SwitchUserRoleUseCase",
          description: "User not found with matching ID",
          userId,
        },
      );
    }

    const newRole =
      existingUser.userRole === UserRole.DRIVER
        ? UserRole.PASSENGER
        : UserRole.DRIVER;

    const updatedUser = await this._userRepository.updateByCustomId(userId, {
      userRole: newRole,
    });

    const now = Math.floor(Date.now() / 1000);
    const accessTokenExpiry = now + AppConfig.ACCESS_TOKEN_LIFE_SECONDS;
    const refreshTokenExpiry = now + AppConfig.REFRESH_TOKEN_LIFE_SECONDS;

    const accessTokenPayload: AuthTokenPayload = {
      user: {
        userId: updatedUser.userId,
        userRole: updatedUser.userRole,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        emailId: updatedUser.emailId,
      },
      tokenType: TokenType.ACCESS_TOKEN,
      iat: now,
      exp: accessTokenExpiry,
    };

    const refreshTokenPayload: AuthTokenPayload = {
      user: {
        userId: updatedUser.userId,
        userRole: updatedUser.userRole,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        emailId: updatedUser.emailId,
      },
      tokenType: TokenType.REFRESH_TOKEN,
      iat: now,
      exp: refreshTokenExpiry,
    };

    const accessToken =
      this._tokenService.generateAccessToken(accessTokenPayload);
    const refreshToken =
      this._tokenService.generateRefreshToken(refreshTokenPayload);

    return {
      user: {
        userId: updatedUser.userId,
        userRole: updatedUser.userRole,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        emailId: updatedUser.emailId,
        phoneNumber: updatedUser.phoneNumber,
        isDriver: updatedUser.isDriver,
        createdAt: updatedUser.createdAt,
        profileImage: updatedUser.profileImage,
      },
      accessToken,
      refreshToken,
    };
  }
}

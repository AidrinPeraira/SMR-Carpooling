import { LoginUserResultDTO } from "#/application/dto/auth/LoginUserResultDTO";
import { IGoogleAuthService } from "#/application/interfaces/services/IGoogleAuthService";
import { IGoogleAuthUseCase } from "#/application/interfaces/use-case/auth/IGoogleAuthUseCase";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { AppConfig } from "#/application.config";
import {
  AccountStatus,
  ApplicationError,
  AuthTokenPayload,
  ErrorCode,
  HttpStatusCodes,
  TokenType,
  UserErrorMessage,
  UserRole,
} from "@sharemyride/shared";

/**
 * This use case handles authenticating  a user using google auth
 * It logs the user in i fthe user exists or creates a new user
 * if the user doesn't exist
 */
export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    private readonly googleAuthService: IGoogleAuthService,
    private readonly userRepository: IUserRepository,
    private readonly uniqueIdGenerator: IUniqueIdGenerator,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(authToken: string): Promise<LoginUserResultDTO> {
    const result = await this.googleAuthService.verifyToken(authToken);

    if (!result.emailId) {
      throw new ApplicationError(
        UserErrorMessage.INVALID_CREDENTIALS,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        {
          location: "Google auth use case",
          description: "Google profile does not contain a valid email address.",
          reason: "Google profile does not contain a valid email address.",
        },
      );
    }

    let user = await this.userRepository.findByEmail(result.emailId);

    //if the user doesn't exist create a new one
    if (!user) {
      const userId = this.uniqueIdGenerator.generateRandomId();
      const now = new Date();

      user = await this.userRepository.save({
        userId,
        firstName: result.firstName || "Google",
        lastName: result.lastName || "User",
        emailId: result.emailId,
        phoneNumber: result.phoneNumber || "00000000000",
        passwordHash: result.passwordHash || "google-oauth",
        userRole: UserRole.PASSENGER,
        emailVerified: true,
        isDriver: false,
        accountStatus: AccountStatus.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (user.accountStatus === AccountStatus.BLOCKED) {
      throw new ApplicationError(
        UserErrorMessage.ACCOUNT_BLOCKED,
        HttpStatusCodes.Unauthorized,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        {
          location: "Google auth use case",
          description: "User account status is blocked",
          emailId: user.emailId,
        },
      );
    }
    //generate token
    const now = Math.floor(Date.now() / 1000);
    const aceessTokenExpiry = now + AppConfig.ACCESS_TOKEN_LIFE_SECONDS;
    const refreshTokenExpiry = now + AppConfig.REFRESH_TOKEN_LIFE_SECONDS;

    const accessTokenPayload: AuthTokenPayload = {
      user: {
        userId: user.userId,
        userRole: user.userRole,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
      },
      tokenType: TokenType.ACCESS_TOKEN,
      iat: now,
      exp: aceessTokenExpiry,
    };

    const refreshTokenPayload: AuthTokenPayload = {
      user: {
        userId: user.userId,
        userRole: user.userRole,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
      },
      tokenType: TokenType.REFRESH_TOKEN,
      iat: now,
      exp: refreshTokenExpiry,
    };

    const accessToken =
      this.tokenService.generateAccessToken(accessTokenPayload);

    const refreshToken =
      this.tokenService.generateRefreshToken(refreshTokenPayload);

    return {
      user: {
        userId: user.userId,
        userRole: user.userRole,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        phoneNumber: user.phoneNumber,
        isDriver: user.isDriver,
        createdAt: user.createdAt,
        profileImage: user.profileImage,
      },
      accessToken,
      refreshToken,
    };
  }
}

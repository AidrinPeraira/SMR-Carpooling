import { LoginUserResultDTO } from "#/application/dto/auth/LoginUserResultDTO";
import { IGoogleAuthService } from "#/application/interfaces/services/IGoogleAuthService";
import { IGoogleAuthUseCase } from "#/application/interfaces/use-case/IGoogleAuthUseCase";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { ISessionRepository } from "#/application/interfaces/repository/ISessionRepository";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { AppConfig } from "#/application.config";
import {
  AccountStatus,
  ApplicationError,
  AuthSession,
  AuthTokenPayload,
  ErrorCode,
  HttpStatusCodes,
  TokenType,
  UserErrorMessage,
  UserRole,
} from "@smr/shared";

export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    private readonly googleAuthService: IGoogleAuthService,
    private readonly userRepository: IUserRepository,
    private readonly uniqueIdGenerator: IUniqueIdGenerator,
    private readonly tokenService: ITokenService,
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(authToken: string): Promise<LoginUserResultDTO> {
    // 1. Verify Google Token
    const result = await this.googleAuthService.verifyToken(authToken);

    if (!result.emailId) {
      throw new ApplicationError(
        UserErrorMessage.INVALID_CREDENTIALS,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        { reason: "Google profile does not contain a valid email address." },
      );
    }

    // 2. Look up or register the user
    let user = await this.userRepository.findByEmail(result.emailId);

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
        profileImage: result.profileImage,
        userRole: UserRole.PASSENGER,
        emailVerified: true, // Google accounts are pre-verified
        isDriver: false,
        accountStatus: AccountStatus.VERIFIIED, // Pre-verified
        createdAt: now,
        updatedAt: now,
      });
    }

    // 3. Check account status
    if (user.accountStatus !== AccountStatus.VERIFIIED) {
      throw new ApplicationError(
        UserErrorMessage.ACCOUNT_SUSPENDED,
        HttpStatusCodes.Unauthorized,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        { emailId: user.emailId },
      );
    }

    // 4. Generate access and refresh tokens
    const nowUnix = Math.floor(Date.now() / 1000);
    const accessTokenExpiry = nowUnix + AppConfig.ACCESS_TOKEN_LIFE_SECONDS;
    const refreshTokenExpiry = nowUnix + AppConfig.REFRESH_TOKEN_LIFE_SECONDS;

    const accessTokenPayload: AuthTokenPayload = {
      user: {
        userId: user.userId,
        userRole: user.userRole,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
      },
      tokenType: TokenType.ACCESS_TOKEN,
      iat: nowUnix,
      exp: accessTokenExpiry,
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
      iat: nowUnix,
      exp: refreshTokenExpiry,
    };

    const accessToken =
      this.tokenService.generateAccessToken(accessTokenPayload);
    const refreshToken =
      this.tokenService.generateRefreshToken(refreshTokenPayload);

    // 5. Create or update session in Redis
    const sessionName = `auth:session:${user.userId}`;
    const existingSession =
      await this.sessionRepository.getSession(sessionName);

    const activeRefreshTokens = existingSession
      ? [...existingSession.activeRefreshTokens, refreshToken]
      : [refreshToken];

    const session: AuthSession = {
      userId: user.userId,
      activeRefreshTokens,
    };

    await this.sessionRepository.updateSession(sessionName, session);

    return {
      user: {
        userId: user.userId,
        userRole: user.userRole,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        profileImage: user.profileImage,
      },
      accessToken,
      refreshToken,
    };
  }
}

import { AppConfig } from "#/application.config";
import { GeneratePasswordChangeTokenRequestDTO } from "#/application/dto/auth/PasswordChangeDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { IGeneratePasswordChangeTokenUseCase } from "#/application/interfaces/use-case/auth/IGeneratePasswordChangeToken";
import { VerificationToken } from "#/domain/ValueObjects/VerificationToken";
import {
  ApplicationError,
  EmailVerificationTokenPayload,
  ErrorCode,
  EventName,
  HttpStatusCodes,
  PasswordChangeRequestEvent,
  PasswordChangeRequestEventPayload,
  TokenType,
  UserErrorMessage,
} from "@sharemyride/shared";

export class GeneratePasswordChangeTokenUseCase implements IGeneratePasswordChangeTokenUseCase {
  constructor(
    private readonly _userRespository: IUserRepository,
    private readonly _tokenService: ITokenService,
    private readonly _eventBus: IEventBus,
  ) {}

  async execute(data: GeneratePasswordChangeTokenRequestDTO): Promise<void> {
    const existingUser = await this._userRespository.findByEmail(data.emailId);

    if (!existingUser) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        {
          location: "Generate password change token use case",
          description: "User not found with matching email",
          emailId: data.emailId,
        },
      );
    }

    //generate token
    const now = new Date();
    const tokenExpiresAt = new Date(
      now.getTime() + AppConfig.TOKEN_LIFE_MINUTES * 60 * 1000,
    );

    const tokenPayload: EmailVerificationTokenPayload = {
      userId: existingUser.userId,
      emailId: existingUser.emailId,
      tokenType: TokenType.PASSWORD_RESET_TOKEN,
      iat: now.getTime(),
      exp: tokenExpiresAt.getTime(),
    };

    const token = new VerificationToken(
      this._tokenService.generateToken(tokenPayload),
      tokenExpiresAt,
    );

    //update user with token
    await this._userRespository.updateByCustomId(existingUser.userId, {
      verificationToken: token,
      updatedAt: now,
    });

    //publish event to send the email
    const eventPayload: PasswordChangeRequestEventPayload = {
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      userId: existingUser.userId,
      emailId: existingUser.emailId,
      token: token.value,
    };

    const event: PasswordChangeRequestEvent = {
      eventName: EventName.AUTH_USER_CHANGE_PASSWORD_REQUEST,
      payload: eventPayload,
      timestamp: now,
    };

    await this._eventBus.publish(event);
  }
}

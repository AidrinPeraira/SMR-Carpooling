import { PasswordChangeRequestDTO } from "#/application/dto/auth/PasswordChangeDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IHashingService } from "#/application/interfaces/services/IHashingService";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { IChangePasswordUseCase } from "#/application/interfaces/use-case/auth/IChangePasswordUseCase";
import {
  ApplicationError,
  EmailVerificationTokenPayload,
  ErrorCode,
  EventName,
  HttpStatusCodes,
  PasswordChangedEvent,
  PasswordChangedEventPayload,
  TokenType,
  UserErrorMessage,
} from "@sharemyride/shared";

export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService,
    private readonly _hashingService: IHashingService,
    private readonly _eventBus: IEventBus,
  ) {}

  async execute(data: PasswordChangeRequestDTO): Promise<void> {
    const { emailId, password, confimPassword, token } = data;

    const existingUser = await this._userRepository.findByEmail(emailId);

    if (!existingUser) {
      throw new ApplicationError(
        UserErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        {
          location: "Change password use case",
          description: "User not found with matching email",
          emailId: data.emailId,
        },
      );
    }

    if (
      !existingUser.verificationToken ||
      existingUser.verificationToken.value !== token ||
      existingUser.verificationToken.isExpired()
    ) {
      throw new ApplicationError(
        UserErrorMessage.INVALID_TOKEN,
        HttpStatusCodes.Unauthorized,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        {
          location: "Change password use case",
          description: "Verification token mismatch or expired",
          emailId: data.emailId,
        },
      );
    }

    const tokenPayload = this._tokenService.verifyToken<EmailVerificationTokenPayload>(
      token,
    );

    if (tokenPayload.tokenType !== TokenType.PASSWORD_RESET_TOKEN) {
      throw new ApplicationError(
        UserErrorMessage.INVALID_TOKEN,
        HttpStatusCodes.Unauthorized,
        ErrorCode.DOMAIN_ACCESS_DENIED,
        {
          location: "Change password use case",
          description: "Token type is not a password reset token",
          emailId: data.emailId,
        },
      );
    }

    if (password !== confimPassword) {
      throw new ApplicationError(
        UserErrorMessage.PASSWORD_MISMATCH,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        {
          location: "Change password use case",
          description: "Passwords do not match",
          emailId: data.emailId,
        },
      );
    }

    const hashedPassword = this._hashingService.createHash(password);

    const updatedUser = await this._userRepository.updateByCustomId(
      existingUser.userId,
      {
        passwordHash: hashedPassword,
        verificationToken: undefined,
      },
    );

    const eventPayload: PasswordChangedEventPayload = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      userId: updatedUser.userId,
      emailId: updatedUser.emailId,
    };

    const now = new Date();
    const event: PasswordChangedEvent = {
      eventName: EventName.AUTH_USER_CHANGE_PASSWORD_CHANGED,
      payload: eventPayload,
      timestamp: now,
    };

    await this._eventBus.publish(event);
  }
}

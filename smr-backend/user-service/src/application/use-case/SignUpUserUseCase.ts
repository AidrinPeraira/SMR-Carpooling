import { AppConfig } from "#/application.config";
import { SignUpRequestDTO } from "#/application/dto/auth/SignUpRequestDTO";
import { SignUpResultDTO } from "#/application/dto/auth/SignUpResultDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IEventBus } from "#/application/interfaces/services/IEventBus";
import { IHashingService } from "#/application/interfaces/services/IHashingService";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { ISignupUserUseCase } from "#/application/interfaces/use-case/ISignUpUserUseCase";
import { EmailVerificationTokenPayload } from "#/application/types/TokenPayload";
import { UserEntity } from "#/domain/entities/UserEntity";
import { VerificationToken } from "#/domain/ValueObjects/VerificationToken";
import {
  AccountStatus,
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  UserErrorMessage,
  UserRole,
  UserSignUpEvent,
  UserSignupEventPayload,
} from "@smr/shared";

export class SignUpUserUseCase implements ISignupUserUseCase {
  constructor(
    private readonly _userRespository: IUserRepository,
    private readonly _hashingService: IHashingService,
    private readonly _uniqueIdGenerator: IUniqueIdGenerator,
    private readonly _tokenService: ITokenService,
    private readonly _eventBus: IEventBus,
  ) {}

  /**
   * This use case method validates and registes a new user.
   * It does the following steps:
   *  - Check for existing user.
   *  - If email verified existing user exists, thrwos an error.
   *  - If email unverified existing user exists, updates.
   *  - If no existing user, creates a new user.
   *  - Creates and stores verification token for email verification.
   *  - Publishes User Sign Up event.
   *
   *  @param data : Validated user data from controller
   *  @return User data as registered in DB
   */
  async execute(data: SignUpRequestDTO): Promise<SignUpResultDTO> {
    // check for duplicate entries.  (Business validation)
    const existingUser = await this._userRespository.findByEmail(data.emailId);

    //trying to register as a valid existing user.
    if (existingUser && existingUser.emailVerified) {
      throw new ApplicationError(
        UserErrorMessage.EMAIL_ALREADY_EXISTS,
        HttpStatusCodes.Conflict,
        ErrorCode.DOMAIN_ALREADY_EXISTS,
        ErrorDetails.DOMAIN_ALREADY_EXISTS,
      );
    }

    //create a new user
    let newUser: UserEntity;
    const userId = this._uniqueIdGenerator.generateRandomId();
    const passwordHash = this._hashingService.createHash(data.password);

    const now = new Date();
    const tokenExpiresAt = new Date(
      now.getTime() + AppConfig.TOKEN_LIFE_MINUTES * 60 * 1000,
    );

    //create a token for email verification
    const tokenPayload: EmailVerificationTokenPayload = {
      userId,
      emailId: data.emailId,
      createdAt: now,
      expiresAt: tokenExpiresAt,
    };
    const token = new VerificationToken(
      this._tokenService.generateToken(tokenPayload),
      tokenExpiresAt,
    );

    if (existingUser && !existingUser.emailVerified) {
      //trying to register an email unverified existing user
      const updatedUser: UserEntity = {
        ...existingUser,
        passwordHash,
        verificationToken: token,
        updatedAt: now,
      };

      newUser = await this._userRespository.updateById(
        existingUser.id,
        updatedUser,
      );
    } else {
      //registering a completly new user
      const newUserData = await this._userRespository.save({
        userId: userId,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash: passwordHash,
        phoneNumber: data.phoneNumber,
        emailId: data.emailId,
        emailVerified: false,
        userRole: UserRole.PASSENGER,
        isDriver: false,
        accountStatus: AccountStatus.PENDING_VERIFICATION,
        verificationToken: token,
        createdAt: now,
        updatedAt: now,
      });

      newUser = await this._userRespository.save(newUserData);
    }

    //publish event with token and user data for email.
    const eventPayload: UserSignupEventPayload = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      userId: newUser.userId,
      emailId: newUser.emailId,
      token: token.value,
    };

    const event: UserSignUpEvent = {
      eventName: EventName.AUTH_USER_SIGNUP,
      payload: eventPayload,
      timestamp: now,
    };

    this._eventBus.publish(event);

    return {
      userId: newUser.userId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      emailId: newUser.emailId,
    };
  }
}

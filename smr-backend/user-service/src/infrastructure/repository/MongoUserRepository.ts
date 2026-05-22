import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { UserEntity } from "#/domain/entities/UserEntity";
import { VerificationToken } from "#/domain/ValueObjects/VerificationToken";
import { UserDoc } from "#/infrastructure/database/models/MongoUserModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";
import { Model } from "mongoose";

/**
 * This is the implemtation for IUserRepository,
 * It takes the entity and mongoose user document as genric types
 * It also takes the user model in the constructor
 * It extends the base repository for shared methods.
 *
 * @param userModel : Mongoose model object for user entity
 * @return UserRepository instance.
 */
export class MongoUserRespository
  extends MongoBaseRepository<UserEntity, UserDoc>
  implements IUserRepository
{
  private readonly _userModel: Model<UserDoc>;

  constructor(userModel: Model<UserDoc>) {
    super("userId", userModel);
    this._userModel = userModel;
  }

  /**
   * Internal mapper method for converting DB document to domain entity, and aslo map "_id" field to "id"
   *
   * @param data : User document returned from DB query.
   * @return User entity for domain.
   */
  protected toDomainEntityMapper(data: UserDoc): UserEntity {
    const user: UserEntity = {
      id: data._id.toString(),
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      phoneNumber: data.phoneNumber,
      passwordHash: data.passwordHash,
      userRole: data.userRole,
      isDriver: data.isDriver,
      accountStatus: data.accountStatus,
      emailVerified: data.emailVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    if (data.profileImage) user.profileImage = data.profileImage;
    if (data.verificationToken)
      user.verificationToken = data.verificationToken as VerificationToken;

    return user;
  }

  /**
   * Repository method for finding the user by given email id
   *
   * @param email : Email Id of the user as string.
   * @return User document.
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    const data = await this._userModel.findOne({ emailId: email });
    return data ? this.toDomainEntityMapper(data) : null;
  }
}

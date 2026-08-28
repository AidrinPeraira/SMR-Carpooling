import { IMemberRepository } from "#/application/interfaces/repository/IUserRepository";
import { MemberEntity } from "#/domain/entities/MemeberEntity";
import { MemberDoc } from "#/infrastructure/database/models/MongoMemberModel";
import { BaseRepository } from "#/infrastructure/repository/BaseRepository";
import { Model } from "mongoose";

/**
 * This class implements the repository for
 * the member aggregate.
 */
export class MemberRespository
  extends BaseRepository<MemberEntity, MemberDoc>
  implements IMemberRepository
{
  private readonly _memberModel: Model<MemberDoc>;
  constructor(memberModel: Model<MemberDoc>) {
    super("memberId", memberModel);
    this._memberModel = memberModel;
  }

  protected toDomainEntityMapper(data: MemberDoc): MemberEntity {
    return {
      id: data._id.toString(),
      memberId: data.memberId,
      firstName: data.firstName,
      lastName: data.lastName,
      activeTrips: data.activeTrips ?? [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

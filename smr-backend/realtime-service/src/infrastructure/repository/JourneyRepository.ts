import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepsoitory";
import { JourneyEntity } from "#/domain/entities/JourneyEntity";
import { JourneyDoc } from "#/infrastructure/database/model/MongoJourneyModel";
import { BaseRepository } from "#/infrastructure/repository/BaseRepository";
import { Model } from "mongoose";

export class JourneyRepository
  extends BaseRepository<JourneyEntity, JourneyDoc>
  implements IJourneyRepository
{
  constructor(_journeyModel: Model<JourneyDoc>) {
    super("journeyId", _journeyModel);
  }

  protected toDomainEntityMapper(data: JourneyDoc): JourneyEntity {
    return {
      journeyId: data.journeyId,
      driverId: data.driverId,
      members: data.members ?? [],
      isActive: data.isActive,
    };
  }

  async findByJourneyId(journeyId: string): Promise<JourneyEntity | null> {
    return this.findByCustomId(journeyId);
  }

  async findMemberShareToken(
    journeyId: string,
    shareToken: string,
  ): Promise<string | null> {
    const journey = await this.model
      .findOne({ journeyId, "members.shareToken": shareToken })
      .lean();

    if (!journey) return null;

    const member = journey.members.find((m) => m.shareToken === shareToken);
    return member?.memberId ?? null;
  }

  async setMemberShareToken(
    journeyId: string,
    memberId: string,
    shareToken: string,
  ): Promise<void> {
    await this.model.updateOne(
      { journeyId, "members.memberId": memberId },
      { $set: { "members.$.shareToken": shareToken } },
    );
  }

  /** Pulls a member from the journey and returns their share token if one existed. */
  async removeMember(
    journeyId: string,
    memberId: string,
  ): Promise<string | null> {
    const journey = await this.model
      .findOne({ journeyId, "members.memberId": memberId })
      .lean();

    if (!journey) return null;

    const member = journey.members.find((m) => m.memberId === memberId);
    const shareToken = member?.shareToken ?? null;

    await this.model.updateOne(
      { journeyId },
      { $pull: { members: { memberId } } },
    );

    return shareToken;
  }
}

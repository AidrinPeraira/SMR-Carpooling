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
}

import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { CallSessionEntity } from "#/domain/entities/CallSessionEntity";
import { CallSessionDoc } from "#/infrastructure/database/models/MongoCallSessionModel";
import { BaseRepository } from "#/infrastructure/repository/BaseRepository";
import { Model } from "mongoose";
import { CallStatus } from "@sharemyride/shared";

export class CallSessionRepository
  extends BaseRepository<CallSessionEntity, CallSessionDoc>
  implements ICallSessionRepository
{
  constructor(_callSessionModel: Model<CallSessionDoc>) {
    super("callSessionId", _callSessionModel);
  }

  protected toDomainEntityMapper(data: CallSessionDoc): CallSessionEntity {
    return {
      id: data._id.toString(),
      callSessionId: data.callSessionId,
      callerId: data.callerId,
      receiverId: data.receiverId,
      callStatus: data.callStatus as CallStatus,
      joinedAt: data.joinedAt,
      leftAt: data.leftAt ?? undefined,
    };
  }
}

import { ICallSessionRepository } from "#/application/interfaces/repository/ICallSessionRepository";
import { CallSessionEntity } from "#/domain/entities/CallSessionEntity";
import { BaseRepository } from "#/infrastructure/repository/BaseRepository";
import { Model } from "mongoose";
import { CallStatus } from "@sharemyride/shared";
import { CallSessionDoc } from "#/infrastructure/database/model/MongoCallSessionModel";

const ACTIVE_CALL_STATUSES = [CallStatus.RINGING, CallStatus.ACTIVE_CALL];

export class CallSessionRepository
  extends BaseRepository<CallSessionEntity, CallSessionDoc>
  implements ICallSessionRepository
{
  constructor(_callSessionModel: Model<CallSessionDoc>) {
    super("callSessionId", _callSessionModel);
  }

  async getUserActiveCall(userId: string): Promise<CallSessionEntity | null> {
    const doc = await this.model.findOne({
      $or: [{ callerId: userId }, { receiverId: userId }],
      callStatus: { $in: ACTIVE_CALL_STATUSES },
    });

    return doc ? this.toDomainEntityMapper(doc) : null;
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

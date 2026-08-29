import { CallStatus } from "@sharemyride/shared";

export interface CallSessionEntity {
  id: string;
  callSessionId: string;
  callerId: string;
  receiverId: string;
  callStatus: CallStatus;
  joinedAt: Date;
  leftAt: Date;
}

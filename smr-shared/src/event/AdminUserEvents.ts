import { AccountStatus } from "../enums";
import { DomainEvent } from "./DomainEvent";

export interface UserBlockEventPayload {
  userId: string;
  status: AccountStatus.BLOCKED;
}

export type UserBlockedEvent = DomainEvent<UserBlockEventPayload>;

export interface UserUnblockEventPayload {
  userId: string;
  status: AccountStatus.BLOCKED;
}

export type UserUnblockedEvent = DomainEvent<UserBlockEventPayload>;

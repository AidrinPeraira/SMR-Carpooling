import { AccountStatus } from "../enums";
import { DomainEvent } from "./DomainEvent";

export interface UserBlockEventPayload {
  userId: string;
  isDriver: boolean;
  status: AccountStatus.BLOCKED;
}

export type UserBlockedEvent = DomainEvent<UserBlockEventPayload>;

export interface UserUnblockEventPayload {
  userId: string;
  isDriver: boolean;
  status: AccountStatus.ACTIVE;
}

export type UserUnblockedEvent = DomainEvent<UserUnblockEventPayload>;

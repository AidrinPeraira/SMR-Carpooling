import { DomainEvent } from "./DomainEvent";

export interface UserSignupEventPayload {
  firstName: string;
  lastName: string;
  emailId: string;
  userId: string;
  token: string;
}

export type UserSignUpEvent = DomainEvent<UserSignupEventPayload>;

export interface PasswordChangeRequestEventPayload {
  firstName: string;
  lastName: string;
  emailId: string;
  userId: string;
  token: string;
}

export type PasswordChangeRequestEvent =
  DomainEvent<PasswordChangeRequestEventPayload>;

export interface PasswordChangedEventPayload {
  firstName: string;
  lastName: string;
  emailId: string;
  userId: string;
}

export type PasswordChangedEvent = DomainEvent<PasswordChangedEventPayload>;

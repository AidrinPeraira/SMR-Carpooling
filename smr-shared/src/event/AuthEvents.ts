import { DomainEvent } from "./DomainEvent";

export interface UserSignupEventPayload {
  firstName: string;
  lastName: string;
  emailId: string;
  userId: string;
  token: string;
}

export type UserSignUpEvent = DomainEvent<UserSignupEventPayload>;

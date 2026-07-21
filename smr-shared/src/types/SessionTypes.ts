import { AccountStatus } from "../enums";

export interface AuthSession {
  userId: string;
  status: AccountStatus;
}

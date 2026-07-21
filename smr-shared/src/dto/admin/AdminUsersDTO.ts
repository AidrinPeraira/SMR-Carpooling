import { AccountStatus, UserRole } from "../../enums";

export interface ChangeUserStatusRequest {
  userId: string;
}

export interface GetAllUsersResult {
  user_id: string;
  first_name: string;
  last_name: string;
  email_id: string;
  user_role: UserRole;
  account_status: AccountStatus;
  is_driver: boolean;
  created_at: Date;
}

export interface GetFullUserProfileResult {
  user_id: string;
  first_name: string;
  last_name: string;
  email_id: string;
  user_role: UserRole;
  account_status: AccountStatus;
  email_verified: boolean;
  is_driver: boolean;
  phone_number: string;
  profile_image?: string;
  created_at: Date;
}

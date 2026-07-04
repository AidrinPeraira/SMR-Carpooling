import { UserRole } from "../enums";

export interface GetUserResult {
  first_name: string;
  last_name: string;
  email_id: string;
  user_role: UserRole;
  user_id: string;
  profile_image?: string;
}

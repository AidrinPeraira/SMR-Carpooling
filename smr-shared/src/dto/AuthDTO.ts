import { UserRole } from "../enums";

export interface SignUpRequest {
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

export interface SignUpResult {
  user_id: string;
  first_name: string;
  last_name: string;
  email_id: string;
}

export interface LoginRequest {
  email_id: string;
  password: string;
}

export interface LoginResult {
  user: {
    first_name: string;
    last_name: string;
    email_id: string;
    user_role: UserRole;
    user_id: string;
    profile_image?: string;
  };
  access_token: string;
  refresh_token: string;
}

export interface VerifyEmailRequest {
  verification_token: string;
}

import { ImageFileTypes, UserRole } from "../enums";

export interface GetUserResult {
  first_name: string;
  last_name: string;
  email_id: string;
  user_role: UserRole;
  user_id: string;
  phone_number: string;
  is_driver: boolean;
  created_at: string;
  profile_image?: string;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  user_id: string;
  password: string;
  phone_number?: string;
  profile_image?: string;
}

export interface GetAvatarUploadUrlRequest {
  file_type: ImageFileTypes;
}

export interface GetAvatarUploadUrlResult {
  url: string;
  expires_at: string;
}

export interface UpdateAvatarRequest {
  profile_image: string;
}

export interface UpdateAvatarResult {
  profile_image: string;
}


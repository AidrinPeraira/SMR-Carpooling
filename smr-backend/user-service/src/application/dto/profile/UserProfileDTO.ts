import { ImageFileTypes, UserRole } from "@sharemyride/shared";

export interface GetUserResultDTO {
  firstName: string;
  lastName: string;
  emailId: string;
  userRole: UserRole;
  userId: string;
  phoneNumber: string;
  isDriver: boolean;
  createdAt: Date;
  profileImage?: string;
}

export interface UpdateUserRequestDTO {
  firstName?: string;
  lastName?: string;
  userId: string;
  password: string;
  phoneNumber?: string;
  profileImage?: string;
}

export interface GetAvatarUploadUrlRequestDTO {
  userId: string;
  fileType: ImageFileTypes;
}

export interface GetAvatarUploadUrlResutlDTO {
  url: string;
  expiresAt: Date;
}

export interface UpdateAvatarRequestDTO {
  userId: string;
  profileImage: string;
}

export interface UpdateAvatarResponseDTO {
  profileImage: string;
}

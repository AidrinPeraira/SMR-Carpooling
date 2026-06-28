export interface PasswordChangeRequestMailDTO {
  emailId: string;
  userName: string;
  userId: string;
  token: string;
}

export interface PasswordChangedMailDTO {
  emailId: string;
  userName: string;
  userId: string;
}

export interface GeneratePasswordChangeTokenRequestDTO {
  emailId: string;
}

export interface PasswordChangeRequestDTO {
  emailId: string;
  password: string;
  confimPassword: string;
  token: string;
}

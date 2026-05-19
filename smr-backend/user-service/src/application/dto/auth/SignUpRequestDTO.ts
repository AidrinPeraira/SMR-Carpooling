export interface SignUpRequestDTO {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  profileImage?: string;
}

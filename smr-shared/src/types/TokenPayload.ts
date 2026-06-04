import { TokenType, UserRole } from "../enums";

export interface EmailVerificationTokenPayload {
  userId: string;
  emailId: string;
  tokenType: TokenType.EMAIL_VERIFICATION_TOKEN;
  iat: number;
  exp: number;
}

export interface AuthTokenPayload {
  user: {
    userId: string;
    emailId: string;
    firstName: string;
    lastName: string;
    userRole: UserRole;
  };
  tokenType: TokenType.ACCESS_TOKEN | TokenType.REFRESH_TOKEN;
  iat: number;
  exp: number;
}

export interface EmailVerificationTokenPayload {
  userId: string;
  emailId: string;
  createdAt: Date;
  expiresAt: Date;
}

import { AuthTokenPayload } from "@smr/shared";

/**
 * This interface defines a service for creating and verifying the various types of JWT TOkens.
 */
export interface ITokenService {
  generateToken<PayloadType extends object>(payload: PayloadType): string;
  verifyToken<PayloadType>(token: string): PayloadType;

  generateAccessToken(payload: AuthTokenPayload): string;
  verifyAccessToken(token: string): AuthTokenPayload;

  generateRefreshToken(payload: AuthTokenPayload): string;
  verifyRefreshToken(token: string): AuthTokenPayload;
}

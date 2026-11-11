/**
 * This interface defines a service for creating and verifying the various types of JWT TOkens.
 */
export interface ITokenService {
  generateToken<PayloadType extends object>(
    payload: PayloadType,
    key: string,
  ): string;
  verifyToken<PayloadType>(token: string, key: string): PayloadType;
}

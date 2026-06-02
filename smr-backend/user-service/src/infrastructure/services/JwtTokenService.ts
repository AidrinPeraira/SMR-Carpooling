import { ITokenService } from "#/application/interfaces/services/ITokenService";
import jwt from "jsonwebtoken";

/**
 * Implementation of ITokenService using the jsonwebtoken library.
 * Handles the generation and verification of JWTs.
 */
export class JWTTokenService implements ITokenService {
  /**
   * Signs a payload and returns a JWT token.
   *
   * @param payload : The data to be encoded in the token (e.g., user_id)
   * @param secret : The secret key used to sign the token
   * @returns string : The generated JWT token
   */
  generateToken<PayloadType extends object>(
    payload: PayloadType,
    secret: string,
  ): string {
    // Generate a new token with the provided payload and secret
    const token = jwt.sign(payload, secret);
    return token;
  }

  /**
   * Verifies a JWT token and returns the decoded payload.
   * Native JWT errors (TokenExpiredError, JsonWebTokenError) are allowed to throw
   * and will be caught by the global error mapper.
   *
   * @param token : The JWT string to verify
   * @param secret : The secret key to verify the signature
   * @returns PayloadType : The decoded data from the token
   */
  verifyToken<PayloadType>(token: string, secret: string): PayloadType {
    // jwt.verify will throw if the token is invalid or expired
    const payload = jwt.verify(token, secret) as PayloadType;
    return payload;
  }
}

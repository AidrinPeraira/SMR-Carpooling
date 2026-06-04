import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { AuthTokenPayload } from "@smr/shared";
import jwt from "jsonwebtoken";

export class JWTTokenService implements ITokenService {
  constructor(
    private readonly _genericTokenSecret: string,
    private readonly _accessTokenSecret: string,
    private readonly _refreshTokenSecret: string,
  ) {}

  generateToken<PayloadType extends object>(payload: PayloadType): string {
    return jwt.sign(payload, this._genericTokenSecret);
  }

  verifyToken<PayloadType>(token: string): PayloadType {
    return jwt.verify(token, this._genericTokenSecret) as PayloadType;
  }

  generateAccessToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, this._accessTokenSecret);
  }

  verifyAccessToken(token: string): AuthTokenPayload {
    return jwt.verify(token, this._accessTokenSecret) as AuthTokenPayload;
  }

  generateRefreshToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, this._refreshTokenSecret);
  }

  verifyRefreshToken(token: string): AuthTokenPayload {
    return jwt.verify(token, this._refreshTokenSecret) as AuthTokenPayload;
  }
}

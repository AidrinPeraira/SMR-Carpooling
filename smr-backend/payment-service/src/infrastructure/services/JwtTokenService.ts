import { ITokenService } from "#/application/interfaces/services/ITokenService";
import jwt from "jsonwebtoken";

export class JWTTokenService implements ITokenService {
  constructor() {}

  generateToken<PayloadType extends object>(
    payload: PayloadType,
    key: string,
  ): string {
    return jwt.sign(payload, key);
  }

  verifyToken<PayloadType>(token: string, key: string): PayloadType {
    return jwt.verify(token, key) as PayloadType;
  }
}

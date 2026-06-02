export interface ITokenService {
  generateToken<PayloadType extends object>(
    payload: PayloadType,
    secret: string,
  ): string;
  verifyToken<PayloadType>(token: string, secret: string): PayloadType;
}

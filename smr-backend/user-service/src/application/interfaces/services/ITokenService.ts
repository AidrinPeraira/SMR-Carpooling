export interface ITokenService {
  generateToken(payload: unknown): string;
}

import { UserEntity } from "#/domain/entities/UserEntity";

export interface IGoogleAuthService {
  verifyToken(token: string): Promise<Partial<UserEntity>>;
}

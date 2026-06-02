export interface IHashingService {
  createHash(value: string): string;
  compareHash(value: string, hashedValue: string): boolean;
}

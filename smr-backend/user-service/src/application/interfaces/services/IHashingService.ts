export interface IHashingService {
  createHash(value: string): string;
  compareHash(valueOne: string, valueTwo: string): boolean;
}

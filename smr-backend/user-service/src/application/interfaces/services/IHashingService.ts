/**
 * Interface definition for a hashing serivce that genreates a random hash and for compring hashes.
 * The hash method returns a random string for each time a string is hashed (using random salt)
 * The compare method compares the hashes.
 */
export interface IHashingService {
  createHash(value: string): string;
  compareHash(value: string, hashedValue: string): boolean;
}

import { IHashingService } from "#/application/interfaces/services/IHashingService";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Implementation of IHashingService using Node's native crypto module.
 * Employs scrypt for secure, memory-hard password hashing.
 */
export class CryptoHashingService implements IHashingService {
  private readonly _keyLength = 64;

  /**
   * Creates a secure hash for a given string using scrypt.
   * Generates a unique 16-byte salt for every password.
   *
   * @param value : The plain text string to hash
   * @returns A string in the format "salt:hash"
   */
  createHash(value: string): string {
    const salt = randomBytes(16).toString("hex");

    // scryptSync(password, salt, keylen)
    const hash = scryptSync(value, salt, this._keyLength).toString("hex");

    return `${salt}:${hash}`;
  }

  /**
   * Compares a plain text string against a stored "salt:hash" string.
   *
   * @param valueOne : The plain text string (e.g., from login request)
   * @param valueTwo : The stored hash string (e.g., from database)
   * @returns boolean : True if they match
   */
  compareHash(value: string, hashedValue: string): boolean {
    const [salt, storedHash] = hashedValue.split(":");

    if (!salt || !storedHash) {
      return false;
    }

    // Hash the incoming value using the SAME salt
    const candidateHash = scryptSync(value, salt, this._keyLength);
    const storedHashBuffer = Buffer.from(storedHash, "hex");

    // Use timingSafeEqual to prevent timing attacks
    return timingSafeEqual(candidateHash, storedHashBuffer);
  }
}

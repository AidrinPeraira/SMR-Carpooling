import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { randomBytes } from "node:crypto";

/**
 * Implementation of IUniqueIdGenerator using Node's native crypto module.
 * Generates cryptographically secure random strings.
 */
export class CryptoUIDService implements IUniqueIdGenerator {
  constructor(private readonly _stringLength: number = 16) {}

  generateRandomId(): string {
    const uuid = randomBytes(this._stringLength).toString("hex");
    return uuid;
  }
}

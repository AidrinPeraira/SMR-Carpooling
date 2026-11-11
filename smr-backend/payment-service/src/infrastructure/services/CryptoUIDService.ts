import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { randomBytes } from "node:crypto";

/**
 * Implementation of IUniqueIdGenerator using Node's native crypto module.
 * Generates cryptographically secure random strings.
 */
export class CryptoUIDService implements IUniqueIdGenerator {
  constructor(private readonly _stringLength: number = 3) {}

  generateRandomId(prefix: string): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const uuid = randomBytes(this._stringLength).toString("hex").toUpperCase();
    return `${prefix}-${year}${month}${day}-${uuid}`;
  }
}

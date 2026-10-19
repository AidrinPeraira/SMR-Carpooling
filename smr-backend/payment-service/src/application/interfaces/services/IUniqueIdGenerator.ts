/**
 * This service generates random uids
 */
export interface IUniqueIdGenerator {
  generateRandomId(prefix: string): string;
}

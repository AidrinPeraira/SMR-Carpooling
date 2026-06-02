import { describe, it, expect } from "vitest";
import { HashingService } from "#/infrastructure/services/CryptoHashingService";

describe("HashingService (scrypt)", () => {
  const hashingService = new HashingService();
  const plainText = "MySecurePassword@123";

  it("should create a hash in the 'salt:hash' format", () => {
    const hash = hashingService.createHash(plainText);
    
    expect(hash).toContain(":");
    const [salt, hashedValue] = hash.split(":");
    expect(salt).toHaveLength(32); // 16 bytes in hex
    expect(hashedValue).toHaveLength(128); // 64 bytes in hex
  });

  it("should generate different hashes for the same input due to unique salts", () => {
    const hash1 = hashingService.createHash(plainText);
    const hash2 = hashingService.createHash(plainText);
    
    expect(hash1).not.toBe(hash2);
  });

  it("should return true when comparing valid plain text with its hash", () => {
    const hash = hashingService.createHash(plainText);
    const result = hashingService.compareHash(plainText, hash);
    
    expect(result).toBe(true);
  });

  it("should return false when comparing incorrect plain text with a hash", () => {
    const hash = hashingService.createHash(plainText);
    const result = hashingService.compareHash("WrongPassword", hash);
    
    expect(result).toBe(false);
  });

  it("should return false for malformed hash strings", () => {
    const result = hashingService.compareHash(plainText, "malformedhash");
    expect(result).toBe(false);
  });
});

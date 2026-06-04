import { describe, it, expect } from "vitest";
import { CryptoUIDService } from "#/infrastructure/services/CryptoUIDService";

describe("CryptoUIDService", () => {
  it("should generate an ID of the specified default length (16 bytes = 32 hex chars)", () => {
    const uidService = new CryptoUIDService();
    const id = uidService.generateRandomId();
    
    expect(id).toHaveLength(32);
  });

  it("should respect custom length requirements", () => {
    const uidService = new CryptoUIDService(32); // 32 bytes
    const id = uidService.generateRandomId();
    
    expect(id).toHaveLength(64); // 64 hex chars
  });

  it("should generate unique IDs on each call", () => {
    const uidService = new CryptoUIDService();
    const id1 = uidService.generateRandomId();
    const id2 = uidService.generateRandomId();
    
    expect(id1).not.toBe(id2);
  });
});

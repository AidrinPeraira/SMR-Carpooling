import { describe, it, expect } from "vitest";
import { CryptoUIDService } from "#/infrastructure/services/CryptoUIDService";

describe("CryptoUIDService", () => {
  it("should generate an ID with the correct format: PREFIX-YYYYMMDD-HEX", () => {
    const uidService = new CryptoUIDService();
    const id = uidService.generateRandomId("TST");

    expect(id).toMatch(/^TST-\d{8}-[A-F0-9]{6}$/);
  });

  it("should respect custom length requirements", () => {
    const uidService = new CryptoUIDService(8);
    const id = uidService.generateRandomId("USR");

    expect(id).toMatch(/^USR-\d{8}-[A-F0-9]{16}$/);
  });

  it("should generate unique IDs on each call", () => {
    const uidService = new CryptoUIDService();
    const id1 = uidService.generateRandomId("TST");
    const id2 = uidService.generateRandomId("TST");

    expect(id1).not.toBe(id2);
  });
});

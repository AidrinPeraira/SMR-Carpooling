import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { vi } from "vitest";

const UidGenerator = vi.fn(
  class implements IUniqueIdGenerator {
    generateRandomId = vi.fn();
  },
);
export const mockUidGenerator = new UidGenerator();

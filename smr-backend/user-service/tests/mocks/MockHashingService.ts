import { IHashingService } from "#/application/interfaces/services/IHashingService";
import { vi } from "vitest";

const HashingService = vi.fn(
  class implements IHashingService {
    createHash = vi.fn();
    compareHash = vi.fn();
  },
);
export const mockHashingService = new HashingService();

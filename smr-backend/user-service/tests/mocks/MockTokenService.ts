import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { vi } from "vitest";

const TokenService = vi.fn(
  class implements ITokenService {
    generateToken = vi.fn();
  },
);
export const mockTokenService = new TokenService();

import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { vi } from "vitest";

const TokenService = vi.fn(
  class implements ITokenService {
    generateToken = vi.fn();
    verifyToken = vi.fn();
    generateAccessToken = vi.fn();
    verifyAccessToken = vi.fn();
    generateRefreshToken = vi.fn();
    verifyRefreshToken = vi.fn();
  },
);
export const mockTokenService = new TokenService();

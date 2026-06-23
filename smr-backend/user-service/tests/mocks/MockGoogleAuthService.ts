import { IGoogleAuthService } from "#/application/interfaces/services/IGoogleAuthService";
import { vi } from "vitest";

const GoogleAuthService = vi.fn(
  class implements IGoogleAuthService {
    verifyToken = vi.fn();
  },
);

export const mockGoogleAuthService = new GoogleAuthService();

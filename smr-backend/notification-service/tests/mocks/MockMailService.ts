import { IMailService } from "#/application/interfaces/services/IMailService";
import { vi } from "vitest";

export const MockMailService = vi.fn(
  class implements IMailService {
    send = vi.fn();
  },
);

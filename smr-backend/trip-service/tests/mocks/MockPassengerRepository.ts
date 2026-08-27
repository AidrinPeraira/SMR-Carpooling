import { IPassengerRepository } from "#/application/interfaces/repository/IPassengerRepository";
import { vi } from "vitest";

const PassengerRepository = vi.fn(
  class implements IPassengerRepository {
    save = vi.fn();
    findByPassengerId = vi.fn();
    update = vi.fn();
  },
);

export const mockPassengerRepository = new PassengerRepository();

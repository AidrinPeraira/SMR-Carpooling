import { IVehicleListRepository } from "#/application/interfaces/repository/IVehicleListRepository";
import { vi } from "vitest";

const VehicleListRepository = vi.fn(
  class implements IVehicleListRepository {
    find = vi.fn();
    findById = vi.fn();
    findByCustomId = vi.fn();
    findType = vi.fn();
    findExistingVehicle = vi.fn();
    findAll = vi.fn();
    save = vi.fn();
    updateById = vi.fn();
    updateByCustomId = vi.fn();
    deleteById = vi.fn();
    deleteByCustomId = vi.fn();
  },
);

export const mockVehicleListRepository = new VehicleListRepository();

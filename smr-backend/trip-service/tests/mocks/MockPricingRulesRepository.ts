import { IPricingRulesRepository } from "#/application/interfaces/repository/IPricingRulesRepository";
import { vi } from "vitest";

const PricingRulesRepository = vi.fn(
  class implements IPricingRulesRepository {
    find = vi.fn();
    findById = vi.fn();
    findByCustomId = vi.fn();
    findByVehicleType = vi.fn();
    findAll = vi.fn();
    save = vi.fn();
    updateById = vi.fn();
    updateByCustomId = vi.fn();
    deleteById = vi.fn();
    deleteByCustomId = vi.fn();
  },
);

export const mockPricingRulesRepository = new PricingRulesRepository();

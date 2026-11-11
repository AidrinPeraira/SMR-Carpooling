import { IConfigurationStore } from "#/application/interfaces/store/IConfigurationsStore";
import { vi } from "vitest";

const ConfigurationStore = vi.fn(
  class implements IConfigurationStore {
    getVehicleList = vi.fn();
    setVehicleList = vi.fn();
    getPricingRules = vi.fn();
    setPricingRules = vi.fn();
    invalidateCache = vi.fn();
  },
);

export const mockConfigurationStore = new ConfigurationStore();

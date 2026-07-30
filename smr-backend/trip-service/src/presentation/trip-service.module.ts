import express from "express";
import { AppConfig } from "#/application.config";
import { CreateNewPricingUseCase } from "#/application/use-case/admin/configurations/CreateNewPricingUseCase";
import { CreateNewVehicleUseCase } from "#/application/use-case/admin/configurations/CreateNewVehicleUseCase";
import { GetConfigurationUseCase } from "#/application/use-case/admin/configurations/GetConfigurationsUseCase";
import { UpdatePricingUseCase } from "#/application/use-case/admin/configurations/UpdatePricingUseCase";
import { UpdateVehicleUseCase } from "#/application/use-case/admin/configurations/UpdateVehicleUseCase";
import { PricingRulesRepository } from "#/infrastructure/repository/admin/PricingRulesRepository";
import { VehicleListRepository } from "#/infrastructure/repository/admin/VehicleListRepository";
import { EventBus } from "#/infrastructure/services/EventBus";
import { ConfigurationStore } from "#/infrastructure/store/ConfigurationsStore";
import { redisClient } from "#/infrastructure/store/connect-redis";
import { AdminConfigurationControllerV1 } from "#/presentation/v1/controllers/admin/AdminConfigurationControllerV1";
import { createAdminConfigurationRouterV1 } from "#/presentation/v1/routes/admin/AdminConfigurationRouterV1";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";
import { ConsolaLogger, UserRole } from "@sharemyride/shared";

/**
 * Composition Root for the Trip Service.
 * Handles Dependency Injection for repositories, stores, services, use cases, controllers, and routes.
 */

// Logger
const consolaLogger = new ConsolaLogger();

// Infrastructure Services & Repositories
const pricingRulesRepository = new PricingRulesRepository();
const vehicleListRepository = new VehicleListRepository();
const configurationStore = new ConfigurationStore(redisClient);

const dummyEventDispatcher = {
  register: async () => {},
  dispatch: async () => {},
};

const eventBusInstance = new EventBus(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  dummyEventDispatcher,
);

// Admin Configuration Use Cases
const getConfigurationsUseCase = new GetConfigurationUseCase(
  vehicleListRepository,
  pricingRulesRepository,
  configurationStore,
);

const createNewPricingUseCase = new CreateNewPricingUseCase(
  pricingRulesRepository,
  configurationStore,
);

const updatePricingUseCase = new UpdatePricingUseCase(
  pricingRulesRepository,
  configurationStore,
);

const createNewVehicleUseCase = new CreateNewVehicleUseCase(
  vehicleListRepository,
  configurationStore,
  eventBusInstance,
);

const updateVehicleUseCase = new UpdateVehicleUseCase(
  vehicleListRepository,
  configurationStore,
  eventBusInstance,
);

// Controller
const adminConfigurationControllerV1 = new AdminConfigurationControllerV1(
  consolaLogger,
  getConfigurationsUseCase,
  createNewPricingUseCase,
  updatePricingUseCase,
  createNewVehicleUseCase,
  updateVehicleUseCase,
);

// Routers
const adminConfigurationRoutesV1 = createAdminConfigurationRouterV1(
  adminConfigurationControllerV1,
);

const v1Router = express.Router();
v1Router.use(
  "/admin/trip/config",
  AuthMiddleware(UserRole.ADMIN),
  adminConfigurationRoutesV1,
);

export const tripServiceRouters = {
  v1: v1Router,
};

export const eventBus = eventBusInstance;

import express from "express";
import { AppConfig } from "#/application.config";
import { CreateNewPricingUseCase } from "#/application/use-case/admin/configurations/CreateNewPricingUseCase";
import { CreateNewVehicleUseCase } from "#/application/use-case/admin/configurations/CreateNewVehicleUseCase";
import { GetConfigurationUseCase } from "#/application/use-case/admin/configurations/GetConfigurationsUseCase";
import { UpdatePricingUseCase } from "#/application/use-case/admin/configurations/UpdatePricingUseCase";
import { UpdateVehicleUseCase } from "#/application/use-case/admin/configurations/UpdateVehicleUseCase";
import { AddDriverUseCase } from "#/application/use-case/driver/AddDriverUseCase";
import { GetDriverDetailsUseCase } from "#/application/use-case/driver/GetDriverDetailsUseCase";
import { UpdateDriverUseCase } from "#/application/use-case/driver/UpdateDriverUseCase";
import { AddVehicleUseCase as AddUserVehicleUseCase } from "#/application/use-case/vehicle/AddVehicleUseCase";
import { GetDriverVehiclesUseCase } from "#/application/use-case/vehicle/GetDriverVehiclesUseCase";
import { UpdateVehicleUseCase as UpdateUserVehicleUseCase } from "#/application/use-case/vehicle/UpdateVehicleUseCase";
import { DriverRepository } from "#/infrastructure/repository/DriverRepository";
import { VehicleRepository } from "#/infrastructure/repository/VehicleRepository";
import { PricingRulesRepository } from "#/infrastructure/repository/admin/PricingRulesRepository";
import { VehicleListRepository } from "#/infrastructure/repository/admin/VehicleListRepository";
import { EventBus } from "#/infrastructure/services/EventBus";
import { ConfigurationStore } from "#/infrastructure/store/ConfigurationsStore";
import { redisClient } from "#/infrastructure/store/connect-redis";
import { AdminConfigurationControllerV1 } from "#/presentation/v1/controllers/admin/AdminConfigurationControllerV1";
import { AdminDriverControllerV1 } from "#/presentation/v1/controllers/admin/AdminDriverControllerV1";
import { AdminVehicleControllerV1 } from "#/presentation/v1/controllers/admin/AdminVehicleControllerV1";
import { DriverControllerV1 } from "#/presentation/v1/controllers/driver/DriverControllerV1";
import { VehicleControllerV1 } from "#/presentation/v1/controllers/vehicle/VehicleControllerV1";
import { ApplicationApprovedHandler } from "#/presentation/v1/event-handlers/ApplicationApprovedEventHandler";
import { EventDispatcher } from "#/presentation/v1/messaging/EventDispatcher";
import { createAdminConfigurationRouterV1 } from "#/presentation/v1/routes/admin/AdminConfigurationRouterV1";
import { createAdminDriverRouterV1 } from "#/presentation/v1/routes/admin/AdminDriverRouterV1";
import { createAdminVehicleRouterV1 } from "#/presentation/v1/routes/admin/AdminVehicleRouterV1";
import { createDriverRouterV1 } from "#/presentation/v1/routes/driver/DriverRouterV1";
import { createVehicleRouterV1 } from "#/presentation/v1/routes/vehicle/VehicleRouterV1";
import { ConsolaLogger, EventName } from "@sharemyride/shared";

/**
 * Composition Root for the Trip Service.
 * Handles Dependency Injection for repositories, stores, services, use cases, controllers, and routes.
 */

// Logger
const consolaLogger = new ConsolaLogger();

// Infrastructure Services & Repositories
const pricingRulesRepository = new PricingRulesRepository();
const vehicleListRepository = new VehicleListRepository();
const driverRepository = new DriverRepository();
const vehicleRepository = new VehicleRepository();
const configurationStore = new ConfigurationStore(redisClient);

// Driver & User Vehicle Use Cases
const addDriverUseCase = new AddDriverUseCase(driverRepository);
const updateDriverUseCase = new UpdateDriverUseCase(driverRepository);
const getDriverDetailsUseCase = new GetDriverDetailsUseCase(driverRepository);

const addUserVehicleUseCase = new AddUserVehicleUseCase(vehicleRepository);
const updateUserVehicleUseCase = new UpdateUserVehicleUseCase(vehicleRepository);
const getDriverVehiclesUseCase = new GetDriverVehiclesUseCase(vehicleRepository);

// Application Approved Event Handler
const applicationApprovedHandler = new ApplicationApprovedHandler(
  consolaLogger,
  addUserVehicleUseCase,
  addDriverUseCase,
  updateUserVehicleUseCase,
  updateDriverUseCase,
);

// Event Dispatcher & Message Consumer
const eventDispatcher = new EventDispatcher(consolaLogger);
await eventDispatcher.register(
  EventName.ADMIN_APPROVE_APPLICTION,
  applicationApprovedHandler,
);

const eventBusInstance = new EventBus(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  eventDispatcher,
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

// Controllers
const adminConfigurationControllerV1 = new AdminConfigurationControllerV1(
  consolaLogger,
  getConfigurationsUseCase,
  createNewPricingUseCase,
  updatePricingUseCase,
  createNewVehicleUseCase,
  updateVehicleUseCase,
);

const adminDriverControllerV1 = new AdminDriverControllerV1(
  consolaLogger,
  getDriverDetailsUseCase,
);

const adminVehicleControllerV1 = new AdminVehicleControllerV1(
  consolaLogger,
  getDriverVehiclesUseCase,
);

const driverControllerV1 = new DriverControllerV1(
  consolaLogger,
  getDriverDetailsUseCase,
);

const vehicleControllerV1 = new VehicleControllerV1(
  consolaLogger,
  getDriverVehiclesUseCase,
);

// Routers
const adminConfigurationRoutesV1 = createAdminConfigurationRouterV1(
  adminConfigurationControllerV1,
);
const adminDriverRoutesV1 = createAdminDriverRouterV1(adminDriverControllerV1);
const adminVehicleRoutesV1 = createAdminVehicleRouterV1(adminVehicleControllerV1);

const driverRoutesV1 = createDriverRouterV1(driverControllerV1);
const vehicleRoutesV1 = createVehicleRouterV1(vehicleControllerV1);

const v1Router = express.Router();
v1Router.use("/admin/trip/config", adminConfigurationRoutesV1);
v1Router.use("/admin/trip/driver", adminDriverRoutesV1);
v1Router.use("/admin/trip/vehicles", adminVehicleRoutesV1);

v1Router.use("/driver", driverRoutesV1);
v1Router.use("/vehicles", vehicleRoutesV1);

export const tripServiceRouters = {
  v1: v1Router,
};

export const eventBus = eventBusInstance;

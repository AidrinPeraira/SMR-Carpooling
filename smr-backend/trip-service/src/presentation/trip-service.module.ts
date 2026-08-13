import express from "express";
import { AppConfig } from "#/application.config";
import { CreateNewPricingUseCase } from "#/application/use-case/admin/configurations/CreateNewPricingUseCase";
import { CreateNewVehicleUseCase } from "#/application/use-case/admin/configurations/CreateNewVehicleUseCase";
import { GetConfigurationUseCase } from "#/application/use-case/admin/configurations/GetConfigurationsUseCase";
import { UpdatePricingUseCase } from "#/application/use-case/admin/configurations/UpdatePricingUseCase";
import { UpdateVehicleUseCase } from "#/application/use-case/admin/configurations/UpdateVehicleUseCase";
import { AddDriverUseCase } from "#/application/use-case/driver/AddDriverUseCase";
import { ChangeDriverStatusUseCase } from "#/application/use-case/driver/ChangeDriverStatusUseCase";
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
import { UserBlockedEventHandler } from "#/presentation/v1/event-handlers/UserBlockedEventHandler";
import { UserUnblockedEventHandler } from "#/presentation/v1/event-handlers/UserUnblockedEventHandler";
import { EventDispatcher } from "#/presentation/v1/messaging/EventDispatcher";
import { createAdminConfigurationRouterV1 } from "#/presentation/v1/routes/admin/AdminConfigurationRouterV1";
import { createAdminDriverRouterV1 } from "#/presentation/v1/routes/admin/AdminDriverRouterV1";
import { createAdminVehicleRouterV1 } from "#/presentation/v1/routes/admin/AdminVehicleRouterV1";
import { createDriverRouterV1 } from "#/presentation/v1/routes/driver/DriverRouterV1";
import { createVehicleRouterV1 } from "#/presentation/v1/routes/vehicle/VehicleRouterV1";
import { ConsolaLogger, EventName } from "@sharemyride/shared";
import { NewUserEventHandler } from "#/presentation/v1/event-handlers/NewUserEventHandler";
import { CreateNewPassengerUseCase } from "#/application/use-case/passenger/CreateNewPassengerUseCase";
import { PassengerRepository } from "#/infrastructure/repository/PassengerRepository";

import { PlacesCacheStore } from "#/infrastructure/store/PlacesCacheStore";
import { H3GeoIndexingService } from "#/infrastructure/services/H3GeoIndexingService";
import { TripsRepository } from "#/infrastructure/repository/TripsRepository";
import { BookingsRepository } from "#/infrastructure/repository/BookingsRepository";
import { CreateTripUseCase } from "#/application/use-case/trip/CreateTripUseCase";
import { ListTripsUseCase } from "#/application/use-case/trip/ListTripsUseCase";
import { GetJourneyDetailsUseCase } from "#/application/use-case/trip/GetJourneyDetailsUseCase";
import { NewBookingUseCase } from "#/application/use-case/passenger/NewBookingUseCase";
import { TripControllerV1 } from "#/presentation/v1/controllers/trip/TripControllerV1";
import { BookingControllerV1 } from "#/presentation/v1/controllers/booking/BookingControllerV1";
import { createTripRouterV1 } from "#/presentation/v1/routes/trip/TripRouterV1";
import { createBookingRouterV1 } from "#/presentation/v1/routes/booking/BookingRouterV1";

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
const placesCacheStore = new PlacesCacheStore(redisClient);
const passengerRepository = new PassengerRepository();
const geoIndexingService = new H3GeoIndexingService();
const bookingsRepository = new BookingsRepository(geoIndexingService);
const tripsRepository = new TripsRepository(
  geoIndexingService,
  placesCacheStore,
);

// Driver & User Vehicle Use Cases
const addDriverUseCase = new AddDriverUseCase(
  driverRepository,
  passengerRepository,
);
const updateDriverUseCase = new UpdateDriverUseCase(driverRepository);
const changeDriverStatusUseCase = new ChangeDriverStatusUseCase(
  driverRepository,
);
const getDriverDetailsUseCase = new GetDriverDetailsUseCase(driverRepository);

const addUserVehicleUseCase = new AddUserVehicleUseCase(vehicleRepository);
const updateUserVehicleUseCase = new UpdateUserVehicleUseCase(
  vehicleRepository,
);
const getDriverVehiclesUseCase = new GetDriverVehiclesUseCase(
  vehicleRepository,
);
const createNewPassengerUseCase = new CreateNewPassengerUseCase(
  passengerRepository,
);

const createTripUseCase = new CreateTripUseCase(tripsRepository);
const listTripsUseCase = new ListTripsUseCase(tripsRepository);
const getJourneyDetailsUseCase = new GetJourneyDetailsUseCase(
  tripsRepository,
  pricingRulesRepository,
  configurationStore,
);

// Application Event Handlers
const newUserEventHandler = new NewUserEventHandler(
  consolaLogger,
  createNewPassengerUseCase,
);
const applicationApprovedHandler = new ApplicationApprovedHandler(
  consolaLogger,
  addUserVehicleUseCase,
  addDriverUseCase,
  updateUserVehicleUseCase,
  updateDriverUseCase,
);

const userBlockedHandler = new UserBlockedEventHandler(
  consolaLogger,
  changeDriverStatusUseCase,
);

const userUnblockedHandler = new UserUnblockedEventHandler(
  consolaLogger,
  changeDriverStatusUseCase,
);

// Event Dispatcher & Message Consumer
const eventDispatcher = new EventDispatcher(consolaLogger);
await eventDispatcher.register(EventName.AUTH_USER_SIGNUP, newUserEventHandler);
await eventDispatcher.register(
  EventName.ADMIN_APPROVE_APPLICTION,
  applicationApprovedHandler,
);
await eventDispatcher.register(
  EventName.ADMIN_USER_BLOCKED,
  userBlockedHandler,
);
await eventDispatcher.register(
  EventName.ADMIN_USER_UNBLOCKED,
  userUnblockedHandler,
);

const eventBusInstance = new EventBus(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  eventDispatcher,
);

import { DriverAcceptBookingUseCase } from "#/application/use-case/driver/DriverAcceptBookingUseCase";
import { DriverGetBookingDetailsUseCase } from "#/application/use-case/driver/DriverGetBookingDetailsUseCase";
import { DriverListAllBookingsUseCase } from "#/application/use-case/driver/DriverListAllBookingUseCase";
import { DriverRejectBookingUseCase } from "#/application/use-case/driver/DriverRejectBookingUseCase";

const newBookingUseCase = new NewBookingUseCase(
  bookingsRepository,
  configurationStore,
  pricingRulesRepository,
  tripsRepository,
  eventBusInstance,
  passengerRepository,
  driverRepository,
);

const driverListAllBookingsUseCase = new DriverListAllBookingsUseCase(
  bookingsRepository,
);
const driverGetBookingDetailsUseCase = new DriverGetBookingDetailsUseCase(
  bookingsRepository,
  tripsRepository,
  passengerRepository,
  vehicleRepository,
);
const driverAcceptBookingUseCase = new DriverAcceptBookingUseCase(
  bookingsRepository,
  tripsRepository,
);
const driverRejectBookingUseCase = new DriverRejectBookingUseCase(
  bookingsRepository,
  tripsRepository,
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

const tripControllerV1 = new TripControllerV1(
  consolaLogger,
  createTripUseCase,
  listTripsUseCase,
  getJourneyDetailsUseCase,
);

const bookingControllerV1 = new BookingControllerV1(
  consolaLogger,
  newBookingUseCase,
  driverListAllBookingsUseCase,
  driverGetBookingDetailsUseCase,
  driverAcceptBookingUseCase,
  driverRejectBookingUseCase,
);

// Routers
const adminConfigurationRoutesV1 = createAdminConfigurationRouterV1(
  adminConfigurationControllerV1,
);
const adminDriverRoutesV1 = createAdminDriverRouterV1(adminDriverControllerV1);
const adminVehicleRoutesV1 = createAdminVehicleRouterV1(
  adminVehicleControllerV1,
);

const driverRoutesV1 = createDriverRouterV1(driverControllerV1);
const vehicleRoutesV1 = createVehicleRouterV1(vehicleControllerV1);
const tripRoutesV1 = createTripRouterV1(tripControllerV1);
const bookingRoutesV1 = createBookingRouterV1(bookingControllerV1);

const v1Router = express.Router();
v1Router.use("/admin/trip/config", adminConfigurationRoutesV1);
v1Router.use("/admin/trip/driver", adminDriverRoutesV1);
v1Router.use("/admin/trip/vehicles", adminVehicleRoutesV1);

v1Router.use("/driver", driverRoutesV1);
v1Router.use("/vehicles", vehicleRoutesV1);
v1Router.use("/trips", tripRoutesV1);
v1Router.use("/bookings", bookingRoutesV1);

export const tripServiceRouters = {
  v1: v1Router,
};

export const eventBus = eventBusInstance;

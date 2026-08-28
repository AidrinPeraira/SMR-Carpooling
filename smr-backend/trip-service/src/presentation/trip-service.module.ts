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
import { BookingPaymentSuccessEventHandler } from "#/presentation/v1/event-handlers/BookingPaymentSuccessEventHandler";
import { BookingPaymentFailedEventHandler } from "#/presentation/v1/event-handlers/BookingPaymentFailedEventHandler";
import { CreateNewPassengerUseCase } from "#/application/use-case/passenger/CreateNewPassengerUseCase";
import { BlockPassengerUseCase } from "#/application/use-case/passenger/BlockPassengerUseCase";
import { UnblockPassengerUseCase } from "#/application/use-case/passenger/UnblockPassengerUseCase";
import { PassengerRepository } from "#/infrastructure/repository/PassengerRepository";

import { PlacesCacheStore } from "#/infrastructure/store/PlacesCacheStore";
import { H3GeoIndexingService } from "#/infrastructure/services/H3GeoIndexingService";
import { TripsRepository } from "#/infrastructure/repository/TripsRepository";
import { BookingsRepository } from "#/infrastructure/repository/BookingsRepository";
import { CreateTripUseCase } from "#/application/use-case/trip/CreateTripUseCase";
import { ListTripsUseCase } from "#/application/use-case/trip/ListTripsUseCase";
import { GetJourneyDetailsUseCase } from "#/application/use-case/trip/GetJourneyDetailsUseCase";
import { NewBookingUseCase } from "#/application/use-case/booking/NewBookingUseCase";
import { TripControllerV1 } from "#/presentation/v1/controllers/trip/TripControllerV1";
import { BookingControllerV1 } from "#/presentation/v1/controllers/booking/BookingControllerV1";
import { WebhookControllerV1 } from "#/presentation/v1/controllers/webhook/WebhookControllerV1";
import { createTripRouterV1 } from "#/presentation/v1/routes/trip/TripRouterV1";
import { createBookingRouterV1 } from "#/presentation/v1/routes/booking/BookingRouterV1";
import { createWebhookRouterV1 } from "#/presentation/v1/routes/webhook/WebhookRouterV1";
import { CryptoUIDService } from "#/infrastructure/services/CryptoUIDService";
import { ScheduledJobService } from "#/infrastructure/services/ScheduledJobService";
import { JWTTokenService } from "#/infrastructure/services/JwtTokenService";
import { InitiateBookingPaymentUseCase } from "#/application/use-case/booking/InitiateBookingPaymentUseCase";
import { ConfirmBookingPaymentUseCase } from "#/application/use-case/booking/ConfirmBookingPaymentUseCase";
import { CleanUpBookingPaymentUseCase } from "#/application/use-case/booking/CleanUpBookingPaymentUseCase";
import { CleanUpTripsIndexingUseCase } from "#/application/use-case/trip/CleanUpTripsIndexingUseCase";

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
const geoIndexingService = new H3GeoIndexingService(7);
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
const blockPassengerUseCase = new BlockPassengerUseCase(passengerRepository);
const unblockPassengerUseCase = new UnblockPassengerUseCase(
  passengerRepository,
);

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
  blockPassengerUseCase,
);

const userUnblockedHandler = new UserUnblockedEventHandler(
  consolaLogger,
  changeDriverStatusUseCase,
  unblockPassengerUseCase,
);

// Payment Services & Use Cases
const cryptoUIDService = new CryptoUIDService();
const scheduledJobService = new ScheduledJobService();
const jwtTokenService = new JWTTokenService();

const confirmBookingPaymentUseCase = new ConfirmBookingPaymentUseCase(
  bookingsRepository,
);
const cleanUpBookingPaymentUseCase = new CleanUpBookingPaymentUseCase(
  bookingsRepository,
  tripsRepository,
);
const cleanUpTripsIndexingUseCase = new CleanUpTripsIndexingUseCase(
  tripsRepository,
);
const initiateBookingPaymentUseCase = new InitiateBookingPaymentUseCase(
  bookingsRepository,
  passengerRepository,
  tripsRepository,
  cryptoUIDService,
  scheduledJobService,
  jwtTokenService,
  `${AppConfig.API_GATEWAY_URL}/api/v1/webhook/trips/booking-cleanup`,
);

const bookingPaymentSuccessEventHandler = new BookingPaymentSuccessEventHandler(
  consolaLogger,
  confirmBookingPaymentUseCase,
);
const bookingPaymentFailedEventHandler = new BookingPaymentFailedEventHandler(
  consolaLogger,
  cleanUpBookingPaymentUseCase,
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
await eventDispatcher.register(
  EventName.BOOKING_PAYMENT_SUCCESS,
  bookingPaymentSuccessEventHandler,
);
await eventDispatcher.register(
  EventName.BOOKING_PAYMENT_FAILURE,
  bookingPaymentFailedEventHandler,
);

const eventBusInstance = new EventBus(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  eventDispatcher,
);

const createTripUseCase = new CreateTripUseCase(
  tripsRepository,
  driverRepository,
  eventBusInstance,
);

import { DriverAcceptBookingUseCase } from "#/application/use-case/booking/DriverAcceptBookingUseCase";
import { DriverGetBookingDetailsUseCase } from "#/application/use-case/booking/DriverGetBookingDetailsUseCase";
import { DriverListAllBookingsUseCase } from "#/application/use-case/booking/DriverListAllBookingUseCase";
import { DriverRejectBookingUseCase } from "#/application/use-case/booking/DriverRejectBookingUseCase";
import { GetPassengerBookingDetailsUseCase } from "#/application/use-case/booking/GetPassngerBookingDetailsUseCase";
import { PassengerListBookingsUseCase } from "#/application/use-case/booking/PassengerListBookingsUseCase";
import { WithdrawBookingUseCase } from "#/application/use-case/booking/WithdrawBookingUseCase";
import { CancelBookingUseCase } from "#/application/use-case/booking/CancelBookingUseCase";

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

const passengerListBookingsUseCase = new PassengerListBookingsUseCase(
  bookingsRepository,
);
const getPassengerBookingDetailsUseCase = new GetPassengerBookingDetailsUseCase(
  bookingsRepository,
  tripsRepository,
  driverRepository,
  vehicleRepository,
);
const withdrawBookingUseCase = new WithdrawBookingUseCase(bookingsRepository);
const cancelBookingUseCase = new CancelBookingUseCase(
  bookingsRepository,
  tripsRepository,
  passengerRepository,
  driverRepository,
  eventBusInstance,
);

import { AdminListAllTripsUseCase } from "#/application/use-case/admin/trip/AdminListAllTripsUseCase";
import { AdminGetTripDetailsUseCase } from "#/application/use-case/admin/trip/AdminGetTripDetailsUseCase";
import { AdminListAllBookingsUseCase } from "#/application/use-case/admin/booking/AdminListAllBookingsUseCase";
import { AdminGetBookingDetailsUseCase } from "#/application/use-case/admin/booking/AdminGetBookingDetailsUseCase";
import { AdminTripControllerV1 } from "#/presentation/v1/controllers/admin/AdminTripControllerV1";
import { AdminBookingControllerV1 } from "#/presentation/v1/controllers/admin/AdminBookingControllerV1";
import { createAdminTripRouterV1 } from "#/presentation/v1/routes/admin/AdminTripRouterV1";
import { createAdminBookingRouterV1 } from "#/presentation/v1/routes/admin/AdminBookingRouterV1";

// Admin Trip & Booking Use Cases
const adminListAllTripsUseCase = new AdminListAllTripsUseCase(tripsRepository);
const adminGetTripDetailsUseCase = new AdminGetTripDetailsUseCase(
  tripsRepository,
);
const adminListAllBookingsUseCase = new AdminListAllBookingsUseCase(
  bookingsRepository,
);
const adminGetBookingDetailsUseCase = new AdminGetBookingDetailsUseCase(
  bookingsRepository,
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

const adminTripControllerV1 = new AdminTripControllerV1(
  consolaLogger,
  adminListAllTripsUseCase,
  adminGetTripDetailsUseCase,
);

const adminBookingControllerV1 = new AdminBookingControllerV1(
  consolaLogger,
  adminListAllBookingsUseCase,
  adminGetBookingDetailsUseCase,
);

const driverControllerV1 = new DriverControllerV1(
  consolaLogger,
  getDriverDetailsUseCase,
);

const vehicleControllerV1 = new VehicleControllerV1(
  consolaLogger,
  getDriverVehiclesUseCase,
);

import { DriverGetTripDetailsUseCase } from "#/application/use-case/trip/DriverGetTripDetailsUseCase";
import { DriverListTripsUseCase } from "#/application/use-case/trip/DriverListTripsUseCase";
import { CancelTripUseCase } from "#/application/use-case/trip/CancelTripUseCase";

const driverListTripsUseCase = new DriverListTripsUseCase(tripsRepository);
const driverGetTripDetailsUseCase = new DriverGetTripDetailsUseCase(
  tripsRepository,
);
const cancelTripUseCase = new CancelTripUseCase(
  tripsRepository,
  bookingsRepository,
  driverRepository,
  eventBusInstance,
);

const tripControllerV1 = new TripControllerV1(
  consolaLogger,
  createTripUseCase,
  listTripsUseCase,
  getJourneyDetailsUseCase,
  driverListTripsUseCase,
  driverGetTripDetailsUseCase,
  cancelTripUseCase,
);

const bookingControllerV1 = new BookingControllerV1(
  consolaLogger,
  newBookingUseCase,
  driverListAllBookingsUseCase,
  driverGetBookingDetailsUseCase,
  driverAcceptBookingUseCase,
  driverRejectBookingUseCase,
  passengerListBookingsUseCase,
  getPassengerBookingDetailsUseCase,
  withdrawBookingUseCase,
  initiateBookingPaymentUseCase,
  cancelBookingUseCase,
);

const webhookControllerV1 = new WebhookControllerV1(
  consolaLogger,
  cleanUpBookingPaymentUseCase,
  cleanUpTripsIndexingUseCase,
);

// Routers
const adminConfigurationRoutesV1 = createAdminConfigurationRouterV1(
  adminConfigurationControllerV1,
);
const adminDriverRoutesV1 = createAdminDriverRouterV1(adminDriverControllerV1);
const adminVehicleRoutesV1 = createAdminVehicleRouterV1(
  adminVehicleControllerV1,
);
const adminTripRoutesV1 = createAdminTripRouterV1(adminTripControllerV1);
const adminBookingRoutesV1 = createAdminBookingRouterV1(
  adminBookingControllerV1,
);

const driverRoutesV1 = createDriverRouterV1(driverControllerV1);
const vehicleRoutesV1 = createVehicleRouterV1(vehicleControllerV1);
const tripRoutesV1 = createTripRouterV1(tripControllerV1);
const bookingRoutesV1 = createBookingRouterV1(bookingControllerV1);
const webhookRoutesV1 = createWebhookRouterV1(webhookControllerV1);

const v1Router = express.Router();
v1Router.use("/admin/trip/config", adminConfigurationRoutesV1);
v1Router.use("/admin/trip/driver", adminDriverRoutesV1);
v1Router.use("/admin/trip/vehicles", adminVehicleRoutesV1);
v1Router.use("/admin/trip/trips", adminTripRoutesV1);
v1Router.use("/admin/trip/bookings", adminBookingRoutesV1);

v1Router.use("/driver", driverRoutesV1);
v1Router.use("/vehicles", vehicleRoutesV1);
v1Router.use("/trips", tripRoutesV1);
v1Router.use("/bookings", bookingRoutesV1);
v1Router.use("/webhook/trips", webhookRoutesV1);

export const tripServiceRouters = {
  v1: v1Router,
};

export const eventBus = eventBusInstance;

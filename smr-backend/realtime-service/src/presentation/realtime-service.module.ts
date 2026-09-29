import { AppConfig } from "#/application.config";
import { AddActiveTripUseCase } from "#/application/use-cases/AddActiveTripUseCase";
import { CreateMemberUseCase } from "#/application/use-cases/CreateMemeberUseCase";
import { RemoveActiveTripUseCase } from "#/application/use-cases/RemoveActiveTripUseCase";
import { MemberModel } from "#/infrastructure/database/model/MongoMemberModel";
import { MemberRespository } from "#/infrastructure/repository/MemberRepository";
import { EventBus } from "#/infrastructure/services/EventBus";
import { WinstonLoggerService } from "#/infrastructure/services/LoggerService";
import { DriverCancelTripEventHandler } from "#/presentation/v1/messaging/event-handlers/DriverCancelTripEventHandler";
import { NewBookingEventHandler } from "#/presentation/v1/messaging/event-handlers/NewBookingEventHandler";
import { NewTripEventHandler } from "#/presentation/v1/messaging/event-handlers/NewTripEventHandler";
import { PassengerCancelBookingEventHandler } from "#/presentation/v1/messaging/event-handlers/PassengerCancelBookingEventHandler";
import { UserSignupEventHandler } from "#/presentation/v1/messaging/event-handlers/UserSignupEventHandler";
import { EventDispatcher } from "#/presentation/v1/messaging/EventDispatcher";
import { EventName } from "@sharemyride/shared";

const logger = new WinstonLoggerService();

// Repositories
const memberRepository = new MemberRespository(MemberModel);

// Use Cases
const createMemberUseCase = new CreateMemberUseCase(memberRepository);
const addActiveTripUseCase = new AddActiveTripUseCase(memberRepository);
const removeActiveTripUseCase = new RemoveActiveTripUseCase(memberRepository);

// Messaging
const eventDispatcher = new EventDispatcher(logger);

// Event Handlers
const userSignupEventHandler = new UserSignupEventHandler(
  logger,
  createMemberUseCase,
);

const newBookingEventHandler = new NewBookingEventHandler(
  logger,
  addActiveTripUseCase,
);

const newTripEventHandler = new NewTripEventHandler(
  logger,
  addActiveTripUseCase,
);

const driverCancelTripEventHandler = new DriverCancelTripEventHandler(
  logger,
  removeActiveTripUseCase,
);

const passengerCancelBookingEventHandler =
  new PassengerCancelBookingEventHandler(logger, removeActiveTripUseCase);

await eventDispatcher.register(
  EventName.AUTH_USER_SIGNUP,
  userSignupEventHandler,
);

await eventDispatcher.register(
  EventName.BOOKING_NEW_BOOKING,
  newBookingEventHandler,
);

await eventDispatcher.register(EventName.TRIP_NEW_TRIP, newTripEventHandler);

await eventDispatcher.register(
  EventName.TRIP_CANCELLED_BY_DRIVER,
  driverCancelTripEventHandler,
);

await eventDispatcher.register(
  EventName.BOOKING_CANCELLED_BY_PASSENGER,
  passengerCancelBookingEventHandler,
);

export const eventBus = new EventBus(
  logger,
  AppConfig.RABBITMQ_URL,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  eventDispatcher,
  "smr.realtime.queue",
);

import { ConsolaLogger, EventName } from "@sharemyride/shared";
import { AppConfig } from "#/application.config";
import { MemberModel } from "#/infrastructure/database/models/MongoMemberModel";
import { MemberRespository } from "#/infrastructure/repository/MemberRepository";
import { CreateMemberUseCase } from "#/application/use-cases/members/CreateMemberUseCase";
import { AddActiveTripUseCase } from "#/application/use-cases/members/AddActiveTripUseCase";
import { RemoveActiveTripUseCase } from "#/application/use-cases/members/RemoveActiveTripUseCase";
import { EventDispatcher } from "#/presentation/v1/messaging/EventDispatcher";
import { EventBus } from "#/infrastructure/services/EventBus";
import { UserSignupEventHandler } from "#/presentation/v1/messaging/event-handlers/UserSignupEventHandler";

import { NewBookingEventHandler } from "#/presentation/v1/messaging/event-handlers/NewBookingEventHandler";
import { NewTripEventHandler } from "#/presentation/v1/messaging/event-handlers/NewTripEventHandler";
import { DriverCancelTripEventHandler } from "#/presentation/v1/messaging/event-handlers/DriverCancelTripEventHandler";
import { PassengerCancelBookingEventHandler } from "#/presentation/v1/messaging/event-handlers/PassengerCancelBookingEventHandler";

/**
 * Composition Root for the Communication Service.
 */

const consolaLogger = new ConsolaLogger();

// Repositories
const memberRepository = new MemberRespository(MemberModel);

// Use Cases
const createMemberUseCase = new CreateMemberUseCase(memberRepository);
const addActiveTripUseCase = new AddActiveTripUseCase(memberRepository);
const removeActiveTripUseCase = new RemoveActiveTripUseCase(memberRepository);

// Messaging
const eventDispatcher = new EventDispatcher(consolaLogger);

// Event Handlers
const userSignupEventHandler = new UserSignupEventHandler(
  consolaLogger,
  createMemberUseCase,
);

const newBookingEventHandler = new NewBookingEventHandler(
  consolaLogger,
  addActiveTripUseCase,
);

const newTripEventHandler = new NewTripEventHandler(
  consolaLogger,
  addActiveTripUseCase,
);

const driverCancelTripEventHandler = new DriverCancelTripEventHandler(
  consolaLogger,
  removeActiveTripUseCase,
);

const passengerCancelBookingEventHandler = new PassengerCancelBookingEventHandler(
  consolaLogger,
  removeActiveTripUseCase,
);

await eventDispatcher.register(
  EventName.AUTH_USER_SIGNUP,
  userSignupEventHandler,
);

await eventDispatcher.register(
  EventName.BOOKING_NEW_BOOKING,
  newBookingEventHandler,
);

await eventDispatcher.register(
  EventName.TRIP_NEW_TRIP,
  newTripEventHandler,
);

await eventDispatcher.register(
  EventName.TRIP_CANCELLED_BY_DRIVER,
  driverCancelTripEventHandler,
);

await eventDispatcher.register(
  EventName.BOOKING_CANCELLED_BY_PASSENGER,
  passengerCancelBookingEventHandler,
);

export const eventBus = new EventBus(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  eventDispatcher,
  "smr.communications.queue",
);

export {
  createMemberUseCase,
  addActiveTripUseCase,
  removeActiveTripUseCase,
};

import { AppConfig } from "#/application.config";
import { AddChatMemberUseCase } from "#/application/use-cases/chat/AddChatMemberUseCase";
import { CloseChatUseCase } from "#/application/use-cases/chat/CloseChatUseCase";
import { CreateNewChatUseCase } from "#/application/use-cases/chat/CreateNewChatUseCase";
import { RemoveChatMembersUseCase } from "#/application/use-cases/chat/RemoveChatMembersUseCase";
import { AddActiveTripUseCase } from "#/application/use-cases/members/AddActiveTripUseCase";
import { CreateMemberUseCase } from "#/application/use-cases/members/CreateMemeberUseCase";
import { RemoveActiveTripUseCase } from "#/application/use-cases/members/RemoveActiveTripUseCase";
import { ChatModel } from "#/infrastructure/database/model/MongoChatModel";
import { MemberModel } from "#/infrastructure/database/model/MongoMemberModel";
import { ChatRepository } from "#/infrastructure/repository/ChatRepository";
import { MemberRespository } from "#/infrastructure/repository/MemberRepository";
import { CryptoUIDService } from "#/infrastructure/services/CryptoUIDService";
import { EventBus } from "#/infrastructure/services/EventBus";
import { SocketIOEmitter } from "#/infrastructure/sockets/ChatSocketEmitter";
import { DriverCancelTripEventHandler } from "#/presentation/v1/messaging/event-handlers/DriverCancelTripEventHandler";
import { NewBookingEventHandler } from "#/presentation/v1/messaging/event-handlers/NewBookingEventHandler";
import { NewTripEventHandler } from "#/presentation/v1/messaging/event-handlers/NewTripEventHandler";
import { PassengerCancelBookingEventHandler } from "#/presentation/v1/messaging/event-handlers/PassengerCancelBookingEventHandler";
import { UserSignupEventHandler } from "#/presentation/v1/messaging/event-handlers/UserSignupEventHandler";
import { EventDispatcher } from "#/presentation/v1/messaging/EventDispatcher";
import { ChatSocketHandler } from "#/presentation/v1/sockets/handlers/ChatSocketHandler";
import { createSocketServer } from "#/presentation/v1/sockets/SocketServer";
import { EventName, ILogger } from "@sharemyride/shared";
import { Server } from "node:http";

/**
 * Composition Root for the Communication Service.
 */
export async function setUpRealtimeModule(httpServer: Server, logger: ILogger) {
  // Repositories
  const memberRepository = new MemberRespository(MemberModel);
  const chatRepository = new ChatRepository(ChatModel);

  //infra services
  const uidGenereator = new CryptoUIDService();

  // Use Cases
  const createMemberUseCase = new CreateMemberUseCase(memberRepository);
  const addActiveTripUseCase = new AddActiveTripUseCase(memberRepository);
  const removeActiveTripUseCase = new RemoveActiveTripUseCase(memberRepository);

  const addChatMemberUseCase = new AddChatMemberUseCase(chatRepository);
  const closeChatUseCase = new CloseChatUseCase(chatRepository);
  const createNewChatUseCase = new CreateNewChatUseCase(
    chatRepository,
    uidGenereator,
  );
  const removeChatMembersUseCase = new RemoveChatMembersUseCase(chatRepository);

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
    addChatMemberUseCase,
  );
  const newTripEventHandler = new NewTripEventHandler(
    logger,
    addActiveTripUseCase,
    createNewChatUseCase,
    addChatMemberUseCase,
  );
  const driverCancelTripEventHandler = new DriverCancelTripEventHandler(
    logger,
    removeActiveTripUseCase,
    closeChatUseCase,
  );
  const passengerCancelBookingEventHandler =
    new PassengerCancelBookingEventHandler(
      logger,
      removeActiveTripUseCase,
      removeChatMembersUseCase,
    );

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

  const eventBus = new EventBus(
    logger,
    AppConfig.RABBITMQ_URL,
    AppConfig.RABBITMQ_EXCHANGE_NAME,
    eventDispatcher,
    "smr.realtime.queue",
  );

  const chatSocketHandler = new ChatSocketHandler("/chat", logger);

  const io = await createSocketServer(httpServer, [chatSocketHandler], logger);

  const chatSocketEmitter = new SocketIOEmitter(
    io,
    chatSocketHandler.nameSpace,
  );

  return { eventBus };
}

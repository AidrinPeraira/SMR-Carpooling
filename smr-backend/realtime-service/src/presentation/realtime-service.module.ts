import { AppConfig } from "#/application.config";
import { AddChatMemberUseCase } from "#/application/use-cases/chat/AddChatMemberUseCase";
import { CloseChatUseCase } from "#/application/use-cases/chat/CloseChatUseCase";
import { CreateNewChatUseCase } from "#/application/use-cases/chat/CreateNewChatUseCase";
import { RemoveChatMembersUseCase } from "#/application/use-cases/chat/RemoveChatMembersUseCase";
import { JoinTripChatUseCase } from "#/application/use-cases/chat-message/JoinTripChatUseCase";
import { LeaveTripChatUseCase } from "#/application/use-cases/chat-message/LeaveTripChatUseCase";
import { SendMessageUseCase } from "#/application/use-cases/chat-message/SendMessageUseCase";
import { SyncChatMessagesUseCase } from "#/application/use-cases/chat-message/SyncChatMessagesUseCase";
import { AddActiveTripUseCase } from "#/application/use-cases/members/AddActiveTripUseCase";
import { CreateMemberUseCase } from "#/application/use-cases/members/CreateMemeberUseCase";
import { RemoveActiveTripUseCase } from "#/application/use-cases/members/RemoveActiveTripUseCase";
import { AcceptCallUseCase } from "#/application/use-cases/call/AcceptCallUseCase";
import { EndCallUseCase } from "#/application/use-cases/call/EndCallUseCase";
import { HandleCallTimeoutUseCase } from "#/application/use-cases/call/HandleCallTimeoutUseCase";
import { InitiateCallUseCase } from "#/application/use-cases/call/InitiateCallUseCase";
import { RejectCallUseCase } from "#/application/use-cases/call/RejectCallUseCase";
import { RelayCallSignalUseCase } from "#/application/use-cases/call/RelayCallSignalUseCase";
import { CallSessionModel } from "#/infrastructure/database/model/MongoCallSessionModel";
import { ChatModel } from "#/infrastructure/database/model/MongoChatModel";
import { MemberModel } from "#/infrastructure/database/model/MongoMemberModel";
import { CallSessionRepository } from "#/infrastructure/repository/CallSessionRepository";
import { ChatRepository } from "#/infrastructure/repository/ChatRepository";
import { MemberRespository } from "#/infrastructure/repository/MemberRepository";
import { MessageRepository } from "#/infrastructure/repository/MessageRepository";
import { CryptoUIDService } from "#/infrastructure/services/CryptoUIDService";
import { EventBus } from "#/infrastructure/services/EventBus";
import { SocketIOEmitter } from "#/infrastructure/sockets/SocketIOEmitter";
import { ChatControllerV1 } from "#/presentation/v1/http/controllers/ChatControllerV1";
import { createChatRouterV1 } from "#/presentation/v1/http/routes/ChatRouterV1";
import { DriverCancelTripEventHandler } from "#/presentation/v1/messaging/event-handlers/DriverCancelTripEventHandler";
import { NewBookingEventHandler } from "#/presentation/v1/messaging/event-handlers/NewBookingEventHandler";
import { NewTripEventHandler } from "#/presentation/v1/messaging/event-handlers/NewTripEventHandler";
import { PassengerCancelBookingEventHandler } from "#/presentation/v1/messaging/event-handlers/PassengerCancelBookingEventHandler";
import { UserSignupEventHandler } from "#/presentation/v1/messaging/event-handlers/UserSignupEventHandler";
import { EventDispatcher } from "#/presentation/v1/messaging/EventDispatcher";
import { CallSocketHandler } from "#/presentation/v1/sockets/handlers/CallSocketHandler";
import { ChatSocketHandler } from "#/presentation/v1/sockets/handlers/ChatSocketHandler";
import {
  createSocketServer,
  registerSocketHandlers,
} from "#/presentation/v1/sockets/SocketServer";
import { EventName, ILogger } from "@sharemyride/shared";
import { Server } from "node:http";
import express from "express";

/**
 * Composition Root for the Communication Service.
 */
export async function setUpRealtimeModule(httpServer: Server, logger: ILogger) {
  // Repositories
  const memberRepository = new MemberRespository(MemberModel);
  const chatRepository = new ChatRepository(ChatModel);
  const messageRepository = new MessageRepository();
  const callSessionRepository = new CallSessionRepository(CallSessionModel);

  //infra services
  const uidGenereator = new CryptoUIDService();

  // Use Cases — members
  const createMemberUseCase = new CreateMemberUseCase(memberRepository);
  const addActiveTripUseCase = new AddActiveTripUseCase(memberRepository);
  const removeActiveTripUseCase = new RemoveActiveTripUseCase(memberRepository);

  // Use Cases — chat lifecycle
  const addChatMemberUseCase = new AddChatMemberUseCase(chatRepository);
  const closeChatUseCase = new CloseChatUseCase(chatRepository);
  const createNewChatUseCase = new CreateNewChatUseCase(
    chatRepository,
    uidGenereator,
  );
  const removeChatMembersUseCase = new RemoveChatMembersUseCase(chatRepository);

  // Use Cases — chat messaging
  const syncChatMessagesUseCase = new SyncChatMessagesUseCase(
    chatRepository,
    messageRepository,
  );

  // Socket server — create first so we can build the emitter
  const io = await createSocketServer(httpServer);

  const chatSocketEmitter = new SocketIOEmitter(io, "/chat");
  const callSocketEmitter = new SocketIOEmitter(io, "/call");

  const joinTripChatUseCase = new JoinTripChatUseCase(
    memberRepository,
    chatRepository,
    chatSocketEmitter,
  );
  const leaveTripChatUseCase = new LeaveTripChatUseCase(chatSocketEmitter);
  const sendMessageUseCase = new SendMessageUseCase(
    messageRepository,
    chatSocketEmitter,
  );

  // Use Cases — call
  const initiateCallUseCase = new InitiateCallUseCase(
    memberRepository,
    callSessionRepository,
    uidGenereator,
    callSocketEmitter,
  );
  const acceptCallUseCase = new AcceptCallUseCase(
    callSessionRepository,
    callSocketEmitter,
  );
  const rejectCallUseCase = new RejectCallUseCase(
    callSessionRepository,
    callSocketEmitter,
  );
  const handleCallTimeoutUseCase = new HandleCallTimeoutUseCase(
    callSessionRepository,
    callSocketEmitter,
  );
  const endCallUseCase = new EndCallUseCase(
    callSessionRepository,
    callSocketEmitter,
  );
  const relayCallSignalUseCase = new RelayCallSignalUseCase(
    callSessionRepository,
    callSocketEmitter,
  );

  // Socket handlers — created after use cases, registered after creation
  const chatSocketHandler = new ChatSocketHandler(
    "/chat",
    logger,
    joinTripChatUseCase,
    leaveTripChatUseCase,
    sendMessageUseCase,
  );

  const callSocketHandler = new CallSocketHandler(
    "/call",
    logger,
    initiateCallUseCase,
    acceptCallUseCase,
    rejectCallUseCase,
    handleCallTimeoutUseCase,
    endCallUseCase,
    relayCallSignalUseCase,
  );

  await registerSocketHandlers(io, [chatSocketHandler, callSocketHandler], logger);

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

  // HTTP controllers
  const chatController = new ChatControllerV1(logger, syncChatMessagesUseCase);
  const chatRouterV1 = createChatRouterV1(chatController);

  const v1Router = express.Router();
  v1Router.use("/chat", chatRouterV1);

  return {
    eventBus,
    v1Router,
  };
}

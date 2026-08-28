import { ConsolaLogger, EventName } from "@sharemyride/shared";
import { AppConfig } from "#/application.config";
import { MemberModel } from "#/infrastructure/database/models/MongoMemberModel";
import { MemberRespository } from "#/infrastructure/repository/MemberRepository";
import { CreateMemberUseCase } from "#/application/use-cases/members/CreateMemberUseCase";
import { EventDispatcher } from "#/presentation/v1/messaging/EventDispatcher";
import { EventBus } from "#/infrastructure/services/EventBus";
import { UserSignupEventHandler } from "#/presentation/v1/messaging/event-handlers/UserSignupEventHandler";

/**
 * Composition Root for the Communication Service.
 */

const consolaLogger = new ConsolaLogger();

// Repositories
const memberRepository = new MemberRespository(MemberModel);

// Use Cases
const createMemberUseCase = new CreateMemberUseCase(memberRepository);

// Messaging
const eventDispatcher = new EventDispatcher(consolaLogger);

// Event Handlers
const userSignupEventHandler = new UserSignupEventHandler(
  consolaLogger,
  createMemberUseCase,
);

await eventDispatcher.register(
  EventName.AUTH_USER_SIGNUP,
  userSignupEventHandler,
);

export const eventBus = new EventBus(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  eventDispatcher,
  "smr.communications.queue",
);

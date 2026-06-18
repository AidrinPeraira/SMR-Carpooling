/*
 * This si the composition file for notification service
 */

import { AppConfig } from "#/application.config";
import { SendSignupVerificationMailUseCase } from "#/application/use-case/SendSignupVerificationMailUseCase";
import { RabbitMQConsumer } from "#/infrastructure/services/RabbitMQConsumer";
import { ResendEmailService } from "#/infrastructure/services/ResendEMailService";
import { UserSignupHandler } from "#/presentation/event-handlers/UserSignupHandler";
import { EventDispatcher } from "#/presentation/messaging/EventDispatcher";
import { ConsolaLogger, EventName } from "@smr/shared";

const consolaLogger = new ConsolaLogger();

const resendMailService = new ResendEmailService(consolaLogger);

const sendSignUpVerificationEmailUseCase =
  new SendSignupVerificationMailUseCase(resendMailService);

const userSignupHandler = new UserSignupHandler(
  sendSignUpVerificationEmailUseCase,
);

const eventDispatcher = new EventDispatcher(consolaLogger);
await eventDispatcher.register(EventName.AUTH_USER_SIGNUP, userSignupHandler);

const rabbitMqConsumer = new RabbitMQConsumer(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  eventDispatcher,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  AppConfig.RABBITMQ_QUEUE_NAME,
);

export const messageConsumer = rabbitMqConsumer;

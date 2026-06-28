/*
 * This si the composition file for notification service
 */

import { AppConfig } from "#/application.config";
import { SendSignupVerificationMailUseCase } from "#/application/use-case/SendSignupVerificationMailUseCase";
import { SendPasswordChangeRequestMailUseCase } from "#/application/use-case/SendPasswordChangeRequestMailUseCase";
import { SendPasswordChangedMailUseCase } from "#/application/use-case/SendPasswordChangedMailUseCase";
import { RabbitMQConsumer } from "#/infrastructure/services/RabbitMQConsumer";
import { ResendEmailService } from "#/infrastructure/services/ResendEMailService";
import { UserSignupHandler } from "#/presentation/event-handlers/UserSignupHandler";
import { PasswordChangeRequestHandler } from "#/presentation/event-handlers/PasswordChangeRequestHandler";
import { PasswordChangedHandler } from "#/presentation/event-handlers/PasswordChangedHandler";
import { EventDispatcher } from "#/presentation/messaging/EventDispatcher";
import { ConsolaLogger, EventName } from "@smr/shared";

const consolaLogger = new ConsolaLogger();

const resendMailService = new ResendEmailService(consolaLogger);

const sendSignUpVerificationEmailUseCase =
  new SendSignupVerificationMailUseCase(resendMailService);

const sendPasswordChangeRequestMailUseCase =
  new SendPasswordChangeRequestMailUseCase(resendMailService);

const sendPasswordChangedMailUseCase = new SendPasswordChangedMailUseCase(
  resendMailService,
);

const userSignupHandler = new UserSignupHandler(
  consolaLogger,
  sendSignUpVerificationEmailUseCase,
);

const passwordChangeRequestHandler = new PasswordChangeRequestHandler(
  consolaLogger,
  sendPasswordChangeRequestMailUseCase,
);

const passwordChangedHandler = new PasswordChangedHandler(
  consolaLogger,
  sendPasswordChangedMailUseCase,
);

const eventDispatcher = new EventDispatcher(consolaLogger);
await eventDispatcher.register(EventName.AUTH_USER_SIGNUP, userSignupHandler);
await eventDispatcher.register(
  EventName.AUTH_USER_CHANGE_PASSWORD_REQUEST,
  passwordChangeRequestHandler,
);
await eventDispatcher.register(
  EventName.AUTH_USER_CHANGE_PASSWORD_CHANGED,
  passwordChangedHandler,
);

const rabbitMqConsumer = new RabbitMQConsumer(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  eventDispatcher,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  AppConfig.RABBITMQ_QUEUE_NAME,
);

export const messageConsumer = rabbitMqConsumer;

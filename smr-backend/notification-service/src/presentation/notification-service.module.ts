/*
 * This is the composition file for notification service
 */

import { AppConfig } from "#/application.config";
import { SendApplicationApprovedMailUseCase } from "#/application/use-case/SendApplicationApprovedMailUseCase";
import { SendApplicationRejectedMailUseCase } from "#/application/use-case/SendApplicationRejectedMailUseCase";
import { SendApplicationReturnedMailUseCase } from "#/application/use-case/SendApplicationReturnedMailUseCase";
import { SendPasswordChangeRequestMailUseCase } from "#/application/use-case/SendPasswordChangeRequestMailUseCase";
import { SendPasswordChangedMailUseCase } from "#/application/use-case/SendPasswordChangedMailUseCase";
import { SendSignupVerificationMailUseCase } from "#/application/use-case/SendSignupVerificationMailUseCase";
import { SendNewBookingEmailUseCase } from "#/application/use-case/SendNewBookingEmailUseCase";
import { RabbitMQConsumer } from "#/infrastructure/services/RabbitMQConsumer";
import { ResendEmailService } from "#/infrastructure/services/ResendEMailService";
import { ApplicationApprovedHandler } from "#/presentation/event-handlers/ApplicationApprovedHandler";
import { ApplicationRejectedHandler } from "#/presentation/event-handlers/ApplicationRejectedHandler";
import { ApplicationReturnedHandler } from "#/presentation/event-handlers/ApplicationReturnedHandler";
import { NewBookingHandler } from "#/presentation/event-handlers/NewBookingHandler";
import { PasswordChangeRequestHandler } from "#/presentation/event-handlers/PasswordChangeRequestHandler";
import { PasswordChangedHandler } from "#/presentation/event-handlers/PasswordChangedHandler";
import { UserSignupHandler } from "#/presentation/event-handlers/UserSignupHandler";
import { EventDispatcher } from "#/presentation/messaging/EventDispatcher";
import { ConsolaLogger, EventName } from "@sharemyride/shared";

const consolaLogger = new ConsolaLogger();

const resendMailService = new ResendEmailService(consolaLogger);

const sendSignUpVerificationEmailUseCase =
  new SendSignupVerificationMailUseCase(resendMailService);

const sendPasswordChangeRequestMailUseCase =
  new SendPasswordChangeRequestMailUseCase(resendMailService);

const sendPasswordChangedMailUseCase = new SendPasswordChangedMailUseCase(
  resendMailService,
);

const sendApplicationApprovedMailUseCase =
  new SendApplicationApprovedMailUseCase(resendMailService);

const sendApplicationRejectedMailUseCase =
  new SendApplicationRejectedMailUseCase(resendMailService);

const sendApplicationReturnedMailUseCase =
  new SendApplicationReturnedMailUseCase(resendMailService);

const sendNewBookingEmailUseCase = new SendNewBookingEmailUseCase(
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

const applicationApprovedHandler = new ApplicationApprovedHandler(
  consolaLogger,
  sendApplicationApprovedMailUseCase,
);

const applicationRejectedHandler = new ApplicationRejectedHandler(
  consolaLogger,
  sendApplicationRejectedMailUseCase,
);

const applicationReturnedHandler = new ApplicationReturnedHandler(
  consolaLogger,
  sendApplicationReturnedMailUseCase,
);

const newBookingHandler = new NewBookingHandler(
  consolaLogger,
  sendNewBookingEmailUseCase,
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
await eventDispatcher.register(
  EventName.ADMIN_APPROVE_APPLICTION,
  applicationApprovedHandler,
);
await eventDispatcher.register(
  EventName.ADMIN_REJECT_APPLICATION,
  applicationRejectedHandler,
);
await eventDispatcher.register(
  EventName.ADMIN_RETURN_APPLICTION,
  applicationReturnedHandler,
);
await eventDispatcher.register(
  EventName.BOOKING_NEW_BOOKING,
  newBookingHandler,
);

const rabbitMqConsumer = new RabbitMQConsumer(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  eventDispatcher,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  AppConfig.RABBITMQ_QUEUE_NAME,
);

export const messageConsumer = rabbitMqConsumer;

/*
 * This is the composition file for notification service
 */

import { AppConfig } from "#/application.config";
import { SendApplicationApprovedMailUseCase } from "#/application/use-case/application/SendApplicationApprovedMailUseCase";
import { SendApplicationRejectedMailUseCase } from "#/application/use-case/application/SendApplicationRejectedMailUseCase";
import { SendApplicationReturnedMailUseCase } from "#/application/use-case/application/SendApplicationReturnedMailUseCase";
import { SendPasswordChangeRequestMailUseCase } from "#/application/use-case/auth/SendPasswordChangeRequestMailUseCase";
import { SendPasswordChangedMailUseCase } from "#/application/use-case/auth/SendPasswordChangedMailUseCase";
import { SendSignupVerificationMailUseCase } from "#/application/use-case/auth/SendSignupVerificationMailUseCase";
import { SendNewBookingEmailUseCase } from "#/application/use-case/booking/SendNewBookingEmailUseCase";
import { SendBookingPaymentSuccessMailUseCase } from "#/application/use-case/booking/SendBookingPaymentSuccessMailUseCase";
import { SendBookingPaymentFailedMailUseCase } from "#/application/use-case/booking/SendBookingPaymentFailedMailUseCase";
import { SendBookingCancellationEmailUseCase } from "#/application/use-case/booking/SendBookingCancellationEmailUseCase";
import { SendTripCancellationEmailsUseCase } from "#/application/use-case/trip/SendTripCancellationEmailsUseCase";
import { RabbitMQConsumer } from "#/infrastructure/services/RabbitMQConsumer";
import { ResendEmailService } from "#/infrastructure/services/ResendEMailService";
import { ApplicationEmailTemplateFactory } from "#/infrastructure/templates/ApplicationEmailTemplateFactory";
import { AuthEmailTemplateFactory } from "#/infrastructure/templates/AuthEmailTemplateFactory";
import { BookingEmailTemplateFactory } from "#/infrastructure/templates/BookingEmailTemplateFactory";
import { TripEmailTemplateFactory } from "#/infrastructure/templates/TripEmailTemplateFactory";
import { ApplicationApprovedHandler } from "#/presentation/event-handlers/ApplicationApprovedHandler";
import { ApplicationRejectedHandler } from "#/presentation/event-handlers/ApplicationRejectedHandler";
import { ApplicationReturnedHandler } from "#/presentation/event-handlers/ApplicationReturnedHandler";
import { NewBookingHandler } from "#/presentation/event-handlers/NewBookingHandler";
import { BookingPaymentSuccessHandler } from "#/presentation/event-handlers/BookingPaymentSuccessHandler";
import { BookingPaymentFailedHandler } from "#/presentation/event-handlers/BookingPaymentFailedHandler";
import { PasswordChangeRequestHandler } from "#/presentation/event-handlers/PasswordChangeRequestHandler";
import { PasswordChangedHandler } from "#/presentation/event-handlers/PasswordChangedHandler";
import { BookingCancellationHandler } from "#/presentation/event-handlers/BookingCancellationHandler";
import { TripCancellationEventHandler } from "#/presentation/event-handlers/TripCancelationEventHandler";
import { UserSignupHandler } from "#/presentation/event-handlers/UserSignupHandler";
import { EventDispatcher } from "#/presentation/messaging/EventDispatcher";
import { ConsolaLogger, EventName } from "@sharemyride/shared";

const consolaLogger = new ConsolaLogger();

const resendMailService = new ResendEmailService(consolaLogger);

const bookingEmailTemplateFactory = new BookingEmailTemplateFactory();
const applicationEmailTemplateFactory = new ApplicationEmailTemplateFactory();
const authEmailTemplateFactory = new AuthEmailTemplateFactory();
const tripEmailTemplateFactory = new TripEmailTemplateFactory();

const sendSignUpVerificationEmailUseCase =
  new SendSignupVerificationMailUseCase(resendMailService, authEmailTemplateFactory);

const sendPasswordChangeRequestMailUseCase =
  new SendPasswordChangeRequestMailUseCase(resendMailService, authEmailTemplateFactory);

const sendPasswordChangedMailUseCase = new SendPasswordChangedMailUseCase(
  resendMailService,
  authEmailTemplateFactory,
);

const sendApplicationApprovedMailUseCase =
  new SendApplicationApprovedMailUseCase(resendMailService, applicationEmailTemplateFactory);

const sendApplicationRejectedMailUseCase =
  new SendApplicationRejectedMailUseCase(resendMailService, applicationEmailTemplateFactory);

const sendApplicationReturnedMailUseCase =
  new SendApplicationReturnedMailUseCase(resendMailService, applicationEmailTemplateFactory);

const sendNewBookingEmailUseCase = new SendNewBookingEmailUseCase(
  resendMailService,
  bookingEmailTemplateFactory,
);

const sendBookingPaymentSuccessMailUseCase =
  new SendBookingPaymentSuccessMailUseCase(resendMailService, bookingEmailTemplateFactory);

const sendBookingPaymentFailedMailUseCase =
  new SendBookingPaymentFailedMailUseCase(resendMailService, bookingEmailTemplateFactory);

const sendBookingCancellationEmailUseCase =
  new SendBookingCancellationEmailUseCase(resendMailService, bookingEmailTemplateFactory);

const sendTripCancellationEmailsUseCase =
  new SendTripCancellationEmailsUseCase(resendMailService, tripEmailTemplateFactory);

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

const bookingPaymentSuccessHandler = new BookingPaymentSuccessHandler(
  consolaLogger,
  sendBookingPaymentSuccessMailUseCase,
);

const bookingPaymentFailedHandler = new BookingPaymentFailedHandler(
  consolaLogger,
  sendBookingPaymentFailedMailUseCase,
);

const bookingCancellationHandler = new BookingCancellationHandler(
  consolaLogger,
  sendBookingCancellationEmailUseCase,
);

const tripCancellationEventHandler = new TripCancellationEventHandler(
  consolaLogger,
  sendTripCancellationEmailsUseCase,
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
await eventDispatcher.register(
  EventName.BOOKING_PAYMENT_SUCCESS,
  bookingPaymentSuccessHandler,
);
await eventDispatcher.register(
  EventName.BOOKING_PAYMENT_FAILURE,
  bookingPaymentFailedHandler,
);
await eventDispatcher.register(
  EventName.BOOKING_CANCELLED_BY_PASSENGER,
  bookingCancellationHandler,
);
await eventDispatcher.register(
  EventName.TRIP_CANCELLED_BY_DRIVER,
  tripCancellationEventHandler,
);

const rabbitMqConsumer = new RabbitMQConsumer(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  eventDispatcher,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  AppConfig.RABBITMQ_QUEUE_NAME,
);

export const messageConsumer = rabbitMqConsumer;

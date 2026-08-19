import express from "express";
import { AppConfig } from "#/application.config";
import { CreateBookingPaymentOrderUseCase } from "#/application/use-cases/payment/CreateBookingPaymentOrderUseCase";
import { VerifyBookingPaymentUseCase } from "#/application/use-cases/payment/VerifyBookingPaymentUseCase";
import { BlockCustomerUseCase } from "#/application/use-cases/customer/BlockCustomerUseCase";
import { NewCustomerUseCase } from "#/application/use-cases/customer/NewCustomerUseCase";
import { UnblockCustomerUseCase } from "#/application/use-cases/customer/UnblockCustomerUseCase";
import { CreateWalletUseCase } from "#/application/use-cases/wallet/CreateWalletUseCase";
import { MongoBookingPaymentRepository } from "#/infrastructure/repository/MongoBookingPaymentRepository";
import { MongoCustomerRepository } from "#/infrastructure/repository/MongoCustomerRepository";
import { MongoTransactionRepository } from "#/infrastructure/repository/MongoTransactionRepository";
import { MongoWalletRepository } from "#/infrastructure/repository/MongoWalletRepository";
import { MongoWalletTransactionRepository } from "#/infrastructure/repository/MongoWalletTransactionRepository";
import { CryptoUIDService } from "#/infrastructure/services/CryptoUIDService";
import { EventBus } from "#/infrastructure/services/EventBus";
import { JWTTokenService } from "#/infrastructure/services/JwtTokenService";
import { RazorPayPaymentProvider } from "#/infrastructure/services/RazorPayPaymentProvider";
import { PaymentControllerV1 } from "#/presentation/v1/controllers/PaymentControllerV1";
import { NewUserEventHandler } from "#/presentation/v1/event-handlers/NewUserEventHandler";
import { UserBlockedEventHandler } from "#/presentation/v1/event-handlers/UserBlockedEventHandler";
import { UserUnblockedEventHandler } from "#/presentation/v1/event-handlers/UserUnblockedEventHandler";
import { EventDispatcher } from "#/presentation/v1/messaging/EventDispatcher";
import { createPaymentRouterV1 } from "#/presentation/v1/routes/PaymentRouterV1";
import { ConsolaLogger, EventName } from "@sharemyride/shared";

// Logger
const consolaLogger = new ConsolaLogger();

// Infrastructure Repositories & Services
const customerRepository = new MongoCustomerRepository();
const walletRepository = new MongoWalletRepository();
const walletTransactionRepository = new MongoWalletTransactionRepository();
const bookingPaymentRepository = new MongoBookingPaymentRepository();
const transactionRepository = new MongoTransactionRepository();

const cryptoUIDService = new CryptoUIDService();
const jwtTokenService = new JWTTokenService();
const razorPayPaymentProvider = new RazorPayPaymentProvider();

// Event Dispatcher & Message Consumer Setup
const eventDispatcher = new EventDispatcher(consolaLogger);

// Customer & Wallet Use Cases
const newCustomerUseCase = new NewCustomerUseCase(customerRepository);
const blockCustomerUseCase = new BlockCustomerUseCase(customerRepository);
const unblockCustomerUseCase = new UnblockCustomerUseCase(customerRepository);
const createWalletUseCase = new CreateWalletUseCase(
  walletRepository,
  cryptoUIDService,
);

const newUserEventHandler = new NewUserEventHandler(
  consolaLogger,
  newCustomerUseCase,
  createWalletUseCase,
);
const userBlockedEventHandler = new UserBlockedEventHandler(
  consolaLogger,
  blockCustomerUseCase,
);
const userUnblockedEventHandler = new UserUnblockedEventHandler(
  consolaLogger,
  unblockCustomerUseCase,
);

await eventDispatcher.register(
  EventName.AUTH_USER_SIGNUP,
  newUserEventHandler,
);
await eventDispatcher.register(
  EventName.ADMIN_USER_BLOCKED,
  userBlockedEventHandler,
);
await eventDispatcher.register(
  EventName.ADMIN_USER_UNBLOCKED,
  userUnblockedEventHandler,
);

const eventBusInstance = new EventBus(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  eventDispatcher,
  "smr.payments.queue",
);

// Payment Use Cases
const createBookingPaymentOrderUseCase = new CreateBookingPaymentOrderUseCase(
  bookingPaymentRepository,
  jwtTokenService,
  razorPayPaymentProvider,
);

const verifyBookingPaymentUseCase = new VerifyBookingPaymentUseCase(
  bookingPaymentRepository,
  transactionRepository,
  customerRepository,
  eventBusInstance,
  razorPayPaymentProvider,
  cryptoUIDService,
);

// Payment Controller & Router
const paymentControllerV1 = new PaymentControllerV1(
  consolaLogger,
  createBookingPaymentOrderUseCase,
  verifyBookingPaymentUseCase,
);

const paymentRouterV1 = createPaymentRouterV1(paymentControllerV1);

// Routers setup
const v1Router = express.Router();
v1Router.use("/payments", paymentRouterV1);

export const paymentServiceRouters = {
  v1: v1Router,
};

export const eventBus = eventBusInstance;
export const customerRepo = customerRepository;
export const walletRepo = walletRepository;
export const walletTransactionRepo = walletTransactionRepository;
export const bookingPaymentRepo = bookingPaymentRepository;
export const transactionRepo = transactionRepository;
export const uidService = cryptoUIDService;
export const walletUseCase = createWalletUseCase;

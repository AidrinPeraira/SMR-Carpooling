import { AppConfig } from "#/application.config";
import { BlockCustomerUseCase } from "#/application/use-cases/customer/BlockCustomerUseCase";
import { NewCustomerUseCase } from "#/application/use-cases/customer/NewCustomerUseCase";
import { UnblockCustomerUseCase } from "#/application/use-cases/customer/UnblockCustomerUseCase";
import { CreateWalletUseCase } from "#/application/use-cases/wallet/CreateWalletUseCase";
import { MongoCustomerRepository } from "#/infrastructure/repository/MongoCustomerRepository";
import { MongoWalletRepository } from "#/infrastructure/repository/MongoWalletRepository";
import { MongoWalletTransactionRepository } from "#/infrastructure/repository/MongoWalletTransactionRepository";
import { CryptoUIDService } from "#/infrastructure/services/CryptoUIDService";
import { EventBus } from "#/infrastructure/services/EventBus";
import { NewUserEventHandler } from "#/presentation/v1/event-handlers/NewUserEventHandler";
import { UserBlockedEventHandler } from "#/presentation/v1/event-handlers/UserBlockedEventHandler";
import { UserUnblockedEventHandler } from "#/presentation/v1/event-handlers/UserUnblockedEventHandler";
import { EventDispatcher } from "#/presentation/v1/messaging/EventDispatcher";
import { ConsolaLogger, EventName } from "@sharemyride/shared";

// Logger
const consolaLogger = new ConsolaLogger();

// Infrastructure Repositories & Services
const customerRepository = new MongoCustomerRepository();
const walletRepository = new MongoWalletRepository();
const walletTransactionRepository = new MongoWalletTransactionRepository();
const cryptoUIDService = new CryptoUIDService();

// Customer & Wallet Use Cases
const newCustomerUseCase = new NewCustomerUseCase(customerRepository);
const blockCustomerUseCase = new BlockCustomerUseCase(customerRepository);
const unblockCustomerUseCase = new UnblockCustomerUseCase(customerRepository);
const createWalletUseCase = new CreateWalletUseCase(
  walletRepository,
  cryptoUIDService,
);

// Application Event Handlers
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

// Event Dispatcher & Message Consumer Setup
const eventDispatcher = new EventDispatcher(consolaLogger);
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

export const eventBus = eventBusInstance;
export const customerRepo = customerRepository;
export const walletRepo = walletRepository;
export const walletTransactionRepo = walletTransactionRepository;
export const uidService = cryptoUIDService;
export const walletUseCase = createWalletUseCase;

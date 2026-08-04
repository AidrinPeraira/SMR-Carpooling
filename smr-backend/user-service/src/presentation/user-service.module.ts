import express from "express";
import { AppConfig } from "#/application.config";
import { LoginUserUseCase } from "#/application/use-case/auth/LoginUserUseCase";
import { SignUpUserUseCase } from "#/application/use-case/auth/SignUpUserUseCase";
import { VerifySignupEmailUseCase } from "#/application/use-case/auth/VerifySignupEmailUseCase";
import { RefreshTokenUseCase } from "#/application/use-case/auth/RefreshTokenUseCase";
import { GeneratePasswordChangeTokenUseCase } from "#/application/use-case/auth/GeneratePasswordChangeTokenUseCase";
import { ChangePasswordUseCase } from "#/application/use-case/auth/ChangePasswordUseCase";
import { UserModel } from "#/infrastructure/database/models/MongoUserModel";
import { MongoUserRespository } from "#/infrastructure/repository/MongoUserRepository";
import { CryptoHashingService } from "#/infrastructure/services/CryptoHashingService";
import { CryptoUIDService } from "#/infrastructure/services/CryptoUIDService";
import { JWTTokenService } from "#/infrastructure/services/JwtTokenService";
import { RabbitMQEventBus } from "#/infrastructure/services/RabbitMQEventBus";
import { AuthControllerV1 } from "#/presentation/v1/controllers/AuthControllerV1";
import { createAuthRouterV1 } from "#/presentation/v1/routes/AuthRouterV1";
import { GetUserUseCase } from "#/application/use-case/profile/GetUserUseCase";
import { UpdateUserUseCase } from "#/application/use-case/profile/UpdateUserUseCase";
import { GetAvatarUploadUrlUseCase } from "#/application/use-case/profile/GetAvatarUploadUrlUseCase";
import { UpdateAvatarUseCase } from "#/application/use-case/profile/UpdateAvatarUseCase";
import { S3StorageService } from "#/infrastructure/services/S3StorageService";
import { ProfileControllerV1 } from "#/presentation/v1/controllers/ProfileControllerV1";
import { createProfileRouterV1 } from "#/presentation/v1/routes/ProfileRouterV1";
import { ConsolaLogger, EventName, UserRole } from "@sharemyride/shared";
import { GoogleAuthService } from "#/infrastructure/services/GoogleAuthService";
import { GoogleAuthUseCase } from "#/application/use-case/auth/GoggleAuthUseCase";
import { AuthMiddleware } from "#/presentation/v1/middlewares/AuthMiddleware";
import { AdminUserControllerV1 } from "#/presentation/v1/controllers/admin/AdminUserController";
import { createAdminUsersRouteV1 } from "#/presentation/v1/routes/admin/AdminUsersRouterV1";
import { GetAllUsersUseCase } from "#/application/use-case/admin/users/GetAllUsersUseCase";
import { ChangeUserStatusUseCase } from "#/application/use-case/admin/users/ChangeUserStatusUseCase";
import { GetFullUserProfileUseCase } from "#/application/use-case/admin/users/GetFullUserProfileUseCase";
import { redisClient } from "#/infrastructure/database/connect-redis";
import { RedisSessionStore } from "#/infrastructure/store/RedisSessionStore";
import { MongoVehicleListRepository } from "#/infrastructure/repository/MongoVehicleListRepostirory";
import { NewVehicleListConfigUseCase } from "#/application/use-case/admin/config/NewVehicleListConfigUseCase";
import { UpdateVehicleListConfigUseCase } from "#/application/use-case/admin/config/UpdateVehicleListConfigUseCase";
import { EventDispatcher } from "#/presentation/v1/messages/EventDispatcher";
import { NewVehicleConfigHandler } from "#/presentation/v1/messages/event-handler/NewVehicleConfigHandler";
import { UpdateVehicleConfigHandler } from "#/presentation/v1/messages/event-handler/UpdateVehicleConfigHandler";

// Application Repositories & Models
import { ApplicationModel } from "#/infrastructure/database/models/MongoApplicationModel";
import { DriverRecordModel } from "#/infrastructure/database/models/MongoDriverRecordModel";
import { VehicleRecordModel } from "#/infrastructure/database/models/MongoVehicleRecordModel";
import { MongoApplicationRepository } from "#/infrastructure/repository/MongoApplicationRepository";
import { MongoDriverRecordRepository } from "#/infrastructure/repository/MongoDriverRecordRepository";
import { MongoVehicleRecordRepository } from "#/infrastructure/repository/MongoVehicleRecordRepository";

// Application Use Cases
import { OnboardingApplicationUseCase } from "#/application/use-case/application/OnboardingApplicationUseCase";
import { NewVehicleApplicationUseCase } from "#/application/use-case/application/NewVehicleApplicationUseCase";
import { RenewDriverApplicationUseCase } from "#/application/use-case/application/RenewDriverApplicationUseCase";
import { RenewVehicleApplicationUseCase } from "#/application/use-case/application/RenewVehicleApplicationUseCase";
import { ResubmitOnboardingApplicationUseCase } from "#/application/use-case/application/ResubmitOnboardingApplicationUseCase";
import { ResubmitNewVehicleApplicationUseCase } from "#/application/use-case/application/ResubmitNewVehicleApplicationUseCase";
import { ResubmitRenewDriverApplicationUseCase } from "#/application/use-case/application/ResubmitRenewDriverApplicationUseCase";
import { ResubmitRenewVehicleApplicationUseCase } from "#/application/use-case/application/ResubmitRenewVehicleApplicationUseCase";
import { GetApplicationsUseCase } from "#/application/use-case/application/GetApplicationsUseCase";
import { GetApplicationDetailsUseCase } from "#/application/use-case/application/GetApplicationDetailsUseCase";
import { GetFileUploadUrlUseCase } from "#/application/use-case/GetFileUploadUrlUseCase";

// Admin Application Use Cases
import { GetAllApplicationsUseCase } from "#/application/use-case/admin/application/GetAllApplicationsUseCase";
import { ProcessApplicationUseCase } from "#/application/use-case/admin/application/ProcessApplicationUseCase";

// Application Controllers & Routers
import { ApplicationControllerV1 } from "#/presentation/v1/controllers/ApplicationControllerV1";
import { createApplicationRouterV1 } from "#/presentation/v1/routes/ApplicationRouterV1";
import { AdminApplicationControllerV1 } from "#/presentation/v1/controllers/admin/AdminApplicationControllerV1";
import { createAdminApplicationRouterV1 } from "#/presentation/v1/routes/admin/AdminApplicationRouterV1";

/**
 * Composition Root for the User Service.
 * This module handles the manual Dependency Injection (DI) for all
 * repositories, use cases, and controllers.
 */

//logger
const consolaLogger = new ConsolaLogger();

//services
const cryptoHashingService = new CryptoHashingService();
const cryptoUIDService = new CryptoUIDService();
const jwtTokenService = new JWTTokenService(
  AppConfig.GENERIC_SECRET,
  AppConfig.ACCESS_TOKEN_SECRET,
  AppConfig.REFRESH_TOKEN_SECRET,
);
const s3StorageService = new S3StorageService();

//repositories
const mongoUserRepository = new MongoUserRespository(UserModel);
const mongoVehicleListRepository = new MongoVehicleListRepository();
const mongoApplicationRepository = new MongoApplicationRepository(ApplicationModel);
const mongoDriverRecordRepository = new MongoDriverRecordRepository(DriverRecordModel);
const mongoVehicleRecordRepository = new MongoVehicleRecordRepository(VehicleRecordModel);

//use cases - vehicle config
const newVehicleListConfigUseCase = new NewVehicleListConfigUseCase(
  mongoVehicleListRepository,
);
const updateVehicleListConfigUseCase = new UpdateVehicleListConfigUseCase(
  mongoVehicleListRepository,
);

//messaging - event handlers & dispatcher
const eventDispatcher = new EventDispatcher(consolaLogger);

const newVehicleConfigHandler = new NewVehicleConfigHandler(
  consolaLogger,
  newVehicleListConfigUseCase,
);
const updateVehicleConfigHandler = new UpdateVehicleConfigHandler(
  consolaLogger,
  updateVehicleListConfigUseCase,
);

eventDispatcher.register(
  EventName.ADMIN_ADD_NEW_VEHICLE,
  newVehicleConfigHandler,
);
eventDispatcher.register(
  EventName.ADMIN_UPDATE_NEW_VEHICLE,
  updateVehicleConfigHandler,
);

const rabbitMQEventBus = new RabbitMQEventBus(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
  eventDispatcher,
  "smr.user_service.queue",
);

//stores
const redisSessionStore = new RedisSessionStore(redisClient);

//auth controller
const signUpUseUseCase = new SignUpUserUseCase(
  mongoUserRepository,
  cryptoHashingService,
  cryptoUIDService,
  jwtTokenService,
  rabbitMQEventBus,
);

const loginUserUseCase = new LoginUserUseCase(
  mongoUserRepository,
  cryptoHashingService,
  jwtTokenService,
);

const verifySignupEmailUseCase = new VerifySignupEmailUseCase(
  mongoUserRepository,
  jwtTokenService,
);

const refreshTokenUseCase = new RefreshTokenUseCase(
  mongoUserRepository,
  jwtTokenService,
);

const googleAuthService = new GoogleAuthService();

const googleAuthUseCase = new GoogleAuthUseCase(
  googleAuthService,
  mongoUserRepository,
  cryptoUIDService,
  jwtTokenService,
);

const generatePasswordChangeTokenUseCase =
  new GeneratePasswordChangeTokenUseCase(
    mongoUserRepository,
    jwtTokenService,
    rabbitMQEventBus,
  );

const changePasswordUseCase = new ChangePasswordUseCase(
  mongoUserRepository,
  jwtTokenService,
  cryptoHashingService,
  rabbitMQEventBus,
);

const authControllerV1 = new AuthControllerV1(
  consolaLogger,
  signUpUseUseCase,
  loginUserUseCase,
  verifySignupEmailUseCase,
  googleAuthUseCase,
  refreshTokenUseCase,
  generatePasswordChangeTokenUseCase,
  changePasswordUseCase,
);

const authRouterV1 = createAuthRouterV1(authControllerV1);

//profile controller
const getUserUseCase = new GetUserUseCase(mongoUserRepository);
const updateUserUseCase = new UpdateUserUseCase(
  mongoUserRepository,
  cryptoHashingService,
);
const getAvatarUploadUrlUseCase = new GetAvatarUploadUrlUseCase(
  s3StorageService,
);
const updateAvatarUseCase = new UpdateAvatarUseCase(
  mongoUserRepository,
  s3StorageService,
  consolaLogger,
);

const profileControllerV1 = new ProfileControllerV1(
  consolaLogger,
  getUserUseCase,
  updateUserUseCase,
  getAvatarUploadUrlUseCase,
  updateAvatarUseCase,
);

//admin user controller
const getAllUsersUseCase = new GetAllUsersUseCase(mongoUserRepository);
const getFullUserProfileUseCase = new GetFullUserProfileUseCase(
  mongoUserRepository,
);
const changeUserStatusUseCase = new ChangeUserStatusUseCase(
  mongoUserRepository,
  redisSessionStore,
  rabbitMQEventBus,
);
const adminUserControllerV1 = new AdminUserControllerV1(
  consolaLogger,
  getAllUsersUseCase,
  changeUserStatusUseCase,
  getFullUserProfileUseCase,
);

const adminUserRoutesV1 = createAdminUsersRouteV1(adminUserControllerV1);

//application use cases
const onboardingApplicationUseCase = new OnboardingApplicationUseCase(
  mongoApplicationRepository,
  mongoVehicleRecordRepository,
  mongoDriverRecordRepository,
  cryptoUIDService,
  s3StorageService,
);

const newVehicleApplicationUseCase = new NewVehicleApplicationUseCase(
  mongoApplicationRepository,
  mongoVehicleRecordRepository,
  cryptoUIDService,
  s3StorageService,
);

const renewDriverApplicationUseCase = new RenewDriverApplicationUseCase(
  mongoApplicationRepository,
  mongoDriverRecordRepository,
  cryptoUIDService,
  s3StorageService,
);

const renewVehicleApplicationUseCase = new RenewVehicleApplicationUseCase(
  mongoApplicationRepository,
  mongoVehicleRecordRepository,
  cryptoUIDService,
  s3StorageService,
);

const resubmitOnboardingApplicationUseCase =
  new ResubmitOnboardingApplicationUseCase(
    mongoApplicationRepository,
    mongoDriverRecordRepository,
    mongoVehicleRecordRepository,
    s3StorageService,
  );

const resubmitNewVehicleApplicationUseCase =
  new ResubmitNewVehicleApplicationUseCase(
    mongoApplicationRepository,
    mongoVehicleRecordRepository,
    s3StorageService,
  );

const resubmitRenewDriverApplicationUseCase =
  new ResubmitRenewDriverApplicationUseCase(
    mongoApplicationRepository,
    mongoDriverRecordRepository,
    s3StorageService,
  );

const resubmitRenewVehicleApplicationUseCase =
  new ResubmitRenewVehicleApplicationUseCase(
    mongoApplicationRepository,
    mongoVehicleRecordRepository,
    s3StorageService,
  );

const getApplicationsUseCase = new GetApplicationsUseCase(
  mongoApplicationRepository,
);

const getApplicationDetailsUseCase = new GetApplicationDetailsUseCase(
  mongoApplicationRepository,
  s3StorageService,
);

const getFileUploadUrlUseCase = new GetFileUploadUrlUseCase(s3StorageService);

const applicationControllerV1 = new ApplicationControllerV1(
  consolaLogger,
  getFileUploadUrlUseCase,
  onboardingApplicationUseCase,
  newVehicleApplicationUseCase,
  renewDriverApplicationUseCase,
  renewVehicleApplicationUseCase,
  resubmitOnboardingApplicationUseCase,
  resubmitNewVehicleApplicationUseCase,
  resubmitRenewDriverApplicationUseCase,
  resubmitRenewVehicleApplicationUseCase,
  getApplicationsUseCase,
  getApplicationDetailsUseCase,
);

const applicationRouterV1 = createApplicationRouterV1(applicationControllerV1);

//admin application controller
const getAllApplicationsUseCase = new GetAllApplicationsUseCase(
  mongoApplicationRepository,
);

const processApplicationUseCase = new ProcessApplicationUseCase(
  mongoApplicationRepository,
  mongoUserRepository,
  rabbitMQEventBus,
);

const adminApplicationControllerV1 = new AdminApplicationControllerV1(
  consolaLogger,
  getAllApplicationsUseCase,
  getApplicationDetailsUseCase,
  processApplicationUseCase,
);

const adminApplicationRouterV1 = createAdminApplicationRouterV1(
  adminApplicationControllerV1,
);

// v1 router setup
const profileRouterV1 = createProfileRouterV1(profileControllerV1);
const v1Router = express.Router();
v1Router.use("/auth", authRouterV1);
v1Router.use(
  "/profile",
  AuthMiddleware(UserRole.DRIVER, UserRole.PASSENGER),
  profileRouterV1,
);
v1Router.use(
  "/applications",
  AuthMiddleware(UserRole.DRIVER, UserRole.PASSENGER),
  applicationRouterV1,
);
v1Router.use("/admin/users", AuthMiddleware(UserRole.ADMIN), adminUserRoutesV1);
v1Router.use(
  "/admin/applications",
  AuthMiddleware(UserRole.ADMIN),
  adminApplicationRouterV1,
);

//exporting versioned routers
export const userServiceRouters = {
  v1: v1Router,
};

export const eventBus = rabbitMQEventBus;

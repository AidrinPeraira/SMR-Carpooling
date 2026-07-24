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
import { ConsolaLogger, UserRole } from "@sharemyride/shared";
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
const rabbitMQEventBus = new RabbitMQEventBus(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
);
const s3StorageService = new S3StorageService();

//repositories
const mongoUserRepository = new MongoUserRespository(UserModel);

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
const getFullUserProfileUseCase = new GetFullUserProfileUseCase(mongoUserRepository);
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

// v1 router setup
const profileRouterV1 = createProfileRouterV1(profileControllerV1);
const v1Router = express.Router();
v1Router.use("/auth", authRouterV1);
v1Router.use(
  "/profile",
  AuthMiddleware(UserRole.DRIVER, UserRole.PASSENGER),
  profileRouterV1,
);
v1Router.use("/admin/users", AuthMiddleware(UserRole.ADMIN), adminUserRoutesV1);

//exporting versioned routeres
export const userServiceRouters = {
  v1: v1Router,
};

export const eventBus = rabbitMQEventBus;

import express from "express";
import { AppConfig } from "#/application.config";
import { LoginUserUseCase } from "#/application/use-case/LoginUserUseCase";
import { SignUpUserUseCase } from "#/application/use-case/SignUpUserUseCase";
import { VerifySignupEmailUseCase } from "#/application/use-case/VerifySignupEmailUseCase";
import { redisClient } from "#/infrastructure/database/connect-redis";
import { UserModel } from "#/infrastructure/database/models/MongoUserModel";
import { MongoUserRespository } from "#/infrastructure/repository/MongoUserRepository";
import { RedisSessionRepository } from "#/infrastructure/repository/RedisSessionRepository";
import { CryptoHashingService } from "#/infrastructure/services/CryptoHashingService";
import { CryptoUIDService } from "#/infrastructure/services/CryptoUIDService";
import { JWTTokenService } from "#/infrastructure/services/JwtTokenService";
import { RabbitMQEventBus } from "#/infrastructure/services/RabbitMQEventBus";
import { AuthControllerV1 } from "#/presentation/v1/controllers/AuthControllerV1";
import { createAuthRouterV1 } from "#/presentation/v1/routes/AuthRouterV1";
import { ConsolaLogger } from "@smr/shared";

/**
 * Composition Root for the User Service.
 * This module handles the manual Dependency Injection (DI) for all
 * repositories, use cases, and controllers.
 */

const consolaLogger = new ConsolaLogger();

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

const mongoUserRepository = new MongoUserRespository(UserModel);
const sessionRepository = new RedisSessionRepository(redisClient);

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
  sessionRepository,
);

const verifySignupEmailUseCase = new VerifySignupEmailUseCase(
  mongoUserRepository,
  sessionRepository,
  jwtTokenService,
);

const authControllerV1 = new AuthControllerV1(
  consolaLogger,
  signUpUseUseCase,
  loginUserUseCase,
  verifySignupEmailUseCase,
);

// v1 router setup
const authRouterV1 = createAuthRouterV1(authControllerV1);
const v1Router = express.Router();
v1Router.use("/auth", authRouterV1);

//exporting versioned routeres
export const userServiceRouters = {
  v1: v1Router,
};

export const eventBus = rabbitMQEventBus;

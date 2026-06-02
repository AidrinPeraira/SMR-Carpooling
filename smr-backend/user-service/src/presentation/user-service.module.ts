import express from "express";
import { AppConfig } from "#/application.config";
import { SignUpUserUseCase } from "#/application/use-case/SignUpUserUseCase";
import { RabbitMQEventBus } from "#/infrastructure/services/RabbitMQEventBus";
import { AuthControllerV1 } from "#/presentation/v1/controllers/AuthControllerV1";
import { createAuthRouterV1 } from "#/presentation/v1/routes/AuthRouterV1";
import { ConsolaLogger } from "@smr/shared";
import { UserModel } from "#/infrastructure/database/models/MongoUserModel";
import { MongoUserRespository } from "#/infrastructure/repository/MongoUserRepository";
import { CryptoHashingService } from "#/infrastructure/services/CryptoHashingService";
import { CryptoUIDService } from "#/infrastructure/services/CryptoUIDService";
import { JWTTokenService } from "#/infrastructure/services/JwtTokenService";

/**
 * Composition Root for the User Service.
 * This module handles the manual Dependency Injection (DI) for all
 * repositories, use cases, and controllers.
 */

const consolaLogger = new ConsolaLogger();

const cryptoHashingService = new CryptoHashingService();
const cryptoUIDService = new CryptoUIDService();
const jwtTokenService = new JWTTokenService();

const rabbitMQEventBus = new RabbitMQEventBus(
  consolaLogger,
  AppConfig.RABBITMQ_URL,
  AppConfig.RABBITMQ_EXCHANGE_NAME,
);

const mongoUserRepository = new MongoUserRespository(UserModel);

const signUpUseUseCase = new SignUpUserUseCase(
  mongoUserRepository,
  cryptoHashingService,
  cryptoUIDService,
  jwtTokenService,
  rabbitMQEventBus,
);

const authControllerV1 = new AuthControllerV1(consolaLogger, signUpUseUseCase);

// v1 router setup
const authRouterV1 = createAuthRouterV1(authControllerV1);
const v1Router = express.Router();
v1Router.use("/auth", authRouterV1);

//exporting versioned routeres
export const userServiceRouters = {
  v1: v1Router,
};

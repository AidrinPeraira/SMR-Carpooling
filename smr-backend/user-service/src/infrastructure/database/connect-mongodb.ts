import { AppConfig } from "#/application.config";
import { ILogger } from "@smr/shared";
import mongoose from "mongoose";

export async function connectMongoDB(logger: ILogger) {
  try {
    await mongoose.connect(AppConfig.MONGO_DB_URL);
    logger.info("Database Connected: ", {
      service: "user-service",
      success: true,
    });
  } catch (err: unknown) {
    logger.error("Mongo DB connection error:  ", err);
    process.exit(1);
  }
}

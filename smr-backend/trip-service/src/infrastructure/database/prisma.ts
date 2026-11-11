import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#/infrastructure/database/generated/prisma/client";
import { AppConfig } from "#/application.config";

const connectionString = AppConfig.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

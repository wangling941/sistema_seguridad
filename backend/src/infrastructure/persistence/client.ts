import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is required to initialize Prisma");
}

const prisma = new PrismaClient();

export default prisma;

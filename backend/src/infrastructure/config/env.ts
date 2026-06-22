import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || "3000", 10),
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  databaseUrl: process.env.DATABASE_URL || "",
};

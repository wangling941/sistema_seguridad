import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";
import { PrismaUserRepository } from "../../../infrastructure/persistence/prisma/repositories/PrismaUserRepository";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import { EncryptionService } from "../../../infrastructure/auth/EncryptionService";

const router = Router();

const userRepository = new PrismaUserRepository();
const jwtService = new JwtService();
const encryptionService = new EncryptionService();
const loginUseCase = new LoginUseCase(
  userRepository,
  jwtService,
  encryptionService,
);
const authController = new AuthController(loginUseCase);

router.post("/login", authController.login);

export default router;

import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";
import { RegisterUseCase } from "../../../application/use-cases/auth/RegisterUseCase";
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
const registerUseCase = new RegisterUseCase(userRepository, encryptionService);

const authController = new AuthController(loginUseCase, registerUseCase);

router.post("/login", authController.login);
router.post("/register", authController.register); // <-- nueva ruta

export default router;

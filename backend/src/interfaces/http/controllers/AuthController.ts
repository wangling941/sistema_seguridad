import { Request, Response, NextFunction } from "express";
import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";
import { LoginDto } from "../../../application/dto/LoginDto";
import { RegisterUseCase } from "../../../application/use-cases/auth/RegisterUseCase";
import { CreateUserDto } from "@application/dto/CreateUserDto";

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
  ) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: LoginDto = req.body;
      const result = await this.loginUseCase.execute(dto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateUserDto = req.body;
      const user = await this.registerUseCase.execute(dto);
      res.status(201).json({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      });
    } catch (error) {
      next(error);
    }
  };
}

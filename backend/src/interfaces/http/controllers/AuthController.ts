import { Request, Response, NextFunction } from "express";
import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";
import { LoginDto } from "../../../application/dto/LoginDto";

export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: LoginDto = req.body;
      const result = await this.loginUseCase.execute(dto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

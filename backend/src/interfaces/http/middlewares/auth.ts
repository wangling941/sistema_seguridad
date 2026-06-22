import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import { UnauthorizedError } from "../../../domain/exceptions/DomainError";

const jwtService = new JwtService();

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwtService.verify(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid token"));
  }
};

import jwt from "jsonwebtoken";
import { IJwtService } from "../../application/ports/services/IJwtService";
import { env } from "../config/env";

export class JwtService implements IJwtService {
  sign(payload: object): string {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: "8h" });
  }

  verify(token: string): any {
    return jwt.verify(token, env.jwtSecret);
  }
}

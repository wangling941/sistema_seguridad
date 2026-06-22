import bcrypt from "bcryptjs";
import { IEncryptionService } from "../../application/ports/services/IEncryptionService";

export class EncryptionService implements IEncryptionService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

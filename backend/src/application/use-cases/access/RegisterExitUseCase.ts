import { IAccessLogRepository } from "../../ports/repositories/IAccessLogRepository";
import { NotFoundError } from "../../../domain/exceptions/DomainError";

export class RegisterExitUseCase {
  constructor(private accessLogRepository: IAccessLogRepository) {}

  async execute(id: number, exitDatetime: Date): Promise<void> {
    const accessLog = await this.accessLogRepository.findById(id);
    if (!accessLog) {
      throw new NotFoundError("AccessLog", id);
    }
    if (accessLog.exitDatetime) {
      throw new Error("Exit already registered");
    }
    await this.accessLogRepository.registerExit(id, exitDatetime);
  }
}

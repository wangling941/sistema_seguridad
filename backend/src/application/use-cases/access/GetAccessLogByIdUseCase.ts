import { IAccessLogRepository } from "../../ports/repositories/IAccessLogRepository";
import { NotFoundError } from "../../../domain/exceptions/DomainError";

export class GetAccessLogByIdUseCase {
  constructor(private accessLogRepository: IAccessLogRepository) {}

  async execute(id: number) {
    const accessLog = await this.accessLogRepository.findById(id);
    if (!accessLog) {
      throw new NotFoundError("AccessLog", id);
    }
    return accessLog;
  }
}

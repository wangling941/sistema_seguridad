import { IAccessLogRepository } from "../../ports/repositories/IAccessLogRepository";
import { NotFoundError } from "../../../domain/exceptions/DomainError";

export class DeleteAccessLogUseCase {
  constructor(private accessLogRepository: IAccessLogRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.accessLogRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("AccessLog", id);
    }
    await this.accessLogRepository.delete(id);
  }
}

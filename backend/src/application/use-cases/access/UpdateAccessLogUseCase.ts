import { IAccessLogRepository } from "../../ports/repositories/IAccessLogRepository";
import { UpdateAccessLogDto } from "../../dto/UpdateAccessLogDto";
import { NotFoundError } from "../../../domain/exceptions/DomainError";

export class UpdateAccessLogUseCase {
  constructor(private accessLogRepository: IAccessLogRepository) {}

  async execute(id: number, dto: UpdateAccessLogDto) {
    const existing = await this.accessLogRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("AccessLog", id);
    }
    return this.accessLogRepository.update(id, dto);
  }
}

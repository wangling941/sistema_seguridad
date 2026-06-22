import { IAccessLogRepository } from "../../ports/repositories/IAccessLogRepository";

export class GetAllAccessLogsUseCase {
  constructor(private accessLogRepository: IAccessLogRepository) {}

  async execute(search?: string, page: number = 1, limit: number = 20) {
    return this.accessLogRepository.findAll(search, page, limit);
  }
}

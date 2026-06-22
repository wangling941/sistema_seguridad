import { IAccessLogRepository } from "../../ports/repositories/IAccessLogRepository";

export class GetRecentAccessLogsUseCase {
  constructor(private accessLogRepository: IAccessLogRepository) {}

  async execute(limit: number = 10) {
    return this.accessLogRepository.getRecent(limit);
  }
}

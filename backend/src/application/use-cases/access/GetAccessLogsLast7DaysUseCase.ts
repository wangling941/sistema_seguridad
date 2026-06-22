import { IAccessLogRepository } from "../../ports/repositories/IAccessLogRepository";

export class GetAccessLogsLast7DaysUseCase {
  constructor(private accessLogRepository: IAccessLogRepository) {}

  async execute() {
    return this.accessLogRepository.getLast7Days();
  }
}

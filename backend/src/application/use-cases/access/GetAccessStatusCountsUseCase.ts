import { IAccessLogRepository } from "../../ports/repositories/IAccessLogRepository";

export class GetAccessStatusCountsUseCase {
  constructor(private accessLogRepository: IAccessLogRepository) {}

  async execute() {
    return this.accessLogRepository.getAccessStatusCounts();
  }
}

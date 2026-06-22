import { IAccessLogRepository } from "../../ports/repositories/IAccessLogRepository";
import { ReportFiltersDto } from "../../dto/ReportFiltersDto";

export class GetReportDataUseCase {
  constructor(private accessLogRepository: IAccessLogRepository) {}

  async execute(
    filters: ReportFiltersDto,
    page: number = 1,
    limit: number = 20,
  ) {
    const [filteredLogs, perDay, perResident] = await Promise.all([
      this.accessLogRepository.getFiltered(filters, page, limit),
      this.accessLogRepository.getAccessesPerDay(
        filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        filters.endDate || new Date(),
      ),
      this.accessLogRepository.getAccessesPerResident(
        filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        filters.endDate || new Date(),
      ),
    ]);

    return {
      logs: filteredLogs,
      perDay,
      perResident,
    };
  }
}

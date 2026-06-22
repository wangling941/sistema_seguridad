import { AccessLog } from "../../../domain/entities/AccessLog";
import { ReportFiltersDto } from "../../dto/ReportFiltersDto";

export interface IAccessLogRepository {
  findAll(
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: AccessLog[]; total: number }>;
  findById(id: number): Promise<AccessLog | null>;
  create(accessLog: AccessLog): Promise<AccessLog>;
  update(id: number, accessLog: Partial<AccessLog>): Promise<AccessLog>;
  delete(id: number): Promise<void>;
  registerExit(id: number, exitDatetime: Date): Promise<void>;
  getRecent(limit?: number): Promise<AccessLog[]>;
  getAccessesPerDay(
    startDate: Date,
    endDate: Date,
  ): Promise<{ date: string; count: number }[]>;
  getAccessesPerResident(
    startDate: Date,
    endDate: Date,
  ): Promise<{ name: string; count: number }[]>;
  getAccessStatusCounts(): Promise<{ status: string; count: number }[]>;
  getLast7Days(): Promise<{ date: string; count: number }[]>;
  getFiltered(
    filters: ReportFiltersDto,
    page?: number,
    limit?: number,
  ): Promise<{ data: AccessLog[]; total: number }>;
}

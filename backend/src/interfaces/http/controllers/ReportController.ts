import { Request, Response, NextFunction } from "express";
import { GetReportDataUseCase } from "../../../application/use-cases/reports/GetReportDataUseCase";
import { ReportFiltersDto } from "../../../application/dto/ReportFiltersDto";

export class ReportController {
  constructor(private getReportDataUseCase: GetReportDataUseCase) {}

  getReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: ReportFiltersDto = {
        startDate: req.query.startDate
          ? new Date(req.query.startDate as string)
          : undefined,
        endDate: req.query.endDate
          ? new Date(req.query.endDate as string)
          : undefined,
        residentId: req.query.residentId
          ? Number(req.query.residentId)
          : undefined,
        vehiclePlate: req.query.vehiclePlate as string,
      };
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const result = await this.getReportDataUseCase.execute(
        filters,
        page,
        limit,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

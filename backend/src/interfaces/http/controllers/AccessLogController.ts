import { Request, Response, NextFunction } from "express";
import { CreateAccessLogUseCase } from "../../../application/use-cases/access/CreateAccessLogUseCase";
import { RegisterExitUseCase } from "../../../application/use-cases/access/RegisterExitUseCase";
import { GetAllAccessLogsUseCase } from "../../../application/use-cases/access/GetAllAccessLogsUseCase";
import { GetAccessLogByIdUseCase } from "../../../application/use-cases/access/GetAccessLogByIdUseCase";
import { UpdateAccessLogUseCase } from "../../../application/use-cases/access/UpdateAccessLogUseCase";
import { DeleteAccessLogUseCase } from "../../../application/use-cases/access/DeleteAccessLogUseCase";
import { GetAccessLogsLast7DaysUseCase } from "../../../application/use-cases/access/GetAccessLogsLast7DaysUseCase";
import { GetAccessStatusCountsUseCase } from "../../../application/use-cases/access/GetAccessStatusCountsUseCase";
import { GetRecentAccessLogsUseCase } from "../../../application/use-cases/access/GetRecentAccessLogsUseCase";
import { CreateAccessLogDto } from "../../../application/dto/CreateAccessLogDto";
import { UpdateAccessLogDto } from "../../../application/dto/UpdateAccessLogDto";
import { getParamAsNumber } from "./requestParams";

// ✅ IMPORTAR EL eventEmitter
import { eventEmitter } from "../dependencies";

export class AccessLogController {
  constructor(
    private createAccessLogUseCase: CreateAccessLogUseCase,
    private registerExitUseCase: RegisterExitUseCase,
    private getAllAccessLogsUseCase: GetAllAccessLogsUseCase,
    private getAccessLogByIdUseCase: GetAccessLogByIdUseCase,
    private updateAccessLogUseCase: UpdateAccessLogUseCase,
    private deleteAccessLogUseCase: DeleteAccessLogUseCase,
    private getLast7DaysUseCase: GetAccessLogsLast7DaysUseCase,
    private getStatusCountsUseCase: GetAccessStatusCountsUseCase,
    private getRecentUseCase: GetRecentAccessLogsUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateAccessLogDto = req.body;
      const accessLog = await this.createAccessLogUseCase.execute(dto);

      // ✅ EMITIR EL EVENTO PARA SSE
      console.log(
        "📤 Emitiendo evento access.created:",
        accessLog.toPrimitives(),
      );
      eventEmitter.emit("access.created", accessLog.toPrimitives());

      res.status(201).json(accessLog.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  registerExit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getParamAsNumber(req, "id");
      const exitDatetime = new Date();
      await this.registerExitUseCase.execute(id, exitDatetime);
      res.status(200).json({ message: "Exit registered" });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page = 1, limit = 20 } = req.query;
      const result = await this.getAllAccessLogsUseCase.execute(
        search as string,
        Number(page),
        Number(limit),
      );
      res.json({
        data: result.data.map((a) => a.toPrimitives()),
        total: result.total,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getParamAsNumber(req, "id");
      const accessLog = await this.getAccessLogByIdUseCase.execute(id);
      res.json(accessLog.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getParamAsNumber(req, "id");
      const dto: UpdateAccessLogDto = req.body;
      const accessLog = await this.updateAccessLogUseCase.execute(id, dto);
      res.json(accessLog.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getParamAsNumber(req, "id");
      await this.deleteAccessLogUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getLast7Days = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.getLast7DaysUseCase.execute();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getStatusCounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.getStatusCountsUseCase.execute();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getRecent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const data = await this.getRecentUseCase.execute(limit);
      res.json(data.map((a) => a.toPrimitives()));
    } catch (error) {
      next(error);
    }
  };
}

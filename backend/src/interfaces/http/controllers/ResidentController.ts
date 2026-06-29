import { Request, Response, NextFunction } from "express";
import { CreateResidentUseCase } from "../../../application/use-cases/resident/CreateResidentUseCase";
import { GetAllResidentsUseCase } from "../../../application/use-cases/resident/GetAllResidentsUseCase";
import { GetResidentByIdUseCase } from "../../../application/use-cases/resident/GetResidentByIdUseCase";
import { UpdateResidentUseCase } from "../../../application/use-cases/resident/UpdateResidentUseCase";
import { DeleteResidentUseCase } from "../../../application/use-cases/resident/DeleteResidentUseCase";
import { GetResidentStatusCountsUseCase } from "../../../application/use-cases/resident/GetResidentStatusCountsUseCase";
import { CreateResidentDto } from "../../../application/dto/CreateResidentDto";
import { UpdateResidentDto } from "../../../application/dto/UpdateResidentDto";
import { getParamAsNumber } from "./requestParams";
import { eventEmitter } from "../dependencies"; // ✅ Importar eventEmitter

export class ResidentController {
  constructor(
    private createResidentUseCase: CreateResidentUseCase,
    private getAllResidentsUseCase: GetAllResidentsUseCase,
    private getResidentByIdUseCase: GetResidentByIdUseCase,
    private updateResidentUseCase: UpdateResidentUseCase,
    private deleteResidentUseCase: DeleteResidentUseCase,
    private getResidentStatusCountsUseCase: GetResidentStatusCountsUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateResidentDto = req.body;
      const resident = await this.createResidentUseCase.execute(dto);
      const primitives = resident.toPrimitives();
      console.log("📤 Emitiendo evento resident.created:", primitives);
      eventEmitter.emit("resident.created", primitives);
      res.status(201).json(primitives);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page = 1, limit = 20 } = req.query;
      const result = await this.getAllResidentsUseCase.execute(
        search as string,
        Number(page),
        Number(limit),
      );
      res.json({
        data: result.data.map((r) => r.toPrimitives()),
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
      const resident = await this.getResidentByIdUseCase.execute(id);
      res.json(resident.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getParamAsNumber(req, "id");
      const dto: UpdateResidentDto = req.body;
      const resident = await this.updateResidentUseCase.execute(id, dto);
      res.json(resident.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getParamAsNumber(req, "id");
      await this.deleteResidentUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getStatusCounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.getResidentStatusCountsUseCase.execute();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
}

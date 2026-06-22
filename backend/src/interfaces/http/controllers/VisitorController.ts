import { Request, Response, NextFunction } from "express";
import { CreateVisitorUseCase } from "../../../application/use-cases/visitor/CreateVisitorUseCase";
import { GetAllVisitorsUseCase } from "../../../application/use-cases/visitor/GetAllVisitorsUseCase";
import { GetVisitorByIdUseCase } from "../../../application/use-cases/visitor/GetVisitorByIdUseCase";
import { UpdateVisitorUseCase } from "../../../application/use-cases/visitor/UpdateVisitorUseCase";
import { DeleteVisitorUseCase } from "../../../application/use-cases/visitor/DeleteVisitorUseCase";
import { GetVisitorStatusCountsUseCase } from "../../../application/use-cases/visitor/GetVisitorStatusCountsUseCase";
import { CreateVisitorDto } from "../../../application/dto/CreateVisitorDto";
import { UpdateVisitorDto } from "../../../application/dto/UpdateVisitorDto";
import { getParamAsNumber } from "./requestParams";

export class VisitorController {
  constructor(
    private createVisitorUseCase: CreateVisitorUseCase,
    private getAllVisitorsUseCase: GetAllVisitorsUseCase,
    private getVisitorByIdUseCase: GetVisitorByIdUseCase,
    private updateVisitorUseCase: UpdateVisitorUseCase,
    private deleteVisitorUseCase: DeleteVisitorUseCase,
    private getVisitorStatusCountsUseCase: GetVisitorStatusCountsUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateVisitorDto = req.body;
      const visitor = await this.createVisitorUseCase.execute(dto);
      res.status(201).json(visitor.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page = 1, limit = 20 } = req.query;
      const result = await this.getAllVisitorsUseCase.execute(
        search as string,
        Number(page),
        Number(limit),
      );
      res.json({
        data: result.data.map((v) => v.toPrimitives()),
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
      const visitor = await this.getVisitorByIdUseCase.execute(id);
      res.json(visitor.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getParamAsNumber(req, "id");
      const dto: UpdateVisitorDto = req.body;
      const visitor = await this.updateVisitorUseCase.execute(id, dto);
      res.json(visitor.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getParamAsNumber(req, "id");
      await this.deleteVisitorUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getStatusCounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.getVisitorStatusCountsUseCase.execute();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
}

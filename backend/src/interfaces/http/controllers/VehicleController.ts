import { Request, Response, NextFunction } from "express";
import { CreateVehicleUseCase } from "../../../application/use-cases/vehicle/CreateVehicleUseCase";
import { GetAllVehiclesUseCase } from "../../../application/use-cases/vehicle/GetAllVehiclesUseCase";
import { GetVehicleByIdUseCase } from "../../../application/use-cases/vehicle/GetVehicleByIdUseCase";
import { UpdateVehicleUseCase } from "../../../application/use-cases/vehicle/UpdateVehicleUseCase";
import { DeleteVehicleUseCase } from "../../../application/use-cases/vehicle/DeleteVehicleUseCase";
import { GetVehiclesPerResidentUseCase } from "../../../application/use-cases/vehicle/GetVehiclesPerResidentUseCase";
import { CreateVehicleDto } from "../../../application/dto/CreateVehicleDto";
import { UpdateVehicleDto } from "../../../application/dto/UpdateVehicleDto";
import { getParamAsNumber } from "./requestParams";
import { eventEmitter } from "../dependencies"; // ✅ Importar eventEmitter

export class VehicleController {
  constructor(
    private createVehicleUseCase: CreateVehicleUseCase,
    private getAllVehiclesUseCase: GetAllVehiclesUseCase,
    private getVehicleByIdUseCase: GetVehicleByIdUseCase,
    private updateVehicleUseCase: UpdateVehicleUseCase,
    private deleteVehicleUseCase: DeleteVehicleUseCase,
    private getVehiclesPerResidentUseCase: GetVehiclesPerResidentUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateVehicleDto = req.body;
      const vehicle = await this.createVehicleUseCase.execute(dto);
      const primitives = vehicle.toPrimitives();

      // ✅ EMITIR EVENTO CON LOG
      console.log("🚗 Emitiendo evento vehicle.created:", primitives);
      eventEmitter.emit("vehicle.created", primitives);
      console.log("✅ Evento vehicle.created emitido correctamente");

      res.status(201).json(primitives);
    } catch (error) {
      console.error("❌ Error en VehicleController.create:", error);
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, page = 1, limit = 20 } = req.query;
      const result = await this.getAllVehiclesUseCase.execute(
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
      const vehicle = await this.getVehicleByIdUseCase.execute(id);
      res.json(vehicle.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getParamAsNumber(req, "id");
      const dto: UpdateVehicleDto = req.body;
      const vehicle = await this.updateVehicleUseCase.execute(id, dto);
      res.json(vehicle.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = getParamAsNumber(req, "id");
      await this.deleteVehicleUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getPerResident = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.getVehiclesPerResidentUseCase.execute();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
}

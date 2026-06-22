import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";
import { authMiddleware } from "../middlewares/auth";
import { PrismaVehicleRepository } from "../../../infrastructure/persistence/prisma/repositories/PrismaVehicleRepository";
import { CreateVehicleUseCase } from "../../../application/use-cases/vehicle/CreateVehicleUseCase";
import { GetAllVehiclesUseCase } from "../../../application/use-cases/vehicle/GetAllVehiclesUseCase";
import { GetVehicleByIdUseCase } from "../../../application/use-cases/vehicle/GetVehicleByIdUseCase";
import { UpdateVehicleUseCase } from "../../../application/use-cases/vehicle/UpdateVehicleUseCase";
import { DeleteVehicleUseCase } from "../../../application/use-cases/vehicle/DeleteVehicleUseCase";
import { GetVehiclesPerResidentUseCase } from "../../../application/use-cases/vehicle/GetVehiclesPerResidentUseCase";

const router = Router();
const vehicleRepository = new PrismaVehicleRepository();

const createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
const getAllVehiclesUseCase = new GetAllVehiclesUseCase(vehicleRepository);
const getVehicleByIdUseCase = new GetVehicleByIdUseCase(vehicleRepository);
const updateVehicleUseCase = new UpdateVehicleUseCase(vehicleRepository);
const deleteVehicleUseCase = new DeleteVehicleUseCase(vehicleRepository);
const getVehiclesPerResidentUseCase = new GetVehiclesPerResidentUseCase(
  vehicleRepository,
);

const vehicleController = new VehicleController(
  createVehicleUseCase,
  getAllVehiclesUseCase,
  getVehicleByIdUseCase,
  updateVehicleUseCase,
  deleteVehicleUseCase,
  getVehiclesPerResidentUseCase,
);

router.use(authMiddleware);
router.post("/", vehicleController.create);
router.get("/", vehicleController.getAll);
router.get("/per-resident", vehicleController.getPerResident);
router.get("/:id", vehicleController.getById);
router.put("/:id", vehicleController.update);
router.delete("/:id", vehicleController.delete);

export default router;

import { Router } from "express";
import { ResidentController } from "../controllers/ResidentController";
import { authMiddleware } from "../middlewares/auth";
import { PrismaResidentRepository } from "../../../infrastructure/persistence/prisma/repositories/PrismaResidentRepository";
import { CreateResidentUseCase } from "../../../application/use-cases/resident/CreateResidentUseCase";
import { GetAllResidentsUseCase } from "../../../application/use-cases/resident/GetAllResidentsUseCase";
import { GetResidentByIdUseCase } from "../../../application/use-cases/resident/GetResidentByIdUseCase";
import { UpdateResidentUseCase } from "../../../application/use-cases/resident/UpdateResidentUseCase";
import { DeleteResidentUseCase } from "../../../application/use-cases/resident/DeleteResidentUseCase";
import { GetResidentStatusCountsUseCase } from "../../../application/use-cases/resident/GetResidentStatusCountsUseCase";

const router = Router();
const residentRepository = new PrismaResidentRepository();

const createResidentUseCase = new CreateResidentUseCase(residentRepository);
const getAllResidentsUseCase = new GetAllResidentsUseCase(residentRepository);
const getResidentByIdUseCase = new GetResidentByIdUseCase(residentRepository);
const updateResidentUseCase = new UpdateResidentUseCase(residentRepository);
const deleteResidentUseCase = new DeleteResidentUseCase(residentRepository);
const getResidentStatusCountsUseCase = new GetResidentStatusCountsUseCase(
  residentRepository,
);

const residentController = new ResidentController(
  createResidentUseCase,
  getAllResidentsUseCase,
  getResidentByIdUseCase,
  updateResidentUseCase,
  deleteResidentUseCase,
  getResidentStatusCountsUseCase,
);

router.use(authMiddleware);
router.post("/", residentController.create);
router.get("/", residentController.getAll);
router.get("/status-counts", residentController.getStatusCounts);
router.get("/:id", residentController.getById);
router.put("/:id", residentController.update);
router.delete("/:id", residentController.delete);

export default router;

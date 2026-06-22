import { Router } from "express";
import { VisitorController } from "../controllers/VisitorController";
import { authMiddleware } from "../middlewares/auth";
import { PrismaVisitorRepository } from "../../../infrastructure/persistence/prisma/repositories/PrismaVisitorRepository";
import { CreateVisitorUseCase } from "../../../application/use-cases/visitor/CreateVisitorUseCase";
import { GetAllVisitorsUseCase } from "../../../application/use-cases/visitor/GetAllVisitorsUseCase";
import { GetVisitorByIdUseCase } from "../../../application/use-cases/visitor/GetVisitorByIdUseCase";
import { UpdateVisitorUseCase } from "../../../application/use-cases/visitor/UpdateVisitorUseCase";
import { DeleteVisitorUseCase } from "../../../application/use-cases/visitor/DeleteVisitorUseCase";
import { GetVisitorStatusCountsUseCase } from "../../../application/use-cases/visitor/GetVisitorStatusCountsUseCase";

const router = Router();
const visitorRepository = new PrismaVisitorRepository();

const createVisitorUseCase = new CreateVisitorUseCase(visitorRepository);
const getAllVisitorsUseCase = new GetAllVisitorsUseCase(visitorRepository);
const getVisitorByIdUseCase = new GetVisitorByIdUseCase(visitorRepository);
const updateVisitorUseCase = new UpdateVisitorUseCase(visitorRepository);
const deleteVisitorUseCase = new DeleteVisitorUseCase(visitorRepository);
const getVisitorStatusCountsUseCase = new GetVisitorStatusCountsUseCase(
  visitorRepository,
);

const visitorController = new VisitorController(
  createVisitorUseCase,
  getAllVisitorsUseCase,
  getVisitorByIdUseCase,
  updateVisitorUseCase,
  deleteVisitorUseCase,
  getVisitorStatusCountsUseCase,
);

router.use(authMiddleware);
router.post("/", visitorController.create);
router.get("/", visitorController.getAll);
router.get("/status-counts", visitorController.getStatusCounts);
router.get("/:id", visitorController.getById);
router.put("/:id", visitorController.update);
router.delete("/:id", visitorController.delete);

export default router;

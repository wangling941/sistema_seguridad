import { Router } from "express";
import { AccessLogController } from "../controllers/AccessLogController";
import { authMiddleware } from "../middlewares/auth";
import { PrismaAccessLogRepository } from "../../../infrastructure/persistence/prisma/repositories/PrismaAccessLogRepository";
import { eventEmitter } from "../dependencies";
import { CreateAccessLogUseCase } from "../../../application/use-cases/access/CreateAccessLogUseCase";
import { RegisterExitUseCase } from "../../../application/use-cases/access/RegisterExitUseCase";
import { GetAllAccessLogsUseCase } from "../../../application/use-cases/access/GetAllAccessLogsUseCase";
import { GetAccessLogByIdUseCase } from "../../../application/use-cases/access/GetAccessLogByIdUseCase";
import { UpdateAccessLogUseCase } from "../../../application/use-cases/access/UpdateAccessLogUseCase";
import { DeleteAccessLogUseCase } from "../../../application/use-cases/access/DeleteAccessLogUseCase";
import { GetAccessLogsLast7DaysUseCase } from "../../../application/use-cases/access/GetAccessLogsLast7DaysUseCase";
import { GetAccessStatusCountsUseCase } from "../../../application/use-cases/access/GetAccessStatusCountsUseCase";
import { GetRecentAccessLogsUseCase } from "../../../application/use-cases/access/GetRecentAccessLogsUseCase";

const router = Router();
const accessLogRepository = new PrismaAccessLogRepository();

const createAccessLogUseCase = new CreateAccessLogUseCase(
  accessLogRepository,
  eventEmitter,
);
const registerExitUseCase = new RegisterExitUseCase(accessLogRepository);
const getAllAccessLogsUseCase = new GetAllAccessLogsUseCase(
  accessLogRepository,
);
const getAccessLogByIdUseCase = new GetAccessLogByIdUseCase(
  accessLogRepository,
);
const updateAccessLogUseCase = new UpdateAccessLogUseCase(accessLogRepository);
const deleteAccessLogUseCase = new DeleteAccessLogUseCase(accessLogRepository);
const getLast7DaysUseCase = new GetAccessLogsLast7DaysUseCase(
  accessLogRepository,
);
const getStatusCountsUseCase = new GetAccessStatusCountsUseCase(
  accessLogRepository,
);
const getRecentUseCase = new GetRecentAccessLogsUseCase(accessLogRepository);

const accessLogController = new AccessLogController(
  createAccessLogUseCase,
  registerExitUseCase,
  getAllAccessLogsUseCase,
  getAccessLogByIdUseCase,
  updateAccessLogUseCase,
  deleteAccessLogUseCase,
  getLast7DaysUseCase,
  getStatusCountsUseCase,
  getRecentUseCase,
);

router.use(authMiddleware);
router.post("/", accessLogController.create);
router.post("/:id/exit", accessLogController.registerExit);
router.get("/", accessLogController.getAll);
router.get("/last7days", accessLogController.getLast7Days);
router.get("/status-counts", accessLogController.getStatusCounts);
router.get("/recent", accessLogController.getRecent);
router.get("/:id", accessLogController.getById);
router.put("/:id", accessLogController.update);
router.delete("/:id", accessLogController.delete);

export default router;

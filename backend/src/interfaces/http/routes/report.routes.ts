import { Router } from "express";
import { ReportController } from "../controllers/ReportController";
import { authMiddleware } from "../middlewares/auth";
import { PrismaAccessLogRepository } from "../../../infrastructure/persistence/prisma/repositories/PrismaAccessLogRepository";
import { GetReportDataUseCase } from "../../../application/use-cases/reports/GetReportDataUseCase";

const router = Router();
const accessLogRepository = new PrismaAccessLogRepository();
const getReportDataUseCase = new GetReportDataUseCase(accessLogRepository);
const reportController = new ReportController(getReportDataUseCase);

router.use(authMiddleware);
router.get("/", reportController.getReport);

export default router;

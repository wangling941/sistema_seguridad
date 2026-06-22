import { Router } from "express";
import authRoutes from "./auth.routes";
import residentRoutes from "./resident.routes";
import vehicleRoutes from "./vehicle.routes";
import visitorRoutes from "./visitor.routes";
import accessRoutes from "./access.routes";
import reportRoutes from "./report.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/residents", residentRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/visitors", visitorRoutes);
router.use("/access-logs", accessRoutes);
router.use("/reports", reportRoutes);

export { router };

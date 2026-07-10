import { Router } from "express";

import authRoutes from "./auth.routes";
import healthRouter from "./health.routes";

const router: Router = Router();

router.use(`/health`, healthRouter);
router.use("/auth", authRoutes);

export default router;

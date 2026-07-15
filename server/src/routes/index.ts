import express, { type Router } from "express";

import authRouter from "./auth.route";
import healthRouter from "./health.route";

const router: Router = express.Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);

export default router;

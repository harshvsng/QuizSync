import express, { type Router } from "express";

import authRouter from "./auth";
import healthRouter from "./health";

const router: Router = express.Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);

export default router;

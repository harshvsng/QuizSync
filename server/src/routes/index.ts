import express, { type Router } from "express";

import authRouter from "./auth.route";
import quizRouter from "./quiz.route";
import healthRouter from "./health.route";

const router: Router = express.Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/quiz", quizRouter);

export default router;

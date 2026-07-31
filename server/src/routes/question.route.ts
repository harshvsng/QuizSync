import express, { type Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { asyncHandler } from "../middlewares/async-handler";
import QuestionController from "../controllers/question.controller";

const router: Router = express.Router();

const questionController = QuestionController.getInstance();

router.get(
  "/topics",
  asyncHandler(requireAuth),
  asyncHandler(questionController.getTopics)
);

export default router;

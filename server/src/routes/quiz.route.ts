import express, { type Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import QuizController from "../controllers/quiz.controller";
import validate from "../middlewares/validate.middleware";
import { asyncHandler } from "../middlewares/async-handler";
import { createSchema, getSpecificSchema } from "../validators/quiz.validator";

const router: Router = express.Router();

const quizController = QuizController.getInstance();

router.post(
  "/create",
  validate(createSchema),
  asyncHandler(requireAuth),
  asyncHandler(quizController.create)
);

router.get(
  "/:id",
  validate(getSpecificSchema),
  asyncHandler(requireAuth),
  asyncHandler(quizController.getSpecific)
);
export default router;

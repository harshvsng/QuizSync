import express, { type Router } from "express";
import AuthController from "../controllers/auth.controller";
import { asyncHandler } from "../middlewares/async-handler";
import validate from "../middlewares/validate.middleware";
import { signupSchema } from "../validators/auth.validator";

const router: Router = express.Router();

const authController = AuthController.getInstance();

router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(authController.signup)
);

export default router;

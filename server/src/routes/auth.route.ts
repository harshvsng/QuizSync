import express, { type Router } from "express";
import AuthController from "../controllers/auth.controller";
import { asyncHandler } from "../middlewares/async-handler";
import validate from "../middlewares/validate.middleware";
import { loginSchema, signupSchema } from "../validators/auth.validator";

const router: Router = express.Router();

const authController = AuthController.getInstance();

router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(authController.signup)
);
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(authController.login)
);

export default router;

import express, { type Router } from "express";
import AuthController from "../controllers/auth.controller";
import { asyncHandler } from "../middlewares/async-handler";
import validate from "../middlewares/validate.middleware";
import {
  loginSchema,
  sessionSchema,
  signupSchema,
} from "../validators/auth.validator";
import { requireAuth } from "../middlewares/auth.middleware";

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

router.get(
  "/session",
  validate(sessionSchema),
  asyncHandler(requireAuth),
  asyncHandler(authController.session)
);

export default router;

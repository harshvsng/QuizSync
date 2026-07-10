import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler";
import AuthController from "../controllers/auth.controller";
import validate from "../middlewares/validate.middleware";
import { signupSchema } from "../validators/auth.schema";

const router: Router = Router();

const authController = AuthController.getInstance();

router.post(
  "/send-otp",
  validate(signupSchema),
  asyncHandler(authController.sendOTP)
);

export default router;

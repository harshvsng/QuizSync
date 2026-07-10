import { Request, Response } from "express";
import AuthService from "../services/auth.service";
export default class AuthController {
  // 1. Hold the single instance in a private static property
  private static instance: AuthController | null = null;

  // 2. Make the constructor private to block 'new AuthController()'
  private constructor() {}

  // 3. Provide a public static method to control access
  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  async sendOTP(req: Request, res: Response) {
    const authService = AuthService.getInstance();

    const otpRef = await authService.sendOTP({
      phone: req.body.phone,
      type: req.body.type,
    });

    res.json({ otpRef });
  }
}

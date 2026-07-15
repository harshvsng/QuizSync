import { Request, Response } from "express";
import AuthService from "../services/auth.service";

const authService = AuthService.getInstance();

export default class AuthController {
  private static instance: AuthController | null = null;

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  public async signup(req: Request, res: Response) {
    const accessToken = await authService.signup({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      type: req.body.type,
    });

    res.json({ accessToken });
  }
}

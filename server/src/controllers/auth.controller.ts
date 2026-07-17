import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { StatusCodes } from "http-status-codes";
import { IExtendedRequest } from "../types/common";
import assert from "node:assert";

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

    res.status(StatusCodes.CREATED).json({ accessToken });
  }
  public async login(req: Request, res: Response) {
    const accessToken = await authService.login({
      email: req.body.email,
      password: req.body.password,
    });

    res.status(StatusCodes.OK).json({ accessToken });
  }

  public async session(req: IExtendedRequest, res: Response) {
    assert(req.user !== undefined, "req.user must be valid");

    res.status(StatusCodes.OK).json(req.user);
  }
}

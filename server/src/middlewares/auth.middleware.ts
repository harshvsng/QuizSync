import type { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyAccessToken } from "../utils/jwt";
import AppError from "../errors/app-error";
import UserModel from "../models/user.model";
import { IExtendedRequest } from "../types/common";
import { ISession } from "../types/auth";

export const requireAuth = async (
  req: IExtendedRequest,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    throw new AppError("Unauthorised", StatusCodes.UNAUTHORIZED);
  }

  const token = header.split(" ")[1];
  if (!token) {
    throw new AppError("Unauthorised", StatusCodes.UNAUTHORIZED);
  }

  const payload = verifyAccessToken(token);

  const userSession = await UserModel.findById(payload.sub);

  if (!userSession) {
    throw new AppError("Unauthorised", StatusCodes.UNAUTHORIZED);
  }

  req.user = {
    _id: userSession._id.toString(),
    name: userSession.name,
    email: userSession.email,
    type: userSession.type,
  } as ISession;

  next();
};

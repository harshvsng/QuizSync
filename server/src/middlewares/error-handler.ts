import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../errors/app-error";

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    console.log({ err }, "Operational error");

    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  console.log({ err }, "Unhandled error");

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: "Internal Server Error",
  });
  return;
}

import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodType } from "zod";
import { fromError } from "zod-validation-error";
import AppError from "../errors/app-error";

const validate =
    (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        if (result.error) {
            throw new AppError(
                fromError(result.error).message,
                StatusCodes.UNPROCESSABLE_ENTITY
            );
        }
        next();
    };
export default validate;

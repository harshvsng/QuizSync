import type { Request } from "express";
import { ISession } from "./auth";

export interface IExtendedRequest extends Request {
  user?: ISession;
}

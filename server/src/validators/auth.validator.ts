import { z } from "zod";
import { USER_ROLES } from "../constants";

export const signupSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(50),
      email: z.email().max(100),
      password: z.string().min(8).max(50),
      type: z.enum(USER_ROLES),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});


export const loginSchema = z.object({
  body: z
    .object({
      email: z.email().max(100),
      password: z.string().min(8).max(50),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

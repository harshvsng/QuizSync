import { sign, SignOptions, verify } from "jsonwebtoken";

export const signAccessToken = (userId: string) =>
  sign({ sub: userId }, process.env["JWT_ACCESS_SECRET"] as string, {
    expiresIn: process.env["ACCESS_TOKEN_TTL"] as SignOptions["expiresIn"],
    issuer: "QuizSync",
  });

export const verifyAccessToken = (token: string) =>
  verify(token, process.env["JWT_ACCESS_SECRET"]!);

import { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import logger from "../infra/logger/logger";
import { registerQuizHandlers } from "./handlers/quizHandler";

declare module "socket.io" {
  interface Socket {
    userId?: string;
  }
}

export function initSocketServer(
  server: HttpServer,
  allowedOrigins: string | string[]
) {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    const authHeader = socket.handshake.auth?.token;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    try {
      const decoded = jwt.verify(token, process.env["JWT_ACCESS_SECRET"]!) as {
        sub: string;
      };
      socket.userId = decoded.sub;
      next();
    } catch {
      next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.userId!;

    // 1. Uncomment this log so you can see successful connections
    socket.join(`user:${userId}`);
    logger.info(
      `User ${userId} connected successfully via socket: ${socket.id}`
    );

    registerQuizHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      logger.info(
        `Client disconnected (${socket.id}) for user ${userId}: ${reason}`
      );
    });
  });

  return io;
}

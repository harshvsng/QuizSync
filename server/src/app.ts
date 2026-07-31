
import express, { type Express } from "express";
import router from "./routes";
import { notFound } from "./middlewares/not-found";
import errorHandler from "./middlewares/error-handler";
import rateLimit from "express-rate-limit";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./infra/database/mongodb";
import { loadEnvFile } from "node:process";
import { connectRedis, disconnectRedis } from "./infra/redis/redis";
import { validateEnvVars } from "./utils/env";
import morgan from "morgan";
import logger from "./infra/logger/logger";
// Import your new detached socket initialiser
import { initSocketServer } from "./socket";

const app: Express = express();

(async () => {
  loadEnvFile(".env");
  validateEnvVars();
  await connectDB();
  connectRedis();
})();

const allowedOrigins =
  process.env["NODE_ENV"] === "development"
    ? "http://localhost:3000"
    : ["https://mydomain.com"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});

app.use(limiter);
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));
app.use("/", router);
app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env["PORT"], () => {
  logger.info(`Application is running at ${process.env["PORT"]}`);
});

// PASS BOTH THE APPLICATION SERVER REFERENCE AND DYNAMIC ORIGINS AT INITIALISATION
initSocketServer(server, allowedOrigins);

async function shutdown(signal: string) {
  logger.error(`${signal} received — shutting down`);
  server.close(async () => {
    await mongoose.connection.close();
    await disconnectRedis();
    logger.info("Shutdown complete");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error(reason, "Unhandled promise rejection");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.error(err, "Uncaught exception");
  process.exit(1);
});

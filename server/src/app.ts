import express from "express";
import logger from "./infra/logger/logger";
import { connectDB } from "./infra/database/mongodb";
import { notFound } from "./middlewares/not-found";
import errorHandler from "./middlewares/error-handler";
import cors from "cors";
import rateLimit from "express-rate-limit";
import router from "./routes";
import mongoose from "mongoose";
import redis from "./infra/redis/redis";

const PORT = process.env["PORT"];

const app = express();

(async () => {
  await connectDB();
})();

app.use(
  cors({
    origin:
      process.env["NODE_ENV"] === "development"
        ? "http://localhost:3000"
        : ["https://mydomain.com"],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});

app.use(limiter);

app.use(express.json({ limit: "10kb" }));

app.use("/", router);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`App listening on ${PORT}`);
});

async function shutdown(signal: string) {
  logger.info(`${signal} received — shutting down`);
  server.close(async () => {
    // stop accepting new connections
    await mongoose.connection.close(); // close MongoDB
    await redis.quit(); // close Redis
    logger.info("Shutdown complete");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C in dev

process.on("unhandledRejection", (reason) => {
  logger.fatal(reason, "Unhandled promise rejection");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.fatal(err, "Uncaught exception");
  process.exit(1);
});

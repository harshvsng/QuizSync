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

const app: Express = express();

(async () => {
  loadEnvFile(".env");
  validateEnvVars();
  await connectDB();
  connectRedis();
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

const server = app.listen(process.env["PORT"], () => {
  console.log(`Application is running at ${process.env["PORT"]}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received — shutting down`);
  server.close(async () => {
    // stop accepting new connections
    await mongoose.connection.close(); // close MongoDB
    await disconnectRedis(); // close Redis
    console.log("Shutdown complete");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C in dev

process.on("unhandledRejection", (reason) => {
  console.log(reason, "Unhandled promise rejection");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log(err, "Uncaught exception");
  process.exit(1);
});

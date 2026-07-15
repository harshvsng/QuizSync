import { Redis } from "ioredis";
import logger from "../logger/logger";

let redis: Redis | null = null;

export const connectRedis = () => {
  redis = new Redis(process.env["REDIS_URL"]!, { enableReadyCheck: true });

  redis.on("connect", () => {
    logger.info("Redis connecting...");
  });

  redis.on("ready", () => {
    logger.info("Redis connected");
  });

  redis.on("error", (err: unknown) => {
    logger.error({ err }, "Redis error");
  });

  redis.on("close", () => {
    logger.info("Redis connection closed");
  });
};

export const disconnectRedis = async () => {
  await redis!.quit();
};

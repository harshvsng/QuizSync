import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { checkRedis } from "../infra/redis/redis";
import { asyncHandler } from "../middlewares/async-handler";
import { utcTime } from "../utils/time";
import { checkMongoDB } from "../infra/database/mongodb";

const router: Router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const checks = await Promise.allSettled([checkMongoDB(), checkRedis()]);

    const mongodb =
      checks[0].status === "fulfilled"
        ? checks[0].value
        : { status: "down", error: checks[0].reason.message };

    const redis =
      checks[1].status === "fulfilled"
        ? checks[1].value
        : { status: "down", error: checks[1].reason.message };

    const isHealthy = mongodb.status === "up" && redis.status === "up";

    res
      .status(isHealthy ? StatusCodes.OK : StatusCodes.SERVICE_UNAVAILABLE)
      .json({
        status: isHealthy ? "ok" : "degraded",
        services: {
          mongodb,
          redis,
        },
        timestamp: utcTime(),
      });
  })
);

export default router;

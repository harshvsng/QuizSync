import { Redis } from "ioredis";

const redis = new Redis(process.env["REDIS_URL"]!, { enableReadyCheck: true });

redis.on("connect", () => {
    console.log("Redis connecting...");
});

redis.on("ready", () => {
    console.log("Redis connected");
});

redis.on("error", (err: unknown) => {
    console.log({ err }, "Redis error");
});

redis.on("close", () => {
    console.log("Redis connection closed");
});

export default redis;

import mongoose from "mongoose";
import logger from "../../infra/logger/logger";
import { utcTime } from "../../utils/time";

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(process.env[`DATABASE_URL`]!, {
    appName: `real-time-collaboration-app`,
  });

  logger.info(`Connected to the MongoDB`);
};

export async function checkMongoDB() {
  try {
    const start = utcTime();

    if (mongoose.connection.readyState === 1) {
      return {
        status: "up",
        latencyMs: utcTime().diff(start),
      };
    }

    return {
      status: "down",
      error: "Unknown issue",
    };
  } catch (error) {
    return {
      status: "down",
      error: (error as unknown as { code?: string }).code ?? "Unknown issue",
    };
  }
}

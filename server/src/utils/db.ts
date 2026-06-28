import mongoose from "mongoose";
import logger from "../infra/logger";

export const connectDB = async () => {
  logger.info(`Trying to connect to the Database (MongoDB)`);
  await mongoose.connect(process.env[`DATABASE_URL`]!, {
    appName: `real-time-collaboration-app`,
  });
  logger.info(`Connected to the Database (MongoDB)`);
};

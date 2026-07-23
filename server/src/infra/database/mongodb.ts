import mongoose from "mongoose";
import logger from "../logger/logger";

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(process.env[`DATABASE_URL`]!, {
    appName: `QuizSync`,
  });

  logger.info(`Connected to the MongoDB`);
};

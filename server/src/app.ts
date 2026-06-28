import express from "express";
import logger from "./infra/logger";
import { connectDB } from "./utils/db";

const PORT = process.env["PORT"];

const app = express();

app.listen(PORT, () => {
  logger.info(`App listening on ${PORT}`);
});

(async () => {
  await connectDB();
})();

import { loadEnvFile } from "node:process";
import { validateEnvVars } from "../../config/env";
import pino from "pino";

loadEnvFile();

validateEnvVars();

const env = process.env["NODE_ENV"];

const isDev = env === "development";
const isProd = env === "production";

// Allow override via env (useful later)
// May set isDev level to 'debug' if debugging
const level = process.env["LOG_LEVEL"] || (isDev ? "info" : "warn");

const logger = pino(
  {
    level,

    base: {
      // env,
    },

    timestamp: pino.stdTimeFunctions.isoTime,

    // Prevent accidental sensitive data logging
    redact: {
      paths: ["req.headers.authorization"],
      remove: true,
    },
  },

  // Pretty logs ONLY in dev
  isProd
    ? undefined
    : pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
        },
      }),
);

export default logger;

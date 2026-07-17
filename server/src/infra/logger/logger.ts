import pino from "pino";

const logger = pino({
  /**
   * Set this property to the desired logging level. In order of priority, available levels are:
   *
   * - 'fatal'
   * - 'error'
   * - 'warn'
   * - 'info'
   * - 'debug'
   * - 'trace'
   *
   * The logging level is a __minimum__ level. For instance if `logger.level` is `'info'` then all `'fatal'`, `'error'`, `'warn'`,
   * and `'info'` logs will be enabled.
   *
   * You can pass `'silent'` to disable logging.
   */
  level: `info`, // we can set this from process.env as well. e.g. level: process.env.LOG_LEVEL
  redact: {
    paths: ["password", "accessToken"],
    remove: true,
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "UTC:yyyy-mm-dd HH:MM:ss.l o",
      ignore: "pid,hostname",
    },
  },
});

export default logger;

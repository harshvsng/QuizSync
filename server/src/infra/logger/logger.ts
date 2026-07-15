import pino from "pino";

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true, // Enforces ANSI color codes in terminal output
      // Translates time into human-readable ISO format in UTC
      translateTime: 'yyyy-mm-dd HH:MM:ss.l'
    }
  }
});

export default logger;

import z from "zod";
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.string().transform((val: string) => {
    if (isNaN(Number(val))) {
      throw new Error("PORT is not a valid number string");
    }
  }),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  JWT_ACCESS_SECRET: z.string().min(32).max(150),
  ACCESS_TOKEN_TTL: z.string(),
  APP_URL: z.url(),
});

export const validateEnvVars = () => {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    console.error(`Environment validation error: ${error}`);
    process.exit(1);
  }
};

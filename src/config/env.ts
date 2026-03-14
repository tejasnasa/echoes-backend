const requiredEnvVars = {
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
} as const;

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
}

export const env = requiredEnvVars as {
  [K in keyof typeof requiredEnvVars]: string;
};

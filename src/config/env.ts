import "dotenv/config";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getPort(value: string | undefined): number {
  const port = Number(value ?? "3000");

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return port;
}

export const env = {
  port: getPort(process.env.PORT),
  databaseUrl: getRequiredEnv("DATABASE_URL"),
  corsOrigin: process.env.CORS_ORISIN ?? "http://localhost:5173",
};

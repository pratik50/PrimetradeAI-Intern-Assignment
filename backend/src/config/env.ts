import dotenv from "dotenv";

dotenv.config();

const requiredEnvs = ["DATABASE_URL", "JWT_SECRET"] as const;

for (const envName of requiredEnvs) {
    if (!process.env[envName]) {
        throw new Error(`Missing required environment variable: ${envName}`);
    }
}

export const env = {
    port: Number(process.env.PORT ?? 4000),
    databaseUrl: process.env.DATABASE_URL as string,
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
};

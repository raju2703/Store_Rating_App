import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load .env variables before using them
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set. Ensure the database is provisioned.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",  // adjust path if needed
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

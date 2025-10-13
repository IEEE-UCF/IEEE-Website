import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // Change from "pg" to "postgresql"
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Use "url" instead of "connectionString"
  },
});
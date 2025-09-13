import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ quiet: true });

export default defineConfig({
  schema: "./src/database/models/**/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

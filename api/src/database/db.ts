import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { timestamp } from "drizzle-orm/pg-core";

const db = drizzle(process.env.DATABASE_URL!);

export const withTimestamps = {
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
};

export default db;

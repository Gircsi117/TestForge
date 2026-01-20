import { timestamp } from "drizzle-orm/pg-core";

export const withTimestamps = () => {
  return {
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  };
};

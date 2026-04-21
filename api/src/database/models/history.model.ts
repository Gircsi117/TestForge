import { pgTable, uuid, integer, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./user.model";
import { TestTable } from "./test.model";
import { withTimestamps } from "../cols/timestamp.col";

export type History = typeof HistoryTable.$inferSelect;

export type CreateHistoryArgs = Omit<
  typeof HistoryTable.$inferInsert,
  "id" | "updatedAt" | "createdAt"
>;

export const HistoryTable = pgTable("history", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  testId: uuid("test_id")
    .references(() => TestTable.id, { onDelete: "set null" }),
  testName: varchar("test_name", { length: 255 }).notNull(),
  score: integer("score").notNull().default(0),
  maxScore: integer("max_score").notNull().default(0),
  timeTaken: integer("time_taken").notNull().default(0),

  ...withTimestamps(),
});

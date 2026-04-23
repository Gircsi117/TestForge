import { pgTable, varchar, uuid, integer, check, boolean } from "drizzle-orm/pg-core";
import { withTimestamps } from "../cols/timestamp.col";
import { withCreatedBy } from "../cols/created-by.col";
import { CategoryTable } from "./category.model";
import { sql } from "drizzle-orm";

export type Test = typeof TestTable.$inferSelect;

export type CreateTestArgs = Omit<
  typeof TestTable.$inferInsert,
  "id" | "updatedAt" | "createdAt"
>;
export type UpdateTestArgs = Partial<
  Omit<CreateTestArgs, "id" | "createdBy" | "categoryId">
>;

export const TestTable = pgTable(
  "tests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    questionCount: integer("question_count").notNull().default(0),
    time: integer("time").notNull().default(0),
    allowBack: boolean("allow_back").notNull().default(true),
    shareCode: varchar("share_code", { length: 36 }).unique(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => CategoryTable.id, { onDelete: "cascade" }),

    ...withCreatedBy(),
    ...withTimestamps(),
  },
  (table) => ({
    questionCountCheck: check(
      "question_count_check",
      sql`${table.questionCount} >= 0`,
    ),
  }),
);

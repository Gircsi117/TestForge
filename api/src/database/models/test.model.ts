import { pgTable, varchar, uuid, integer, check } from "drizzle-orm/pg-core";
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

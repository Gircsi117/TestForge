import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { TestTable } from "./test.model";
import { TaskTable } from "./task.model";

export type TestTask = typeof TestTaskTable.$inferSelect;

export const TestTaskTable = pgTable(
  "test_tasks",
  {
    testId: uuid("test_id")
      .notNull()
      .references(() => TestTable.id, { onDelete: "cascade" }),
    taskId: uuid("task_id")
      .notNull()
      .references(() => TaskTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.testId, table.taskId] }),
  }),
);

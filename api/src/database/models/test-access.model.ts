import { pgTable, uuid, boolean, primaryKey } from "drizzle-orm/pg-core";
import { UserTable } from "./user.model";
import { TestTable } from "./test.model";

export type TestAccess = typeof TestAccessTable.$inferSelect;

export const TestAccessTable = pgTable(
  "test_access",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    testId: uuid("test_id")
      .notNull()
      .references(() => TestTable.id, { onDelete: "cascade" }),
    canEdit: boolean("can_edit").notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.userId, t.testId] })],
);

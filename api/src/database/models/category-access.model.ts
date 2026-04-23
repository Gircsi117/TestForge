import { pgTable, uuid, boolean, primaryKey } from "drizzle-orm/pg-core";
import { UserTable } from "./user.model";
import { CategoryTable } from "./category.model";

export type CategoryAccess = typeof CategoryAccessTable.$inferSelect;

export const CategoryAccessTable = pgTable(
  "category_access",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => CategoryTable.id, { onDelete: "cascade" }),
    canEdit: boolean("can_edit").notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.userId, t.categoryId] })],
);

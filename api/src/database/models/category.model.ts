import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { json } from "drizzle-orm/pg-core";
import { withTimestamps } from "../cols/timestamp.col";

export type Category = typeof CategoryTable.$inferSelect;

export type CreateCategoryArgs = Omit<
  typeof CategoryTable.$inferInsert,
  "id" | "updatedAt" | "createdAt"
>;
export type UpdateCategoryArgs = Partial<
  Omit<CreateCategoryArgs, "id" | "createdBy">
>;

export const CategoryTable = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1024 }),
  createdBy: uuid("created_by").notNull(),

  // CreatedAt and UpdatedAt timestamps
  ...withTimestamps(),
});

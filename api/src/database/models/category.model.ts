import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { withTimestamps } from "../db";

export type Category = typeof CategoryTable.$inferSelect;

export type CreateCategoryArgs = Omit<
  typeof CategoryTable.$inferInsert,
  "id" | "updatedAt" | "createdAt"
>;
export type UpdateCategoryArgs = Partial<Omit<CreateCategoryArgs, "id">>;

export const CategoryTable = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1024 }),
  createdBy: uuid("userId").notNull(),

  // CreatedAt and UpdatedAt timestamps
  ...withTimestamps,
});

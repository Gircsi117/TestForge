import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { withTimestamps } from "../db";

export type User = typeof UserTable.$inferSelect;

export type UserRoles = "USER" | "ADMIN";

export type CreateUserArgs = Omit<
  typeof UserTable.$inferInsert,
  "id" | "updatedAt" | "createdAt"
>;
export type UpdateUserArgs = Partial<Omit<CreateUserArgs, "id">>;

export const UserTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone: varchar({ length: 255 }),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 50 }).$type<UserRoles>().notNull().default("USER"),

  // CreatedAt and UpdatedAt timestamps
  ...withTimestamps,
});

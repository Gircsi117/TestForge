import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export type User = typeof UserTable.$inferSelect;

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
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

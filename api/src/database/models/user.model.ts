import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export type User = typeof userTable.$inferSelect;

export type CreateUserArgs = Omit<
  typeof userTable.$inferInsert,
  "id" | "updatedAt" | "createdAt"
>;
export type UpdateUserArgs = Partial<Omit<CreateUserArgs, "id">>;

export const userTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phone: varchar({ length: 255 }),
  password: varchar({ length: 255 }),
  createdAt: timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
});

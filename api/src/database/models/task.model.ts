import { pgTable, varchar, uuid, json } from "drizzle-orm/pg-core";
import { CategoryTable } from "./category.model";
import { withTimestamps } from "../cols/timestamp.col";
import { UserTable } from "./user.model";
import { withCreatedBy } from "../cols/created-by.col";

export type Task = typeof TaskTable.$inferSelect;

export type CreateTaskArgs = Omit<
  typeof TaskTable.$inferInsert,
  "id" | "updatedAt" | "createdAt"
>;
export type UpdateTaskArgs = Partial<Omit<CreateTaskArgs, "id">>;

export enum TaskType {
  SINGLE_PICK = "SINGLE_PICK",
  MULTI_PICK = "MULTI_PICK",
  SORTING = "SORTING",
  MATCHING = "MATCHING",
  ESSAY = "ESSAY",
}

export type PickOptions = {
  text: string;
  isCorrect: boolean;
}[];

export type SortOptions = {
  text: string;
  index: number;
}[];

export type MatchOptions = {
  groups: string[];
  items: {
    text: string;
    group: string;
  }[];
};

export type TaskOptions = PickOptions | SortOptions | MatchOptions | null;

export const TaskTable = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: varchar({ length: 50 }).notNull().$type<TaskType>(),
  description: varchar({ length: 1024 }).notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => CategoryTable.id, { onDelete: "cascade" }),
  options: json("options").$type<TaskOptions>(),

  ...withCreatedBy(),
  ...withTimestamps(),
});

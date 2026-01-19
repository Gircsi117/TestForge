import { pgTable, varchar, uuid, json } from "drizzle-orm/pg-core";
import { withTimestamps } from "../db";
import { CategoryTable } from "./category.model";

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

type PickOptions = {
  text: string;
  isCorrect: boolean;
}[];

type SortOptions = {
  text: string;
  index: number;
}[];

type MatchOptions = {
  groups: string[];
  items: {
    text: string;
    group: string;
  }[];
};

type Options = PickOptions | SortOptions | MatchOptions | null;

export const TaskTable = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 50 }).notNull().$type<TaskType>(),
  description: varchar({ length: 1024 }).notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => CategoryTable.id, { onDelete: "cascade" }),
  options: json("options").$type<Options>(),
  createdBy: uuid("created_by").notNull(),

  // CreatedAt and UpdatedAt timestamps
  ...withTimestamps,
});

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
  TRUE_FALSE = "TRUE_FALSE",
  SORTING = "SORTING",
  MATCHING = "MATCHING",
  ESSAY = "ESSAY",
}

type OptionPick = {
  index: number;
  text: string;
  isCorrect: boolean;
}[];

type OptionSorting = {
  index: number;
  text: string;
}[];

type OptionMatching = {
  [key: string]: { index: number; text: string }[];
};

export const TaskTable = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 50 }).notNull().$type<TaskType>(),
  description: varchar({ length: 1024 }).notNull(),
  categoryId: uuid("categoryId")
    .notNull()
    .references(() => CategoryTable.id, { onDelete: "cascade" }),
  options: json("options").$type<
    OptionPick | OptionSorting | OptionMatching | null
  >(),
  createdBy: uuid("userId").notNull(),

  // CreatedAt and UpdatedAt timestamps
  ...withTimestamps,
});

import { relations } from "drizzle-orm";
import { CategoryTable } from "./models/category.model";
import { UserTable } from "./models/user.model";
import { TaskTable } from "./models/task.model";


export const usersRelations = relations(UserTable, ({ many }) => ({
  categories: many(CategoryTable),
  tasks: many(TaskTable),
}));

export const categoriesRelations = relations(CategoryTable, ({ one, many }) => ({
  creator: one(UserTable, {
    fields: [CategoryTable.createdBy],
    references: [UserTable.id],
  }),
  tasks: many(TaskTable),
}));

export const tasksRelations = relations(TaskTable, ({ one }) => ({
  category: one(CategoryTable, {
    fields: [TaskTable.categoryId],
    references: [CategoryTable.id],
  }),
  creator: one(UserTable, {
    fields: [TaskTable.createdBy],
    references: [UserTable.id],
  }),
}));
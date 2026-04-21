import { relations } from "drizzle-orm";
import { CategoryTable } from "./models/category.model";
import { UserTable } from "./models/user.model";
import { TaskTable } from "./models/task.model";
import { TestTable } from "./models/test.model";
import { TestTaskTable } from "./models/test-task.model";

export const userRelations = relations(UserTable, ({ many }) => ({
  categories: many(CategoryTable),
  tasks: many(TaskTable),
}));

export const categoryRelations = relations(CategoryTable, ({ one, many }) => ({
  creator: one(UserTable, {
    fields: [CategoryTable.createdBy],
    references: [UserTable.id],
  }),
  tasks: many(TaskTable),
}));

export const taskRelations = relations(TaskTable, ({ one, many }) => ({
  category: one(CategoryTable, {
    fields: [TaskTable.categoryId],
    references: [CategoryTable.id],
  }),
  creator: one(UserTable, {
    fields: [TaskTable.createdBy],
    references: [UserTable.id],
  }),
  testTasks: many(TestTaskTable),
}));

export const testRelations = relations(TestTable, ({ one, many }) => ({
  category: one(CategoryTable, {
    fields: [TestTable.categoryId],
    references: [CategoryTable.id],
  }),
  creator: one(UserTable, {
    fields: [TestTable.createdBy],
    references: [UserTable.id],
  }),
  testTasks: many(TestTaskTable),
}));

export const testTaskRelations = relations(TestTaskTable, ({ one }) => ({
  test: one(TestTable, {
    fields: [TestTaskTable.testId],
    references: [TestTable.id],
  }),
  task: one(TaskTable, {
    fields: [TestTaskTable.taskId],
    references: [TaskTable.id],
  }),
}));

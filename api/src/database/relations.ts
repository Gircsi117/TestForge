import { relations } from "drizzle-orm";
import { CategoryTable } from "./models/category.model";
import { UserTable } from "./models/user.model";
import { TaskTable } from "./models/task.model";
import { TestTable } from "./models/test.model";
import { TestTaskTable } from "./models/test-task.model";
import { HistoryTable } from "./models/history.model";
import { CategoryAccessTable } from "./models/category-access.model";
import { TestAccessTable } from "./models/test-access.model";

export const userRelations = relations(UserTable, ({ many }) => ({
  categories: many(CategoryTable),
  tasks: many(TaskTable),
  history: many(HistoryTable),
  categoryAccesses: many(CategoryAccessTable),
  testAccesses: many(TestAccessTable),
}));

export const categoryRelations = relations(CategoryTable, ({ one, many }) => ({
  creator: one(UserTable, {
    fields: [CategoryTable.createdBy],
    references: [UserTable.id],
  }),
  tasks: many(TaskTable),
  accesses: many(CategoryAccessTable),
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
  history: many(HistoryTable),
  accesses: many(TestAccessTable),
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

export const historyRelations = relations(HistoryTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [HistoryTable.userId],
    references: [UserTable.id],
  }),
  test: one(TestTable, {
    fields: [HistoryTable.testId],
    references: [TestTable.id],
  }),
}));

export const categoryAccessRelations = relations(
  CategoryAccessTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [CategoryAccessTable.userId],
      references: [UserTable.id],
    }),
    category: one(CategoryTable, {
      fields: [CategoryAccessTable.categoryId],
      references: [CategoryTable.id],
    }),
  }),
);

export const testAccessRelations = relations(TestAccessTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [TestAccessTable.userId],
    references: [UserTable.id],
  }),
  test: one(TestTable, {
    fields: [TestAccessTable.testId],
    references: [TestTable.id],
  }),
}));

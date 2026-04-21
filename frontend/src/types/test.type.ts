import type { Category } from "./category.type";
import type { Task } from "./task.type";

export type Test = {
  id: string;
  name: string;
  questionCount: number;
  time: number;
  allowBack: boolean;
  categoryId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;

  category: Category;
  tasks?: Task[];
};

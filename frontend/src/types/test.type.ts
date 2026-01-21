import type { Category } from "./category.type";

export type Test = {
  id: string;
  name: string;
  questionCount: number;
  categoryId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;

  category: Category;
};

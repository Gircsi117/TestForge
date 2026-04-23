import type { Category } from "./category.type";
import type { Task } from "./task.type";

export type Test = {
  id: string;
  name: string;
  questionCount: number;
  time: number;
  allowBack: boolean;
  shareCode: string | null;
  categoryId: string;
  createdBy: string;
  creator: { id: string; name: string };
  isOwner: boolean;
  canEdit: boolean;
  createdAt: string;
  updatedAt: string;

  category: Category;
  tasks?: Task[];
};

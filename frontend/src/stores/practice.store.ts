import { create } from "zustand";
import type { Task } from "../types/task.type";

interface PracticeState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;

  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;
}

export const usePracticeStore = create<PracticeState>((set) => ({
  tasks: [],
  setTasks: (tasks: Task[]) => set({ tasks }),
  currentTask: null,
  setCurrentTask: (task: Task | null) => set({ currentTask: task }),
}));

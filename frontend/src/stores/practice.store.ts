import { create } from "zustand";
import type { Task, TaskOptions } from "../types/task.type";

interface PracticeState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;

  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;

  answers: Map<string, TaskOptions | string>;
  setAnswer: (taskId: string, answer: TaskOptions | string) => void;
  clearAnswers: () => void;

  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
}

export const usePracticeStore = create<PracticeState>((set) => ({
  tasks: [],
  setTasks: (tasks: Task[]) => set({ tasks }),
  currentTask: null,
  setCurrentTask: (task: Task | null) => set({ currentTask: task }),
  answers: new Map(),
  setAnswer: (taskId: string, answer: TaskOptions | string) =>
    set((state) => ({ answers: state.answers.set(taskId, answer) })),
  clearAnswers: () => set({ answers: new Map() }),
  isDone: false,
  setIsDone: (isDone: boolean) => set({ isDone }),
}));

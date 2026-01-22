import { create } from "zustand";
import type { Task, TaskOptions } from "../types/task.type";

interface PracticeState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;

  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;

  answers: Map<string, TaskOptions | string>;
  setAnswer: (taskId: string, answer: TaskOptions | string) => void;
  setAnswers: (answers: Map<string, TaskOptions | string>) => void;
  clearAnswers: () => void;

  isDone: boolean;
  setIsDone: (isDone: boolean) => void;

  reset: () => void;
}

export const usePracticeStore = create<PracticeState>((set) => ({
  tasks: [],
  setTasks: (tasks: Task[]) => set({ tasks }),
  currentTask: null,
  setCurrentTask: (task: Task | null) => set({ currentTask: task }),
  answers: new Map(),
  setAnswer: (taskId: string, answer: TaskOptions | string) =>
    set((state) => {
      const newAnswers = new Map(state.answers);
      newAnswers.set(taskId, answer);
      return { answers: newAnswers };
    }),
  clearAnswers: () => set({ answers: new Map() }),
  setAnswers: (answers: Map<string, TaskOptions | string>) =>
    set({ answers: new Map(answers) }),

  isDone: false,
  setIsDone: (isDone: boolean) => set({ isDone }),

  reset: () =>
    set({
      tasks: [],
      currentTask: null,
      answers: new Map(),
      isDone: false,
    }),
}));

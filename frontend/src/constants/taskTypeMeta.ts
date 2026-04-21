import { TaskType } from "../types/task.type";

export const TASK_TYPE_META: Record<
  TaskType,
  { label: string; color: string; bg: string }
> = {
  [TaskType.SINGLE_PICK]: {
    label: "Egyválasztós",
    color: "#60a5fa",
    bg: "rgba(37,99,235,0.15)",
  },
  [TaskType.MULTI_PICK]: {
    label: "Többválasztós",
    color: "#a78bfa",
    bg: "rgba(109,40,217,0.15)",
  },
  [TaskType.SORTING]: {
    label: "Sorrend",
    color: "#fb923c",
    bg: "rgba(234,88,12,0.15)",
  },
  [TaskType.MATCHING]: {
    label: "Párosítás",
    color: "#34d399",
    bg: "rgba(5,150,105,0.15)",
  },
  [TaskType.ESSAY]: {
    label: "Esszé",
    color: "#94a3b8",
    bg: "rgba(100,116,139,0.15)",
  },
};

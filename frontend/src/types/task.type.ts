export type Task = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    categoryId: string;
    description: string;
    createdBy: string;
    type: TaskType;
    options: TaskOptions;
};

export enum TaskType {
  SINGLE_PICK = "SINGLE_PICK",
  MULTI_PICK = "MULTI_PICK",
  SORTING = "SORTING",
  MATCHING = "MATCHING",
  ESSAY = "ESSAY",
}

export type PickOptions = {
  text: string;
  isCorrect: boolean;
}[];

export type SortOptions = {
  text: string;
  index: number;
}[];

export type MatchOptions = {
  groups: string[];
  items: {
    text: string;
    group: string;
  }[];
};

export type TaskOptions = PickOptions | SortOptions | MatchOptions | null;
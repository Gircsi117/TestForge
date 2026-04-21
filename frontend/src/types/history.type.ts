import type { Test } from "./test.type";

export type History = {
  id: string;
  userId: string;
  testId: string | null;
  testName: string;
  score: number;
  maxScore: number;
  timeTaken: number;
  createdAt: string;
  updatedAt: string;

  test?: Test | null;
};

export const randomSort = <T>(options: T[]): T[] => {
  return options.sort(() => Math.random() - 0.5);
};

export const getMonogram = (name: string) =>
  (name || "").trim().charAt(0).toUpperCase();

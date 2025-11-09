export enum UserRoles {
  USER = "USER",
  ADMIN = "ADMIN",
}

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRoles;
  createdAt: Date;
  updatedAt: Date;
};

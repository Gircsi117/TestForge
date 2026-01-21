import { uuid } from "drizzle-orm/pg-core";
import { UserTable } from "../models/user.model";

export const withCreatedBy = () => ({
  createdBy: uuid("created_by")
    .notNull()
    .references(() => UserTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

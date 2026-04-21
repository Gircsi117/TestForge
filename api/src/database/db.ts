import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { CategoryTable } from "./models/category.model";
import { TaskTable } from "./models/task.model";
import { UserTable } from "./models/user.model";
import { TestTable } from "./models/test.model";
import { TestTaskTable } from "./models/test-task.model";

import * as relations from "./relations";

const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    CategoryTable,
    UserTable,
    TaskTable,
    TestTable,
    TestTaskTable,

    ...relations,
  },
});

export default db;

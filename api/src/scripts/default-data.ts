import { sql } from "drizzle-orm";
import db from "../database/db";
import Server from "../modules/server.module";
import { TestTable } from "../database/models/test.model";
import {
  MatchOptions,
  PickOptions,
  SortOptions,
  TaskTable,
  TaskType,
} from "../database/models/task.model";
import { CategoryTable } from "../database/models/category.model";
import { UserTable } from "../database/models/user.model";
import { HistoryTable } from "../database/models/history.model";
import { CategoryAccessTable } from "../database/models/category-access.model";
import { TestAccessTable } from "../database/models/test-access.model";

async function main() {
  try {
    await Server.init();

    await db.execute(sql`SET session_replication_role = 'replica'`);

    await db.delete(CategoryAccessTable).execute();
    await db.delete(TestAccessTable).execute();
    await db.delete(HistoryTable).execute();
    await db.delete(TestTable).execute();
    await db.delete(TaskTable).execute();
    await db.delete(CategoryTable).execute();
    await db.delete(UserTable).execute();

    await db.execute(sql`SET session_replication_role = 'origin'`);

    const [user, user2] = await db
      .insert(UserTable)
      .values([
        {
          id: "1a4a0616-5b9f-43dc-9344-5874c8082ab2",
          name: "Test User",
          email: "test@tf.com",
          password: await Server.app.bcrypt.hash("test1234"),
        },
        {
          id: "e9c9ef6e-59db-42fe-9bdc-ee189e0f0c5f",
          name: "Test User",
          email: "test2@tf.com",
          password: await Server.app.bcrypt.hash("test12345"),
        },
      ])
      .returning();

    const [cat1, cat2] = await db
      .insert(CategoryTable)
      .values([
        {
          id: "da546af4-6969-4f6b-ac58-9210c7d6e4ac",
          name: "Példa",
          description: "Ez egy példa kategória!",
          createdBy: user!.id,
        },
        {
          id: "04b752ff-5453-456c-ba8e-80e965137b39",
          name: "History",
          description: "Ez egy alap történelem kategória!",
          createdBy: user!.id,
        },
      ])
      .returning();

    const a = await db
      .insert(CategoryAccessTable)
      .values([
        {
          categoryId: cat1!.id,
          userId: user2!.id,
          canEdit: true,
        },
      ])
      .returning();

    const tasks = await db
      .insert(TaskTable)
      .values([
        {
          id: "dba22220-0ae1-4915-9fa6-3eacb25cb67b",
          type: TaskType.ESSAY,
          description: "Fejtse ki miért nem jó ma pályakezdőnek lenni!",
          categoryId: cat1!.id,
          options: {
            content:
              "A pályakezdőknek sok kihívásuk van, például a hiányzó tapasztalat, a nem ismert munkaerő-piac, valamint a magas várakozások.",
          },
          createdBy: user!.id,
        },
        {
          id: "1757b3b8-e832-4bd2-b92e-184889a14e5e",
          type: TaskType.SINGLE_PICK,
          description: "Melyik gyümölcs piros?",
          categoryId: cat1!.id,
          options: [
            {
              text: "Paradicsom",
              isCorrect: true,
            },
            {
              text: "Körte",
              isCorrect: false,
            },
            {
              text: "Szőlő",
              isCorrect: false,
            },
            {
              text: "Szilva",
              isCorrect: false,
            },
            {
              text: "Barack",
              isCorrect: false,
            },
          ] as PickOptions,
          createdBy: user!.id,
        },
        {
          id: "9411b0ec-d068-4cda-a9fd-f9f9d3a7c001",
          type: TaskType.MULTI_PICK,
          description: "Válassza ki a páros számokat!",
          categoryId: cat1!.id,
          options: [
            {
              text: "2",
              isCorrect: true,
            },
            {
              text: "3",
              isCorrect: false,
            },
            {
              text: "4",
              isCorrect: true,
            },
            {
              text: "5",
              isCorrect: false,
            },
            {
              text: "6",
              isCorrect: true,
            },
          ] as PickOptions,
          createdBy: user!.id,
        },
        {
          id: "f57e8a10-78c6-4526-8625-ca0da764f2f6",
          type: TaskType.SORTING,
          description: "Állítsa sorrendbe a számokat növekvő sorrendben!",
          categoryId: cat1!.id,
          createdBy: user!.id,
          options: [
            {
              text: "Első",
              index: 0,
            },
            {
              text: "Második",
              index: 1,
            },
            {
              text: "Harmadik",
              index: 2,
            },
            {
              text: "Negyedik",
              index: 3,
            },
            {
              text: "Ötödik",
              index: 4,
            },
          ] as SortOptions,
        },
        {
          id: "089ab2df-65d2-4d48-a8a4-487362f1d45b",
          type: TaskType.MATCHING,
          description: "Csoportosítsa az elemeket a megfelelő csoportokba!",
          categoryId: cat1!.id,
          createdBy: user!.id,
          options: {
            groups: ["Szórakozás", "Kínzás"],
            items: [
              { text: "Játék", group: "Szórakozás" },
              { text: "Egyetem", group: "Kínzás" },
              { text: "Mozi", group: "Szórakozás" },
              { text: "Értekezlet", group: "Kínzás" },
            ],
          } as MatchOptions,
        },
        {
          id: "90f24b3a-0b65-44fb-8e22-b090307fd4f6",
          type: TaskType.SINGLE_PICK,
          description: "Mikor fedezte fel Kolumbusz Kristóf Amerikát?",
          categoryId: cat2!.id,
          options: [
            {
              text: "1492",
              isCorrect: true,
            },
            {
              text: "1678",
              isCorrect: false,
            },
            {
              text: "1312",
              isCorrect: false,
            },
            {
              text: "2027",
              isCorrect: false,
            },
            {
              text: "Kr.e. 400",
              isCorrect: false,
            },
          ] as PickOptions,
          createdBy: user!.id,
        },
      ])
      .returning();

    const tests = await db
      .insert(TestTable)
      .values([
        {
          id: "0643560e-8ff9-46b7-aaa6-2b3b4e6b37dd",
          name: "Test 1",
          questionCount: 0,
          categoryId: cat1!.id,
          createdBy: user!.id,
        },
      ])
      .returning();

    console.success("Base database set.");
  } catch (error) {
    console.error("Error setting base database:", error);
  }
}

main();

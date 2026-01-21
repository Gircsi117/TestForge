import { sql } from "drizzle-orm";
import db from "../database/db";
import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";
import Server from "../modules/server.module";
import { UserTable } from "../database/models/user.model";
import {
  MatchOptions,
  PickOptions,
  SortOptions,
  TaskTable,
  TaskType,
} from "../database/models/task.model";
import { CategoryTable } from "../database/models/category.model";
import type { FastifyReply, FastifyRequest } from "fastify";

class RootController extends Controller {
  @Route("GET", "/")
  async index(request: FastifyRequest, reply: FastifyReply) {
    return {
      success: true,
      message: "Hello from TestForge API!",
    };
  }

  @Route("GET", "/about")
  async about() {
    return {
      success: true,
      name: "TestForge",
      description: "Tanulást segítő alkalmazás API!",
      creator: {
        name: "Gilián Erik",
        github: "https://github.com/Gircsi117",
      },
    };
  }

  @Route("GET", "/health")
  async getHealth() {
    const uptimeSeconds = process.uptime();

    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: uptimeSeconds,
        formatted: `${hours}h ${minutes}m ${seconds}s`,
      },
      environment: Server.app.config.NODE_ENV,
    };
  }

  @Route("GET", "/save-db")
  async saveDB() {
    return { success: true };
  }

  @Route("GET", "/set-base-database")
  async setBaseDatabase() {
    await db.execute(sql`SET session_replication_role = 'replica'`);

    await db.delete(UserTable).execute();
    await db.delete(TaskTable).execute();
    await db.delete(CategoryTable).execute();

    await db.execute(sql`SET session_replication_role = 'origin'`);

    const [user] = await db
      .insert(UserTable)
      .values({
        id: "1a4a0616-5b9f-43dc-9344-5874c8082ab2",
        name: "Test User",
        email: "test@tf.com",
        password: await Server.app.bcrypt.hash("test1234"),
      })
      .returning();

    const [cat1, cat2] = await db
      .insert(CategoryTable)
      .values([
        {
          id: "da546af4-6969-4f6b-ac58-9210c7d6e4ac",
          name: "Mathematics",
          description: "Ez egy alap matekos kategória!",
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

    const [task] = await db
      .insert(TaskTable)
      .values([
        {
          id: "dba22220-0ae1-4915-9fa6-3eacb25cb67b",
          type: TaskType.ESSAY,
          description: "Describe the Pythagorean theorem.",
          categoryId: cat1!.id,
          options: null,
          createdBy: user!.id,
        },
        {
          id: "1757b3b8-e832-4bd2-b92e-184889a14e5e",
          type: TaskType.SINGLE_PICK,
          description: "Describe the Pythagorean theorem.",
          categoryId: cat1!.id,
          options: [
            {
              text: "Alma",
              isCorrect: true,
            },
            {
              text: "Körte",
              isCorrect: false,
            },
            {
              text: "Tök",
              isCorrect: false,
            },
          ] as PickOptions,
          createdBy: user!.id,
        },
        {
          id: "f57e8a10-78c6-4526-8625-ca0da764f2f6",
          type: TaskType.SORTING,
          description: "Order the following from first to last.",
          categoryId: cat1!.id,
          createdBy: user!.id,
          options: [
            {
              text: "Első",
              index: 1,
            },
            {
              text: "Második",
              index: 2,
            },
            {
              text: "Harmadik",
              index: 3,
            },
          ] as SortOptions,
        },
        {
          id: "089ab2df-65d2-4d48-a8a4-487362f1d45b",
          type: TaskType.MATCHING,
          description: "Describe the Pythagorean theorem.",
          categoryId: cat1!.id,
          createdBy: user!.id,
          options: {
            groups: ["A", "B"],
            items: [
              { text: "Item 1", group: "A" },
              { text: "Item 2", group: "A" },
              { text: "Item 3", group: "B" },
            ],
          } as MatchOptions,
        },
      ])
      .returning();

    console.success("Base database set.");

    return { success: true };
  }
}

export default RootController;

import { sql } from "drizzle-orm";
import db from "../database/db";
import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";
import Server from "../modules/server.module";
import { UserTable } from "../database/models/user.model";
import { TaskTable } from "../database/models/task.model";
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
        name: "Test User",
        email: "test@tf.com",
        password: await Server.app.bcrypt.hash("test1234"),
      })
      .returning();

    const categories = await db.insert(CategoryTable).values([
      {
        name: "Mathematics",
        description: "Ez egy alap matekos kategória!",
        createdBy: user!.id,
      },
      {
        name: "History",
        description: "Ez egy alap történelem kategória!",
        createdBy: user!.id,
      },
    ]);

    console.success("Base database set.");

    return { success: true };
  }
}

export default RootController;

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
import { TestTable } from "../database/models/test.model";

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
}

export default RootController;

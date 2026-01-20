import type { FastifyReply, FastifyRequest } from "fastify";
import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";
import db from "../database/db";
import { and, eq } from "drizzle-orm";
import {
  CreateTaskArgs,
  TaskTable,
  UpdateTaskArgs,
} from "../database/models/task.model";

class TaskController extends Controller {
  @Route("GET", "/:categoryId")
  @Route.Auth()
  async get(
    request: FastifyRequest<{ Params: { categoryId: string } }>,
    reply: FastifyReply,
  ) {
    const { categoryId } = request.params;

    const tasks = db.query.TaskTable.findMany({
      where: eq(TaskTable.categoryId, categoryId),
    });

    return {
      success: true,
      tasks: tasks || [],
    };
  }

  @Route("POST", "/")
  @Route.Auth()
  async create(
    request: FastifyRequest<{ Body: Omit<CreateTaskArgs, "createdBy"> }>,
    reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { type, description, categoryId, options } = request.body;

    const task = await db.transaction(async (tx) => {
      const [task] = await tx
        .insert(TaskTable)
        .values({
          type,
          description,
          categoryId,
          options,
          createdBy: user.id,
        })
        .returning();

      return task || null;
    });

    if (!task) throw new Error("Task creation failed!");

    return {
      success: true,
      task,
    };
  }

  @Route("PUT", "/:id")
  @Route.Auth()
  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Omit<UpdateTaskArgs, "createdBy" | "categoryId">;
    }>,
    reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;
    const { type, description, options } = request.body;

    const task = await db.transaction(async (tx) => {
      const [task] = await tx
        .update(TaskTable)
        .set({
          type,
          description,
          options,
          updatedAt: new Date(),
        })
        .where(and(eq(TaskTable.id, id), eq(TaskTable.createdBy, user.id)))
        .returning();

      return task || null;
    });

    if (!task) throw new Error("Task update failed!");

    return {
      success: true,
      task,
    };
  }

  @Route("DELETE", "/:id")
  @Route.Auth()
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;

    await db
      .delete(TaskTable)
      .where(and(eq(TaskTable.id, id), eq(TaskTable.createdBy, user.id)));

    return {
      success: true,
      message: "Task deleted successfully!",
    };
  }
}

export default TaskController;

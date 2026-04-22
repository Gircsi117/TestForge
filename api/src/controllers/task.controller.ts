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
import { CategoryTable } from "../database/models/category.model";
import { MissingArgumentError, NotFoundError } from "../modules/error.module";

class TaskController extends Controller {
  @Route("GET", "/:categoryId")
  @Route.Auth()
  async getAll(
    request: FastifyRequest<{ Params: { categoryId: string } }>,
    reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { categoryId } = request.params;

    const category = await db.query.CategoryTable.findFirst({
      where: and(
        eq(CategoryTable.id, categoryId),
        eq(CategoryTable.createdBy, user.id),
      ),
    });

    if (!category) {
      throw new NotFoundError("Category not found!");
    }

    const tasks = await db.query.TaskTable.findMany({
      where: eq(TaskTable.categoryId, categoryId),
    });

    return {
      success: true,
      tasks: tasks || [],
    };
  }

  @Route("GET", "/:categoryId/:taskId")
  @Route.Auth()
  async getOne(
    request: FastifyRequest<{ Params: { categoryId: string; taskId: string } }>,
    reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { categoryId, taskId } = request.params;

    const category = await db.query.CategoryTable.findFirst({
      where: and(
        eq(CategoryTable.id, categoryId),
        eq(CategoryTable.createdBy, user.id),
      ),
    });

    if (!category) {
      throw new NotFoundError("Category not found!");
    }

    const task = await db.query.TaskTable.findFirst({
      where: and(
        eq(TaskTable.categoryId, categoryId),
        eq(TaskTable.id, taskId),
      ),
    });

    if (!task) {
      throw new NotFoundError("Task not found!");
    }

    return {
      success: true,
      task: task || null,
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

    if (!categoryId) throw new MissingArgumentError("Category ID is required!");

    const category = await db.query.CategoryTable.findFirst({
      where: and(
        eq(CategoryTable.id, categoryId),
        eq(CategoryTable.createdBy, user.id),
      ),
    });

    if (!category) {
      throw new NotFoundError("Category not found!");
    }

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

      if (!task) throw new Error("Task creation failed!");

      return task || null;
    });

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
        })
        .where(and(eq(TaskTable.id, id), eq(TaskTable.createdBy, user.id)))
        .returning();

      if (!task) throw new NotFoundError("Task not found!");

      return task;
    });

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

    await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(TaskTable)
        .where(and(eq(TaskTable.id, id), eq(TaskTable.createdBy, user.id)))
        .returning();

      if (deleted.length === 0) throw new NotFoundError("Task not found!");
    });

    return {
      success: true,
      message: "Task deleted successfully!",
    };
  }
}

export default TaskController;

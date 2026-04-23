import type { FastifyReply, FastifyRequest } from "fastify";
import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";
import db from "../database/db";
import { and, eq, isNotNull, or } from "drizzle-orm";
import {
  CreateTaskArgs,
  TaskTable,
  UpdateTaskArgs,
} from "../database/models/task.model";
import { CategoryTable } from "../database/models/category.model";
import { CategoryAccessTable } from "../database/models/category-access.model";
import {
  ForbiddenError,
  MissingArgumentError,
  NotFoundError,
} from "../modules/error.module";

const getCategoryAccess = async (userId: string, categoryId: string) => {
  const rows = await db
    .select({
      createdBy: CategoryTable.createdBy,
      accessCanEdit: CategoryAccessTable.canEdit,
    })
    .from(CategoryTable)
    .leftJoin(
      CategoryAccessTable,
      and(
        eq(CategoryAccessTable.categoryId, CategoryTable.id),
        eq(CategoryAccessTable.userId, userId),
      ),
    )
    .where(
      and(
        eq(CategoryTable.id, categoryId),
        or(
          eq(CategoryTable.createdBy, userId),
          isNotNull(CategoryAccessTable.userId),
        ),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  const isOwner = row.createdBy === userId;
  const canEdit = isOwner || (row.accessCanEdit ?? false);
  return { isOwner, canEdit };
};

class TaskController extends Controller {
  @Route("GET", "/:categoryId")
  @Route.Auth()
  async getAll(
    request: FastifyRequest<{ Params: { categoryId: string } }>,
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { categoryId } = request.params;

    const access = await getCategoryAccess(user.id, categoryId);
    if (!access) throw new NotFoundError("Category not found!");

    const tasks = await db.query.TaskTable.findMany({
      where: eq(TaskTable.categoryId, categoryId),
    });

    return { success: true, tasks: tasks || [] };
  }

  @Route("GET", "/:categoryId/:taskId")
  @Route.Auth()
  async getOne(
    request: FastifyRequest<{ Params: { categoryId: string; taskId: string } }>,
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { categoryId, taskId } = request.params;

    const access = await getCategoryAccess(user.id, categoryId);
    if (!access) throw new NotFoundError("Category not found!");

    const task = await db.query.TaskTable.findFirst({
      where: and(
        eq(TaskTable.categoryId, categoryId),
        eq(TaskTable.id, taskId),
      ),
    });

    if (!task) throw new NotFoundError("Task not found!");

    return { success: true, task: task || null };
  }

  @Route("POST", "/")
  @Route.Auth()
  async create(
    request: FastifyRequest<{ Body: Omit<CreateTaskArgs, "createdBy"> }>,
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { type, description, categoryId, options } = request.body;

    if (!categoryId) throw new MissingArgumentError("Category ID is required!");

    const access = await getCategoryAccess(user.id, categoryId);
    if (!access) throw new NotFoundError("Category not found!");
    if (!access.canEdit) throw new ForbiddenError("Nincs szerkesztési jogod ehhez a kategóriához!");

    const task = await db.transaction(async (tx) => {
      const [task] = await tx
        .insert(TaskTable)
        .values({ type, description, categoryId, options, createdBy: user.id })
        .returning();

      if (!task) throw new Error("Task creation failed!");
      return task;
    });

    return { success: true, task };
  }

  @Route("PUT", "/:id")
  @Route.Auth()
  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Omit<UpdateTaskArgs, "createdBy" | "categoryId">;
    }>,
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;
    const { type, description, options } = request.body;

    // Fetch the task to get its categoryId
    const existingTask = await db.query.TaskTable.findFirst({
      where: eq(TaskTable.id, id),
      columns: { categoryId: true, createdBy: true },
    });
    if (!existingTask) throw new NotFoundError("Task not found!");

    const isTaskOwner = existingTask.createdBy === user.id;
    if (!isTaskOwner) {
      const access = await getCategoryAccess(user.id, existingTask.categoryId);
      if (!access?.canEdit) throw new NotFoundError("Task not found!");
    }

    const task = await db.transaction(async (tx) => {
      const [task] = await tx
        .update(TaskTable)
        .set({ type, description, options })
        .where(eq(TaskTable.id, id))
        .returning();

      if (!task) throw new NotFoundError("Task not found!");
      return task;
    });

    return { success: true, task };
  }

  @Route("DELETE", "/:id")
  @Route.Auth()
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;

    const existingTask = await db.query.TaskTable.findFirst({
      where: eq(TaskTable.id, id),
      columns: { categoryId: true, createdBy: true },
    });
    if (!existingTask) throw new NotFoundError("Task not found!");

    const isTaskOwner = existingTask.createdBy === user.id;
    if (!isTaskOwner) {
      const access = await getCategoryAccess(user.id, existingTask.categoryId);
      if (!access?.canEdit) throw new NotFoundError("Task not found!");
    }

    await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(TaskTable)
        .where(eq(TaskTable.id, id))
        .returning();
      if (deleted.length === 0) throw new NotFoundError("Task not found!");
    });

    return { success: true, message: "Task deleted successfully!" };
  }
}

export default TaskController;

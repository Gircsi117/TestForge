import type { FastifyReply, FastifyRequest } from "fastify";
import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";
import db from "../database/db";
import { and, eq, inArray, isNotNull, notInArray, or, sql } from "drizzle-orm";
import {
  CreateTestArgs,
  TestTable,
  UpdateTestArgs,
} from "../database/models/test.model";
import { ForbiddenError, NotFoundError } from "../modules/error.module";
import { Task, TaskTable } from "../database/models/task.model";
import { TestTaskTable } from "../database/models/test-task.model";
import { CategoryTable } from "../database/models/category.model";
import { UserTable } from "../database/models/user.model";
import { TestAccessTable } from "../database/models/test-access.model";
import { CategoryAccessTable } from "../database/models/category-access.model";
import ShareService from "../services/share.service";

class TestController extends Controller {
  @Route("GET", "/")
  @Route.Auth()
  async all(request: FastifyRequest, _reply: FastifyReply) {
    const user = request.currentUser!;
    const rows = await ShareService.testQuery(user.id);
    return {
      success: true,
      tests: rows.map((r) => ShareService.mapTest(r, user.id)),
    };
  }

  @Route("GET", "/:id")
  @Route.Auth()
  async one(
    request: FastifyRequest<{ Params: { id: string } }>,
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;

    const [item] = await ShareService.testQuery(user.id, id);

    if (!item) throw new NotFoundError("Test not found!");

    const base = ShareService.mapTest(item, user.id);

    const testTasks = await db.query.TestTaskTable.findMany({
      where: eq(TestTaskTable.testId, id),
      with: { task: true },
    });

    return {
      success: true,
      test: { ...base, tasks: testTasks.map((tt) => tt.task) },
    };
  }

  @Route("POST", "/")
  @Route.Auth()
  async create(
    request: FastifyRequest<{
      Body: Omit<CreateTestArgs, "createdBy"> & { taskIds?: string[] };
    }>,
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const {
      name,
      questionCount,
      categoryId,
      taskIds = [],
      allowBack = true,
    } = request.body;

    const hasAccess = await ShareService.canAccessCategory(user.id, categoryId);
    if (!hasAccess) throw new NotFoundError("Category not found or no access!");

    if (questionCount && questionCount < 0)
      throw new Error("Question count cannot be negative!");

    const test = await db.transaction(async (tx) => {
      const [test] = await tx
        .insert(TestTable)
        .values({
          name,
          questionCount,
          categoryId,
          allowBack,
          createdBy: user.id,
        })
        .returning();

      if (!test) throw new Error("Test creation failed!");

      if (taskIds.length > 0) {
        const validTasks = await tx.query.TaskTable.findMany({
          where: and(
            eq(TaskTable.categoryId, categoryId),
            inArray(TaskTable.id, taskIds),
          ),
          columns: { id: true },
        });

        if (validTasks.length > 0) {
          await tx
            .insert(TestTaskTable)
            .values(validTasks.map((t) => ({ testId: test.id, taskId: t.id })));
        }
      }

      return test;
    });

    return { success: true, message: "Test created successfully!", test };
  }

  @Route("PUT", "/:id")
  @Route.Auth()
  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateTestArgs & { taskIds?: string[] };
    }>,
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;
    const { taskIds, ...data } = request.body;

    // Check access
    const [access] = await db
      .select({
        createdBy: TestTable.createdBy,
        categoryId: TestTable.categoryId,
        accessCanEdit: TestAccessTable.canEdit,
      })
      .from(TestTable)
      .leftJoin(
        TestAccessTable,
        and(
          eq(TestAccessTable.testId, TestTable.id),
          eq(TestAccessTable.userId, user.id),
        ),
      )
      .where(
        and(
          eq(TestTable.id, id),
          or(
            eq(TestTable.createdBy, user.id),
            isNotNull(TestAccessTable.userId),
          ),
        ),
      )
      .limit(1);

    if (!access) throw new NotFoundError("Test not found!");

    const canEdit =
      access.createdBy === user.id || (access.accessCanEdit ?? false);
    if (!canEdit)
      throw new ForbiddenError("Nincs szerkesztési jogod ehhez a teszthez!");

    if (data.questionCount && data.questionCount < 0)
      throw new Error("Question count cannot be negative!");

    const updatedTest = await db.transaction(async (tx) => {
      const [updatedTest] = await tx
        .update(TestTable)
        .set(data)
        .where(eq(TestTable.id, id))
        .returning();

      if (!updatedTest) throw new Error("Test update failed!");

      if (taskIds) {
        await tx.delete(TestTaskTable).where(eq(TestTaskTable.testId, id));

        if (taskIds.length > 0) {
          const validTasks = await tx
            .select({ id: TaskTable.id })
            .from(TaskTable)
            .where(
              and(
                eq(TaskTable.categoryId, access.categoryId),
                inArray(TaskTable.id, taskIds),
              ),
            );

          if (validTasks.length > 0) {
            await tx
              .insert(TestTaskTable)
              .values(validTasks.map((t) => ({ testId: id, taskId: t.id })));
          }
        }
      }

      return updatedTest;
    });

    return {
      success: true,
      message: "Test updated successfully!",
      test: updatedTest,
    };
  }

  @Route("DELETE", "/:id")
  @Route.Auth()
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;

    // Only owner can delete
    const test = await db.query.TestTable.findFirst({
      where: and(eq(TestTable.createdBy, user.id), eq(TestTable.id, id)),
    });
    if (!test) throw new NotFoundError("Test not found!");

    await db.transaction(async (tx) => {
      await tx.delete(TestTable).where(eq(TestTable.id, id));
    });

    return { success: true, message: "Test deleted successfully!" };
  }

  //*------------------------------------------------------------------------------------------------------------------
  //* Practice
  //*------------------------------------------------------------------------------------------------------------------
  @Route("GET", "/:id/practice")
  @Route.Auth()
  async practice(
    request: FastifyRequest<{ Params: { id: string } }>,
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;

    // Allow any access (own or shared)
    const [test] = await db
      .select({
        id: TestTable.id,
        questionCount: TestTable.questionCount,
        categoryId: TestTable.categoryId,
      })
      .from(TestTable)
      .leftJoin(
        TestAccessTable,
        and(
          eq(TestAccessTable.testId, TestTable.id),
          eq(TestAccessTable.userId, user.id),
        ),
      )
      .where(
        and(
          eq(TestTable.id, id),
          or(
            eq(TestTable.createdBy, user.id),
            isNotNull(TestAccessTable.userId),
          ),
        ),
      )
      .limit(1);

    if (!test) throw new NotFoundError("Test not found!");

    const pinnedRows = await db.query.TestTaskTable.findMany({
      where: eq(TestTaskTable.testId, id),
      with: { task: true },
    });

    const pinnedTasks = pinnedRows.map((row) => row.task);
    const pinnedIds = pinnedTasks.map((t) => t.id);

    const remaining =
      test.questionCount > 0
        ? Math.max(0, test.questionCount - pinnedTasks.length)
        : undefined;

    let randomTasks: Task[] = [];
    if (remaining === undefined || remaining > 0) {
      const whereClause =
        pinnedIds.length > 0
          ? and(
              eq(TaskTable.categoryId, test.categoryId),
              notInArray(TaskTable.id, pinnedIds),
            )
          : eq(TaskTable.categoryId, test.categoryId);

      randomTasks = await db.query.TaskTable.findMany({
        where: whereClause,
        limit: remaining,
        orderBy: sql`RANDOM()`,
      });
    }

    const allTasks = [...pinnedTasks, ...randomTasks].sort(
      () => Math.random() - 0.5,
    );

    return { success: true, tasks: allTasks };
  }
}

export default TestController;

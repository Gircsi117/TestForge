import type { FastifyReply, FastifyRequest } from "fastify";
import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";
import db from "../database/db";
import { and, eq } from "drizzle-orm";
import {
  CreateTestArgs,
  TestTable,
  UpdateTestArgs,
} from "../database/models/test.model";
import { NotFoundError } from "../modules/error.module";

class TestController extends Controller {
  @Route("GET", "/")
  @Route.Auth()
  async all(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;

    const tests = await db.query.TestTable.findMany({
      where: eq(TestTable.createdBy, user.id),
      with: { category: true },
    });

    return { success: true, tests: tests || [] };
  }

  @Route("GET", "/:id")
  @Route.Auth()
  async one(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;

    const test = await db.query.TestTable.findFirst({
      where: and(eq(TestTable.createdBy, user.id), eq(TestTable.id, id)),
      with: { category: true },
    });

    if (!test) {
      throw new NotFoundError("Test not found!");
    }

    return { success: true, test };
  }

  @Route("POST", "/")
  @Route.Auth()
  async create(
    request: FastifyRequest<{
      Body: Omit<CreateTestArgs, "createdBy">;
    }>,
    reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { name, questionCount, categoryId } = request.body;

    const category = await db.query.CategoryTable.findFirst({
      where: and(
        eq(TestTable.createdBy, user.id),
        eq(TestTable.id, categoryId),
      ),
    });

    if (!category) {
      throw new NotFoundError("Category not found or you don't own it!");
    }

    if (questionCount && questionCount < 0) {
      throw new Error("Question count cannot be negative!");
    }

    const test = await db.transaction(async (tx) => {
      const [test] = await tx
        .insert(TestTable)
        .values({
          name,
          questionCount,
          categoryId,
          createdBy: user.id,
        })
        .returning();

      if (!test) throw new Error("Test creation failed!");

      return test;
    });

    return { success: true, message: "Test created successfully!", test };
  }

  @Route("PUT", "/:id")
  @Route.Auth()
  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateTestArgs;
    }>,
    reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;
    const data = request.body;
    const test = await db.query.TestTable.findFirst({
      where: and(eq(TestTable.createdBy, user.id), eq(TestTable.id, id)),
    });

    if (!test) {
      throw new NotFoundError("Test not found or you don't own it!");
    }

    if (data.questionCount && data.questionCount < 0) {
      throw new Error("Question count cannot be negative!");
    }

    const updatedTest = await db.transaction(async (tx) => {
      const [updatedTest] = await tx
        .update(TestTable)
        .set(data)
        .where(eq(TestTable.id, id))
        .returning();

      if (!updatedTest) throw new Error("Test update failed!");

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
    reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;

    const test = await db.query.TestTable.findFirst({
      where: and(eq(TestTable.createdBy, user.id), eq(TestTable.id, id)),
    });

    if (!test) {
      throw new NotFoundError("Test not found!");
    }

    await db.transaction(async (tx) => {
      await tx.delete(TestTable).where(eq(TestTable.id, id));
    });

    return { success: true, message: "Test deleted successfully!" };
  }
}

export default TestController;

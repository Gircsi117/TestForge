import type { FastifyReply, FastifyRequest } from "fastify";
import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";
import {
  CategoryTable,
  CreateCategoryArgs,
  UpdateCategoryArgs,
} from "../database/models/category.model";
import db from "../database/db";
import { and, eq } from "drizzle-orm";
import { NotFoundError } from "../modules/error.module";

type CreateCategoryBody = Pick<CreateCategoryArgs, "name" | "description">;

class CategoryController extends Controller {
  @Route("GET", "/")
  @Route.Auth()
  async get(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;

    const categories = await db.query.CategoryTable.findMany({
      where: eq(CategoryTable.createdBy, user.id),
    });

    return {
      success: true,
      categories: categories || [],
    };
  }

  @Route("GET", "/:id")
  @Route.Auth()
  async getOne(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;

    const category = await db.query.CategoryTable.findFirst({
      where: and(
        eq(CategoryTable.id, id),
        eq(CategoryTable.createdBy, user.id),
      ),
    });

    if (!category) throw new NotFoundError("Category not found!");

    return {
      success: true,
      category: category || null,
    };
  }

  @Route("POST", "/")
  @Route.Auth()
  async create(
    request: FastifyRequest<{ Body: CreateCategoryBody }>,
    reply: FastifyReply,
  ) {
    const { name, description } = request.body;
    const user = request.currentUser!;

    const category = await db.transaction(async (tx) => {
      const [category] = await tx
        .insert(CategoryTable)
        .values({ name, description, createdBy: user.id })
        .returning();

      return category;
    });

    if (!category) throw new Error("Not implemented yet!");

    return {
      success: true,
      category,
      message: "Category created successfully!",
    };
  }

  @Route("PUT", "/:id")
  @Route.Auth()
  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateCategoryArgs;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const { name, description } = request.body;

    const updatedCategory = await db.transaction(async (tx) => {
      const [category] = await tx
        .update(CategoryTable)
        .set({ name, description, updatedAt: new Date() })
        .where(eq(CategoryTable.id, id))
        .returning();

      return category;
    });

    if (!updatedCategory) throw new NotFoundError("Category not found!");

    return {
      success: true,
      category: updatedCategory,
      message: "Category updated successfully!",
    };
  }

  @Route("DELETE", "/:id")
  @Route.Auth()
  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;

    const deletedCount = await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(CategoryTable)
        .where(eq(CategoryTable.id, id))
        .returning();

      return deleted.length;
    });

    if (deletedCount === 0) throw new NotFoundError("Category not found!");

    return {
      success: true,
      message: "Category deleted successfully!",
    };
  }
}

export default CategoryController;

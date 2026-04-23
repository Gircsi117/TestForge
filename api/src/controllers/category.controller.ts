import type { FastifyReply, FastifyRequest } from "fastify";
import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";
import {
  CategoryTable,
  CreateCategoryArgs,
  UpdateCategoryArgs,
} from "../database/models/category.model";
import { UserTable } from "../database/models/user.model";
import { CategoryAccessTable } from "../database/models/category-access.model";
import db from "../database/db";
import { and, eq, isNotNull, or } from "drizzle-orm";
import { ForbiddenError, NotFoundError } from "../modules/error.module";
import ShareService from "../services/share.service";

class CategoryController extends Controller {
  @Route("GET", "/")
  @Route.Auth()
  async get(request: FastifyRequest) {
    const user = request.currentUser!;
    const rows = await ShareService.categoryQuery(user.id);
    return {
      success: true,
      categories: rows.map((r) => ShareService.mapCategory(r, user.id)),
    };
  }

  @Route("GET", "/:id")
  @Route.Auth()
  async getOne(request: FastifyRequest<{ Params: { id: string } }>) {
    const user = request.currentUser!;
    const { id } = request.params;

    const [row] = await ShareService.categoryQuery(user.id, id);
    if (!row) throw new NotFoundError("Category not found!");

    return { success: true, category: ShareService.mapCategory(row, user.id) };
  }

  @Route("POST", "/")
  @Route.Auth()
  async create(
    request: FastifyRequest<{
      Body: Pick<CreateCategoryArgs, "name" | "description">;
    }>,
  ) {
    const { name, description } = request.body;
    const user = request.currentUser!;

    const category = await db.transaction(async (tx) => {
      const [category] = await tx
        .insert(CategoryTable)
        .values({
          name: name,
          description: description || "",
          createdBy: user.id,
        })
        .returning();
      return category;
    });

    if (!category) throw new Error("Not implemented yet!");

    return {
      success: true,
      category: {
        ...category,
        creator: { id: user.id, name: user.name },
        isOwner: true,
        canEdit: true,
      },
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
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;
    const { name, description } = request.body;

    // Verify access (owner or canEdit)
    const [access] = await db
      .select({
        createdBy: CategoryTable.createdBy,
        accessCanEdit: CategoryAccessTable.canEdit,
      })
      .from(CategoryTable)
      .leftJoin(
        CategoryAccessTable,
        and(
          eq(CategoryAccessTable.categoryId, CategoryTable.id),
          eq(CategoryAccessTable.userId, user.id),
        ),
      )
      .where(
        and(
          eq(CategoryTable.id, id),
          or(
            eq(CategoryTable.createdBy, user.id),
            isNotNull(CategoryAccessTable.userId),
          ),
        ),
      )
      .limit(1);

    if (!access) throw new NotFoundError("Category not found!");

    const canEdit =
      access.createdBy === user.id || (access.accessCanEdit ?? false);
    if (!canEdit)
      throw new ForbiddenError(
        "Nincs szerkesztési jogod ehhez a kategóriához!",
      );

    const updatedCategory = await db.transaction(async (tx) => {
      const [category] = await tx
        .update(CategoryTable)
        .set({ name, description })
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
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;

    // Only owner can delete
    const category = await db.query.CategoryTable.findFirst({
      where: and(
        eq(CategoryTable.id, id),
        eq(CategoryTable.createdBy, user.id),
      ),
    });
    if (!category) throw new NotFoundError("Category not found!");

    await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(CategoryTable)
        .where(eq(CategoryTable.id, id))
        .returning();
      if (deleted.length === 0) throw new NotFoundError("Category not found!");
    });

    return { success: true, message: "Category deleted successfully!" };
  }
}

export default CategoryController;

import type { FastifyRequest } from "fastify";
import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";
import db from "../database/db";
import { and, eq } from "drizzle-orm";
import { CategoryTable } from "../database/models/category.model";
import { TestTable } from "../database/models/test.model";
import { CategoryAccessTable } from "../database/models/category-access.model";
import { TestAccessTable } from "../database/models/test-access.model";
import { UserTable } from "../database/models/user.model";
import {
  AlreadyExistsError,
  ForbiddenError,
  NotFoundError,
} from "../modules/error.module";
import Code from "../modules/code.module";

class ShareController extends Controller {
  //*------------------------------------------------------------------------------------------------------------------
  //* Accept
  //*------------------------------------------------------------------------------------------------------------------
  @Route("POST", "/accept")
  @Route.Auth()
  async accept(request: FastifyRequest<{ Body: { code: string } }>) {
    const user = request.currentUser!;
    const { code } = request.body;

    if (!code) throw new NotFoundError("Kód megadása kötelező!");

    // Check categories
    const category = await db.query.CategoryTable.findFirst({
      where: eq(CategoryTable.shareCode, code),
    });

    if (category) {
      if (category.createdBy === user.id)
        throw new ForbiddenError("Saját kódat nem válthatod be!");

      const existing = await db.query.CategoryAccessTable.findFirst({
        where: and(
          eq(CategoryAccessTable.userId, user.id),
          eq(CategoryAccessTable.categoryId, category.id),
        ),
      });

      if (existing)
        throw new AlreadyExistsError(
          "Már van hozzáférésed ehhez a kategóriához!",
        );

      await db.insert(CategoryAccessTable).values({
        userId: user.id,
        categoryId: category.id,
        canEdit: false,
      });

      return {
        success: true,
        message: `Kategória sikeresen hozzáadva: ${category.name}`,
        type: "category",
        id: category.id,
      };
    }

    // Check tests
    const test = await db.query.TestTable.findFirst({
      where: eq(TestTable.shareCode, code),
    });

    if (test) {
      if (test.createdBy === user.id)
        throw new ForbiddenError("Saját kódat nem válthatod be!");

      const existing = await db.query.TestAccessTable.findFirst({
        where: and(
          eq(TestAccessTable.userId, user.id),
          eq(TestAccessTable.testId, test.id),
        ),
      });

      if (existing)
        throw new AlreadyExistsError("Már van hozzáférésed ehhez a teszthez!");

      await db.insert(TestAccessTable).values({
        userId: user.id,
        testId: test.id,
        canEdit: false,
      });

      return {
        success: true,
        message: `Teszt sikeresen hozzáadva: ${test.name}`,
        type: "test",
        id: test.id,
      };
    }

    throw new NotFoundError("Érvénytelen megosztási kód!");
  }

  //*------------------------------------------------------------------------------------------------------------------
  //* Category share management
  //*------------------------------------------------------------------------------------------------------------------
  @Route("GET", "/category/:id")
  @Route.Auth()
  async getCategoryShare(request: FastifyRequest<{ Params: { id: string } }>) {
    const user = request.currentUser!;
    const { id } = request.params;

    const category = await db.query.CategoryTable.findFirst({
      where: and(
        eq(CategoryTable.id, id),
        eq(CategoryTable.createdBy, user.id),
      ),
    });
    if (!category) throw new NotFoundError("Kategória nem található!");

    const users = await db
      .select({
        userId: CategoryAccessTable.userId,
        name: UserTable.name,
        canEdit: CategoryAccessTable.canEdit,
      })
      .from(CategoryAccessTable)
      .innerJoin(UserTable, eq(UserTable.id, CategoryAccessTable.userId))
      .where(eq(CategoryAccessTable.categoryId, id));

    return { success: true, code: category.shareCode, users };
  }

  @Route("POST", "/category/:id/code")
  @Route.Auth()
  async generateCategoryCode(
    request: FastifyRequest<{ Params: { id: string } }>,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;

    const category = await db.query.CategoryTable.findFirst({
      where: and(
        eq(CategoryTable.id, id),
        eq(CategoryTable.createdBy, user.id),
      ),
    });
    if (!category) throw new NotFoundError("Kategória nem található!");

    let code = Code.generateCode();
    let attempts = 0;
    while (attempts < 5) {
      const exists = await db.query.CategoryTable.findFirst({
        where: eq(CategoryTable.shareCode, code),
        columns: { id: true },
      });
      if (!exists) break;
      code = Code.generateCode();
      attempts++;
    }

    const updated = await db.transaction(async (tx) => {
      const [updated] = await db
        .update(CategoryTable)
        .set({ shareCode: code })
        .where(eq(CategoryTable.id, id))
        .returning();

      if (!updated) throw new Error("Category has not been modified ");

      return updated;
    });

    return { success: true, code: updated.shareCode };
  }

  @Route("DELETE", "/category/:id/code")
  @Route.Auth()
  async removeCategoryCode(
    request: FastifyRequest<{ Params: { id: string } }>,
  ) {
    const user = request.currentUser!;
    const { id } = request.params;

    const category = await db.query.CategoryTable.findFirst({
      where: and(
        eq(CategoryTable.id, id),
        eq(CategoryTable.createdBy, user.id),
      ),
    });
    if (!category) throw new NotFoundError("Kategória nem található!");

    await db
      .update(CategoryTable)
      .set({ shareCode: null })
      .where(eq(CategoryTable.id, id));

    return { success: true, message: "Megosztási kód törölve!" };
  }

  @Route("PUT", "/category/:id/user/:userId")
  @Route.Auth()
  async updateCategoryUserAccess(
    request: FastifyRequest<{
      Params: { id: string; userId: string };
      Body: { canEdit: boolean };
    }>,
  ) {
    const user = request.currentUser!;
    const { id, userId } = request.params;
    const { canEdit } = request.body;

    const category = await db.query.CategoryTable.findFirst({
      where: and(
        eq(CategoryTable.id, id),
        eq(CategoryTable.createdBy, user.id),
      ),
    });
    if (!category) throw new NotFoundError("Kategória nem található!");

    const [updated] = await db
      .update(CategoryAccessTable)
      .set({ canEdit })
      .where(
        and(
          eq(CategoryAccessTable.categoryId, id),
          eq(CategoryAccessTable.userId, userId),
        ),
      )
      .returning();

    if (!updated) throw new NotFoundError("Hozzáférés nem található!");

    return { success: true, message: "Hozzáférési jog frissítve!" };
  }

  @Route("DELETE", "/category/:id/user/:userId")
  @Route.Auth()
  async removeCategoryUserAccess(
    request: FastifyRequest<{ Params: { id: string; userId: string } }>,
  ) {
    const user = request.currentUser!;
    const { id, userId } = request.params;

    const category = await db.query.CategoryTable.findFirst({
      where: and(
        eq(CategoryTable.id, id),
        eq(CategoryTable.createdBy, user.id),
      ),
    });
    if (!category) throw new NotFoundError("Kategória nem található!");

    await db
      .delete(CategoryAccessTable)
      .where(
        and(
          eq(CategoryAccessTable.categoryId, id),
          eq(CategoryAccessTable.userId, userId),
        ),
      );

    return { success: true, message: "Hozzáférés eltávolítva!" };
  }

  //*------------------------------------------------------------------------------------------------------------------
  //* Test share management
  //*------------------------------------------------------------------------------------------------------------------
  @Route("GET", "/test/:id")
  @Route.Auth()
  async getTestShare(request: FastifyRequest<{ Params: { id: string } }>) {
    const user = request.currentUser!;
    const { id } = request.params;

    const test = await db.query.TestTable.findFirst({
      where: and(eq(TestTable.id, id), eq(TestTable.createdBy, user.id)),
    });
    if (!test) throw new NotFoundError("Teszt nem található!");

    const users = await db
      .select({
        userId: TestAccessTable.userId,
        name: UserTable.name,
        canEdit: TestAccessTable.canEdit,
      })
      .from(TestAccessTable)
      .innerJoin(UserTable, eq(UserTable.id, TestAccessTable.userId))
      .where(eq(TestAccessTable.testId, id));

    return { success: true, code: test.shareCode, users };
  }

  @Route("POST", "/test/:id/code")
  @Route.Auth()
  async generateTestCode(request: FastifyRequest<{ Params: { id: string } }>) {
    const user = request.currentUser!;
    const { id } = request.params;

    const test = await db.query.TestTable.findFirst({
      where: and(eq(TestTable.id, id), eq(TestTable.createdBy, user.id)),
    });
    if (!test) throw new NotFoundError("Teszt nem található!");

    let code = Code.generateCode();
    let attempts = 0;
    while (attempts < 5) {
      const exists = await db.query.TestTable.findFirst({
        where: eq(TestTable.shareCode, code),
        columns: { id: true },
      });
      if (!exists) break;
      code = Code.generateCode();
      attempts++;
    }

    const updated = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(TestTable)
        .set({ shareCode: code })
        .where(eq(TestTable.id, id))
        .returning();

      if (!updated) throw new Error("Test has not been modified");

      return updated;
    });

    return { success: true, code: updated.shareCode };
  }

  @Route("DELETE", "/test/:id/code")
  @Route.Auth()
  async removeTestCode(request: FastifyRequest<{ Params: { id: string } }>) {
    const user = request.currentUser!;
    const { id } = request.params;

    const test = await db.query.TestTable.findFirst({
      where: and(eq(TestTable.id, id), eq(TestTable.createdBy, user.id)),
    });
    if (!test) throw new NotFoundError("Teszt nem található!");

    await db
      .update(TestTable)
      .set({ shareCode: null })
      .where(eq(TestTable.id, id));

    return { success: true, message: "Megosztási kód törölve!" };
  }

  @Route("PUT", "/test/:id/user/:userId")
  @Route.Auth()
  async updateTestUserAccess(
    request: FastifyRequest<{
      Params: { id: string; userId: string };
      Body: { canEdit: boolean };
    }>,
  ) {
    const user = request.currentUser!;
    const { id, userId } = request.params;
    const { canEdit } = request.body;

    const test = await db.query.TestTable.findFirst({
      where: and(eq(TestTable.id, id), eq(TestTable.createdBy, user.id)),
    });
    if (!test) throw new NotFoundError("Teszt nem található!");

    const [updated] = await db
      .update(TestAccessTable)
      .set({ canEdit })
      .where(
        and(eq(TestAccessTable.testId, id), eq(TestAccessTable.userId, userId)),
      )
      .returning();

    if (!updated) throw new NotFoundError("Hozzáférés nem található!");

    return { success: true, message: "Hozzáférési jog frissítve!" };
  }

  @Route("DELETE", "/test/:id/user/:userId")
  @Route.Auth()
  async removeTestUserAccess(
    request: FastifyRequest<{ Params: { id: string; userId: string } }>,
  ) {
    const user = request.currentUser!;
    const { id, userId } = request.params;

    const test = await db.query.TestTable.findFirst({
      where: and(eq(TestTable.id, id), eq(TestTable.createdBy, user.id)),
    });
    if (!test) throw new NotFoundError("Teszt nem található!");

    await db
      .delete(TestAccessTable)
      .where(
        and(eq(TestAccessTable.testId, id), eq(TestAccessTable.userId, userId)),
      );

    return { success: true, message: "Hozzáférés eltávolítva!" };
  }
}

export default ShareController;

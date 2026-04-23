import { and, eq, isNotNull, or } from "drizzle-orm";
import db from "../database/db";
import { CategoryAccessTable } from "../database/models/category-access.model";
import { CategoryTable } from "../database/models/category.model";
import { UserTable } from "../database/models/user.model";
import { TestTable } from "../database/models/test.model";
import { TestAccessTable } from "../database/models/test-access.model";

class ShareService {
  static async categoryQuery(userId: string, categoryId?: string) {
    const where = categoryId
      ? and(
          eq(CategoryTable.id, categoryId),
          or(
            eq(CategoryTable.createdBy, userId),
            isNotNull(CategoryAccessTable.userId),
          ),
        )
      : or(
          eq(CategoryTable.createdBy, userId),
          isNotNull(CategoryAccessTable.userId),
        );

    return db
      .select({
        id: CategoryTable.id,
        name: CategoryTable.name,
        description: CategoryTable.description,
        shareCode: CategoryTable.shareCode,
        createdBy: CategoryTable.createdBy,
        createdAt: CategoryTable.createdAt,
        updatedAt: CategoryTable.updatedAt,
        creatorId: UserTable.id,
        creatorName: UserTable.name,
        accessCanEdit: CategoryAccessTable.canEdit,
      })
      .from(CategoryTable)
      .innerJoin(UserTable, eq(UserTable.id, CategoryTable.createdBy))
      .leftJoin(
        CategoryAccessTable,
        and(
          eq(CategoryAccessTable.categoryId, CategoryTable.id),
          eq(CategoryAccessTable.userId, userId),
        ),
      )
      .where(where);
  }

  static mapCategory(
    row: Awaited<ReturnType<typeof this.categoryQuery>>[number],
    userId: string,
  ) {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      shareCode: row.createdBy === userId ? row.shareCode : null,
      createdBy: row.createdBy,
      creator: { id: row.creatorId, name: row.creatorName },
      isOwner: row.createdBy === userId,
      canEdit: row.createdBy === userId || (row.accessCanEdit ?? false),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  static async testQuery(userId: string, testId?: string) {
    const where = testId
      ? and(
          eq(TestTable.id, testId),
          or(
            eq(TestTable.createdBy, userId),
            isNotNull(TestAccessTable.userId),
          ),
        )
      : or(eq(TestTable.createdBy, userId), isNotNull(TestAccessTable.userId));

    return db
      .select({
        id: TestTable.id,
        name: TestTable.name,
        questionCount: TestTable.questionCount,
        time: TestTable.time,
        allowBack: TestTable.allowBack,
        shareCode: TestTable.shareCode,
        categoryId: TestTable.categoryId,
        createdBy: TestTable.createdBy,
        createdAt: TestTable.createdAt,
        updatedAt: TestTable.updatedAt,
        creatorId: UserTable.id,
        creatorName: UserTable.name,
        accessCanEdit: TestAccessTable.canEdit,
        categoryName: CategoryTable.name,
      })
      .from(TestTable)
      .innerJoin(UserTable, eq(UserTable.id, TestTable.createdBy))
      .innerJoin(CategoryTable, eq(CategoryTable.id, TestTable.categoryId))
      .leftJoin(
        TestAccessTable,
        and(
          eq(TestAccessTable.testId, TestTable.id),
          eq(TestAccessTable.userId, userId),
        ),
      )
      .where(where);
  }

  static mapTest(
    row: Awaited<ReturnType<typeof this.testQuery>>[number],
    userId: string,
  ) {
    return {
      id: row.id,
      name: row.name,
      questionCount: row.questionCount,
      time: row.time,
      allowBack: row.allowBack,
      shareCode: row.createdBy === userId ? row.shareCode : null,
      categoryId: row.categoryId,
      createdBy: row.createdBy,
      creator: { id: row.creatorId, name: row.creatorName },
      isOwner: row.createdBy === userId,
      canEdit: row.createdBy === userId || (row.accessCanEdit ?? false),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: { id: row.categoryId, name: row.categoryName },
    };
  }

  static async canAccessCategory(userId: string, categoryId: string) {
    const rows = await db
      .select({
        createdBy: CategoryTable.createdBy,
        accessUserId: CategoryAccessTable.userId,
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
    return rows.length > 0;
  }
}

export default ShareService;

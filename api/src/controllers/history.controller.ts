import type { FastifyReply, FastifyRequest } from "fastify";
import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";
import db from "../database/db";
import { desc, eq } from "drizzle-orm";
import {
  CreateHistoryArgs,
  HistoryTable,
} from "../database/models/history.model";

class HistoryController extends Controller {
  @Route("POST", "/")
  @Route.Auth()
  async create(
    request: FastifyRequest<{ Body: Omit<CreateHistoryArgs, "userId"> }>,
    _reply: FastifyReply,
  ) {
    const user = request.currentUser!;
    const { testId, testName, score, maxScore, timeTaken } = request.body;

    const [entry] = await db
      .insert(HistoryTable)
      .values({ userId: user.id, testId, testName, score, maxScore, timeTaken })
      .returning();

    return { success: true, history: entry };
  }

  @Route("GET", "/")
  @Route.Auth()
  async all(request: FastifyRequest, _reply: FastifyReply) {
    const user = request.currentUser!;

    const history = await db.query.HistoryTable.findMany({
      where: eq(HistoryTable.userId, user.id),
      with: { test: true },
      orderBy: desc(HistoryTable.createdAt),
    });

    return { success: true, history };
  }
}

export default HistoryController;

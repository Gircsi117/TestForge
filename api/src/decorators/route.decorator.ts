import { FastifyReply, FastifyRequest } from "fastify";
import {
  getStatusCode,
  NotFoundError,
  UnauthorizedError,
} from "../modules/error.module";
import db from "../database/db";
import { Controller } from "../modules/controller.module";
import Server from "../modules/server.module";
import { UserTable } from "../database/models/user.model";
import { eq } from "drizzle-orm";

export type HttpMehodeType = "GET" | "POST" | "PUT" | "DELETE";

interface RouteDefinition {
  (method: HttpMehodeType, path: string): MethodDecorator;
  Auth(): MethodDecorator;
}

// Intézi a függvény letárolását és a hibakezelést
function RouteFunction(method: HttpMehodeType, path: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    // Az eredeti metódus típusát módosítjuk
    descriptor.value = async function (
      request: FastifyRequest,
      reply: FastifyReply
    ) {
      try {
        return await originalMethod.call(this, request, reply);
      } catch (err) {
        const error = err as Error;

        reply.code(getStatusCode(error) || 500);
        return reply.send({
          statusCode: reply.statusCode || 500,
          message: error.message || "Internal Server Error",
          error: error.name || "Error",
        });
      }
    };

    target.constructor.addRoute({
      method,
      path,
      handler: descriptor.value,
    });

    return descriptor;
  } as MethodDecorator;
}

RouteFunction.Auth = function () {
  return function (
    target: object,
    propertyName: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      request: FastifyRequest,
      reply: FastifyReply
    ) {
      const refreshToken = request.cookies.refresh_token;
      if (!refreshToken) throw new UnauthorizedError("No access token found!");

      const payload = Server.app.jwt.verify(refreshToken) as { id: string };
      if (!payload) throw new UnauthorizedError("Invalid refresh token!");

      const [user] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.id, payload.id))
        .limit(1);

      if (!user) throw new UnauthorizedError("User not found!");

      request.currentUser = { ...user, password: "" };

      return await originalMethod.call(this, request, reply);
    };

    return descriptor;
  } as MethodDecorator;
};

const Route = RouteFunction as RouteDefinition;
export default Route;

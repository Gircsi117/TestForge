import { FastifyReply, FastifyRequest } from "fastify";
import { getStatusCode } from "../modules/error.module";
import db from "../database/db";
import { Controller } from "../modules/controller.module";

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

        reply.code(getStatusCode(error));
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
    return descriptor;
  } as MethodDecorator;
};

const Route = RouteFunction as RouteDefinition;
export default Route;

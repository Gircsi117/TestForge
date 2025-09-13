import { FastifyInstance } from "fastify";

type RegisterOptions = Parameters<FastifyInstance["register"]>[1];

type RouteMethodes = "GET" | "POST" | "PUT" | "DELETE";
type RouteType = {
  method: RouteMethodes;
  path: string;
  handler: Function;
};

export class Controller {
  static _routes: RouteType[] = [];

  public static init(app: FastifyInstance, options: RegisterOptions = {}) {
    const createRoutes = (app: FastifyInstance) => {
      this._routes.forEach((route) => {
        app.route({
          method: route.method,
          url: route.path,
          handler: route.handler.bind(this),
        });
      });
    };

    app.register(createRoutes, options);
  }
}
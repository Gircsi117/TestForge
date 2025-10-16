import { FastifyInstance } from "fastify";

type RegisterOptions = Parameters<FastifyInstance["register"]>[1];

type RouteMethodes = "GET" | "POST" | "PUT" | "DELETE";
type RouteType = {
  method: RouteMethodes;
  path: string;
  handler: Function;
};

const routesMap = new WeakMap<typeof Controller, RouteType[]>();

export class Controller {
  public static init(app: FastifyInstance, options: RegisterOptions = {}) {
    const routes = routesMap.get(this) || [];

    const createRoutes = (app: FastifyInstance) => {
      routes.forEach((route) => {
        app.route({
          method: route.method,
          url: route.path,
          handler: route.handler.bind(this),
        });
      });
    };

    app.register(createRoutes, options);
  }

  protected static addRoute(route: RouteType) {
    if (!routesMap.has(this)) {
      routesMap.set(this, []);
    }
    routesMap.get(this)!.push(route);
  }
}

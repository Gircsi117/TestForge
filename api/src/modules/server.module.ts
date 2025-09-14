import fastify from "fastify";
import env from "@fastify/env";
import AuthController from "../controllers/auth.controller";
import RootController from "../controllers/root.controller";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      DATABASE_URL: string;
      NODE_ENV: "development" | "production";
    };
  }
}

class Server {
  private static initialized: boolean = false;
  public static readonly app = fastify({
    logger: false,
    trustProxy: true,
  });

  public static async init() {
    if (this.initialized) return;

    await this.definePlugins();
    await this.defineRoutes();

    this.initialized = true;
  }

  public static async start() {
    await this.app.listen(
      { port: this.app.config.PORT, host: "0.0.0.0" },
      (error, address) => {
        if (error) {
          console.error(error);
          process.exit(1);
        }

        console.clear();
        console.log(`Server listening at [${address}]`);
        console.log(`Server running in [${this.app.config.NODE_ENV}]`);
      }
    );
  }

  private static async definePlugins() {
    await this.app.register(env, {
      dotenv: true,
      schema: {
        type: "object",
        required: [
          "PORT", // API indító portja
          "DATABASE_URL", // Adatbázis URL-je
          "NODE_ENV", // Szerver indítási állapota
        ],
        properties: {
          PORT: { type: "number", default: 3000 },
          DATABASE_URL: {
            type: "string",
            default: "postgres://user:password@db:5432/test_forge",
          },
          NODE_ENV: { type: "string", default: "development" },
        },
      },
    });
  }

  private static async defineRoutes() {
    RootController.init(this.app, { prefix: "/" });
    AuthController.init(this.app, { prefix: "/auth" });
  }
}

export default Server;

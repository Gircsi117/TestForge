import fastify from "fastify";

// Plugins
import env from "@fastify/env";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import bcrypt from "fastify-bcrypt";
import cookie from "@fastify/cookie";

// Controllers
import AuthController from "../controllers/auth.controller";
import RootController from "../controllers/root.controller";
import CategoryController from "../controllers/category.controller";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      DATABASE_URL: string;
      NODE_ENV: "development" | "production";
      CORS_ORIGIN: string;
      JWT_SECRET: string;
      COOKIE_SECRET: string;
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
          "CORS_ORIGIN", // Engedélyezett CORS eredet
          "JWT_SECRET", // JWT titkos kulcs
          "COOKIE_SECRET", // Sütik titkos kulcs
        ],
        properties: {
          PORT: { type: "number", default: 3000 },
          DATABASE_URL: {
            type: "string",
            default: "postgres://user:password@db:5432/test_forge",
          },
          NODE_ENV: { type: "string", default: "development" },
          CORS_ORIGIN: { type: "string", default: "*" },
          JWT_SECRET: {
            type: "string",
            default: "c7310096-48bf-43b0-a308-b75e3f9f0cbf",
          },
          COOKIE_SECRET: {
            type: "string",
            default: "817efbbb-1bec-4664-9729-756d1e8b9dd2",
          },
        },
      },
    });

    await this.app.register(cors, {
      origin: this.app.config.CORS_ORIGIN,
      credentials: true,
    });

    await this.app.register(jwt, { secret: this.app.config.JWT_SECRET });

    await this.app.register(bcrypt, {
      saltWorkFactor: 12,
    });

    await this.app.register(cookie, {
      secret: this.app.config.COOKIE_SECRET,
    });
  }

  private static async defineRoutes() {
    RootController.init(this.app, { prefix: "/" });
    AuthController.init(this.app, { prefix: "/auth" });
    CategoryController.init(this.app, { prefix: "/categoriy" });
  }
}

export default Server;

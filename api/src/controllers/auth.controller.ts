import type { FastifyReply, FastifyRequest } from "fastify";
import { Controller } from "../modules/controller.module";
import Route from "../decorators/route.decorator";
import { CreateUserArgs, User, UserTable } from "../database/models/user.model";
import db from "../database/db";
import { eq } from "drizzle-orm";
import { MissingArgumentError, NotFoundError } from "../modules/error.module";
import Server from "../modules/server.module";

type LoginBody = Pick<User, "email" | "password">;
type RegisterBody = CreateUserArgs;

export const COOKIE_ACCESS_LIFETIME = 3600 * 1000;
export const COOKIE_REFRESH_LIFETIME = 7 * 24 * 3600 * 1000;

class AuthController extends Controller {
  @Route("POST", "/login")
  async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
  ) {
    const { email, password } = request.body;
    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
      .limit(1);

    if (!user) throw new NotFoundError("User not found!");

    const isValid = await Server.app.bcrypt.compare(password, user.password);
    if (!isValid) throw new NotFoundError("User not found!");

    const accessToken = Server.app.jwt.sign(
      { id: user.id },
      { expiresIn: "1h" }
    );
    const refreshToken = Server.app.jwt.sign(
      { id: user.id },
      { expiresIn: "7d" }
    );

    reply.setCookie("access_token", accessToken, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(Date.now() + COOKIE_ACCESS_LIFETIME),
    });
    reply.setCookie("refresh_token", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(Date.now() + COOKIE_REFRESH_LIFETIME),
    });

    reply.status(200);
    return {
      success: true,
      user: {
        ...user,
        password: undefined,
      },
    };
  }

  @Route("GET", "/register")
  async register(
    request: FastifyRequest<{ Body: RegisterBody }>,
    reply: FastifyReply
  ) {
    const { name, email, phone, password } = request.body;

    if (!name || !email || !password) {
      throw new MissingArgumentError("Missing required fields!");
    }

    const [existingUser] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
      .limit(1);

    if (existingUser) throw new Error("User already exists!");

    const hashedPassword = await Server.app.bcrypt.hash(password);

    const user = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(UserTable)
        .values({
          name,
          email,
          phone,
          password: hashedPassword,
        })
        .returning();

      if (!user) throw new Error("User creation failed!");

      return user;
    });

    reply.status(200);
    return { ...user, password: undefined };
  }

  @Route("GET", "/refresh")
  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const refreshToken = request.cookies.refresh_token;
    if (!refreshToken) throw new NotFoundError("No refresh token found!");

    const payload = Server.app.jwt.verify(refreshToken) as { id: string };
    if (!payload) throw new Error("Invalid refresh token!");

    const accessToken = Server.app.jwt.sign(
      { id: payload.id },
      { expiresIn: "1h" }
    );

    reply.setCookie("access_token", accessToken, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(Date.now() + COOKIE_ACCESS_LIFETIME),
    });

    reply.status(200);
    return { success: true };
  }

  @Route("GET", "/check")
  @Route.Auth()
  async check(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;

    const accessToken = Server.app.jwt.sign(
      { id: user.id },
      { expiresIn: "1h" }
    );

    reply.setCookie("access_token", accessToken, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(Date.now() + COOKIE_ACCESS_LIFETIME),
    });

    reply.status(200);
    return { success: true, user: { ...user, password: undefined } };
  }

  @Route("GET", "/logout")
  async logout(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("access_token");
    reply.clearCookie("refresh_token");
    reply.status(200);
    return { success: true };
  }
}

export default AuthController;

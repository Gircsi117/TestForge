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
type UpdateProfileBody = { name?: string; currentPassword?: string; newPassword?: string };

export const COOKIE_LIFETIME = 30 * 24 * 3600 * 1000;

class AuthController extends Controller {
  @Route("POST", "/login")
  async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply,
  ) {
    const { email, password } = request.body;

    if (!email || !password) {
      throw new MissingArgumentError("Missing required fields!");
    }

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
      { expiresIn: "30d" },
    );

    reply.setCookie("access_token", accessToken, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(Date.now() + COOKIE_LIFETIME),
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

  @Route("POST", "/register")
  async register(
    request: FastifyRequest<{ Body: RegisterBody }>,
    reply: FastifyReply,
  ) {
    const { name, email, password } = request.body;

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
          password: hashedPassword,
        })
        .returning();

      if (!user) throw new Error("User creation failed!");

      return user;
    });

    reply.status(200);
    return { success: true, message: "Registration successful!" };
  }

  @Route("GET", "/check")
  @Route.Auth()
  async check(request: FastifyRequest, reply: FastifyReply) {
    const user = request.currentUser!;

    const accessToken = Server.app.jwt.sign(
      { id: user.id },
      { expiresIn: "30d" },
    );

    reply.setCookie("access_token", accessToken, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(Date.now() + COOKIE_LIFETIME),
    });

    reply.status(200);
    return { success: true, user: { ...user, password: undefined } };
  }

  @Route("PUT", "/profile")
  @Route.Auth()
  async updateProfile(
    request: FastifyRequest<{ Body: UpdateProfileBody }>,
    reply: FastifyReply,
  ) {
    const currentUser = request.currentUser!;
    const { name, currentPassword, newPassword } = request.body;

    const updates: Partial<{ name: string; password: string }> = {};

    if (name !== undefined) {
      if (!name.trim()) throw new MissingArgumentError("A név nem lehet üres!");
      updates.name = name.trim();
    }

    if (newPassword !== undefined) {
      if (!currentPassword) throw new MissingArgumentError("Add meg a jelenlegi jelszót!");

      const [dbUser] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.id, currentUser.id))
        .limit(1);

      const isValid = await Server.app.bcrypt.compare(currentPassword, dbUser.password);
      if (!isValid) throw new NotFoundError("A jelenlegi jelszó helytelen!");

      if (newPassword.length < 6) throw new MissingArgumentError("Az új jelszónak legalább 6 karakter hosszúnak kell lennie!");

      updates.password = await Server.app.bcrypt.hash(newPassword);
    }

    if (Object.keys(updates).length === 0) {
      throw new MissingArgumentError("Nincs módosítandó adat!");
    }

    const [updatedUser] = await db
      .update(UserTable)
      .set(updates)
      .where(eq(UserTable.id, currentUser.id))
      .returning();

    reply.status(200);
    return { success: true, user: { ...updatedUser, password: undefined } };
  }

  @Route("GET", "/logout")
  async logout(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("access_token");
    reply.status(200);
    return { success: true };
  }
}

export default AuthController;

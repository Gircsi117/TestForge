import type { FastifyReply, FastifyRequest } from "fastify";
import { Controller } from "../modules/controller.module";
import Route from "../decorators/route.decorator";
import { CreateUserArgs, User } from "../database/models/user.model";

type LoginBody = Pick<User, "email" | "password">;
type RegisterBody = CreateUserArgs;

class AuthController extends Controller {
  @Route("POST", "/login")
  async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
  ) {}

  @Route("GET", "/register")
  async register(
    request: FastifyRequest<{ Body: RegisterBody }>,
    reply: FastifyReply
  ) {}
}

export default AuthController;

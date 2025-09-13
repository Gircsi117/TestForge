import type { FastifyReply, FastifyRequest } from "fastify";
import { Controller } from "../modules/controller.module";
import Route from "../decorators/route.decorator";

class AuthController extends Controller {
  @Route("POST", "/login")
  async login(
    request: FastifyRequest<{ Body: { email: string; password: string } }>,
    reply: FastifyReply
  ) {}

  @Route("GET", "/register")
  async register() {}
}

export default AuthController;

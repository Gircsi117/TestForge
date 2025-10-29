import type { FastifyReply, FastifyRequest } from "fastify";
import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";

class TaskController extends Controller {
  @Route("GET", "/")
  async get(request: FastifyRequest, reply: FastifyReply) {}

  @Route("POST", "/")
  async create(request: FastifyRequest, reply: FastifyReply) {}

  @Route("PUT", "/")
  async update(request: FastifyRequest, reply: FastifyReply) {}

  @Route("DELETE", "/")
  async delete(request: FastifyRequest, reply: FastifyReply) {}
}

export default TaskController;

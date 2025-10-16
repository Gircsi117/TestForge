import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";

class CategoryController extends Controller {
  @Route("GET", "/")
  async get() {}

  @Route("POST", "/")
  async create() {}

  @Route("PUT", "/")
  async update() {}

  @Route("DELETE", "/")
  async delete() {}
}

export default CategoryController;

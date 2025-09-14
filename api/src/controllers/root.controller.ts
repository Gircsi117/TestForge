import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";

class RootController extends Controller {
  @Route("GET", "/")
  async index() {
    return {
      success: true,
      message: "Hello World",
    };
  }
}

export default RootController;

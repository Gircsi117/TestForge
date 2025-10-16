import Route from "../decorators/route.decorator";
import { Controller } from "../modules/controller.module";
import Server from "../modules/server.module";

class RootController extends Controller {
  @Route("GET", "/")
  async index() {
    return {
      success: true,
      message: "Hello from TestForge API!",
    };
  }

  @Route("GET", "/about")
  async about() {
    return {
      success: true,
      name: "TestForge",
      description: "Tanulást segítő alkalmazás API!",
      creator: {
        name: "Gilián Erik",
        github: "https://github.com/Gircsi117",
      },
    };
  }

  @Route("GET", "/health")
  async getHealth() {
    const uptimeSeconds = process.uptime();

    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    return {
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: uptimeSeconds,
        formatted: `${hours}h ${minutes}m ${seconds}s`,
      },
      environment: Server.app.config.NODE_ENV,
    };
  }

  @Route("GET", "/save-db")
  async saveDB() {
    const uptimeSeconds = process.uptime();

    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    return {
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: uptimeSeconds,
        formatted: `${hours}h ${minutes}m ${seconds}s`,
      },
      environment: Server.app.config.NODE_ENV,
    };
  }
}

export default RootController;

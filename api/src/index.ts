import Server from "./modules/server.module";
import * as dotenv from "dotenv";
import "./modules/log.module";

dotenv.config({ quiet: true });

async function main() {
  await Server.init();
  await Server.start();
}

main();

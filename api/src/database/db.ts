import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import Server from "../modules/server.module";

const db = drizzle(Server.app.config.DATABASE_URL);

export default db;

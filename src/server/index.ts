import Logger, { LogLevel } from "../common/server/logger";
import Database from "./service/database";
import WebApp from "./service/webApp";

Logger.setup((process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO);

const database = new Database();
database.connect();

const app = new WebApp(database);
app.run();

import Logger, { LogLevel } from "../common/server/logger";
import Database from "./service/database";
import WebApp from "./service/webApp";

// process.env.LOG_LEVEL
Logger.setup(LogLevel.DEBUG);

const database = new Database();
database.connect();

const app = new WebApp(database);
app.run();

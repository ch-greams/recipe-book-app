import Logger, { LogLevel } from "@common/server/logger";
import Database from "./service/database";
import WebApp from "./service/webApp";

const IS_PRODUCTION = (process.env.NODE_ENV === "production");
const LOG_LEVEL = process.env.LOG_LEVEL as LogLevel;

Logger.setup((LOG_LEVEL) || LogLevel.INFO);

Logger.log(LogLevel.INFO, "server", `LOG_LEVEL = ${LOG_LEVEL}`);
Logger.log(LogLevel.INFO, "server", `IS_PRODUCTION = ${IS_PRODUCTION}`);

const database = new Database();
database.connect();

const app = new WebApp(database, IS_PRODUCTION);
app.run();

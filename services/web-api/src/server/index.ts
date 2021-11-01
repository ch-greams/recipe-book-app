import Logger, { LogLevel } from "@common/logger";
import Database from "@server/service/database";
import WebApp from "@server/service/webApp";

import "@common/extensions";

const IS_PRODUCTION = (process.env.NODE_ENV === "production");
const LOG_LEVEL = process.env.LOG_LEVEL as LogLevel;

Logger.setup((LOG_LEVEL) || LogLevel.INFO);

Logger.log(LogLevel.INFO, "server", `LOG_LEVEL = ${LOG_LEVEL}`);
Logger.log(LogLevel.INFO, "server", `IS_PRODUCTION = ${IS_PRODUCTION}`);

const database = new Database();

const app = new WebApp(database);
app.run();

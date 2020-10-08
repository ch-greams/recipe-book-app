import Logger, { LogLevel } from "../common/server/logger";
import WebApp from "./service/webApp";

// process.env.LOG_LEVEL
Logger.setup(LogLevel.DEBUG);

const app = new WebApp();
app.run();

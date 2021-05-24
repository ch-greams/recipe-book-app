import winston from "winston";


export enum LogLevel {
    ERROR = "ERROR",
    WARNING = "WARNING",
    INFO = "INFO",
    VERBOSE = "VERBOSE",
    DEBUG = "DEBUG",
    SILLY = "SILLY",
}

class Logger {

    public static setup(logLevel: LogLevel): winston.Logger {

        const _logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(({ level, timestamp, message }) => `${timestamp} ${level}: ${message}`),
            ),
            level: logLevel,
            levels: { ERROR: 0, WARNING: 1, INFO: 2, VERBOSE: 3, DEBUG: 4, SILLY: 5 },
            transports: [ new winston.transports.Console() ],
        });

        winston.addColors({ ERROR: "red", WARNING: "yellow", INFO: "cyan", VERBOSE: "magenta", DEBUG: "blue", SILLY: "grey" });

        return _logger;
    }

    public static log(level: LogLevel, source: string, data: string | number | boolean | unknown | Error, variable?: string): void {

        const isError = data instanceof Error;
        const text = (typeof data === "object" && !isError ? JSON.stringify(data) : data);

        if (variable) {
            logger.log(level, `[${source}]: ${variable} = ${text}`);
        }
        else {
            logger.log(level, `[${source}]: ${text}`);
        }
    }
}

const logger = Logger.setup(LogLevel.DEBUG);

export default Logger;

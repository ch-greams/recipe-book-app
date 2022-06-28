/* eslint-disable no-console */


enum LogLevel {
    Error = "ERROR",
    Info = "INFO",
    Debug = "DEBUG",
}

export default class Logger {

    public static error(text: string): void {
        Logger.log(LogLevel.Error, text);
        console.trace();
    }

    public static info(text: string): void {
        Logger.log(LogLevel.Info, text);
    }

    public static debug(text: string): void {
        Logger.log(LogLevel.Debug, text);
    }


    private static log(level: LogLevel, text: string): void {
        console.log(`[${level}]: ${text}`);
    }
}

/* eslint-disable no-console */

import type { Chalk } from "chalk";
import chalk from "chalk";


enum LogLevel {
    Error = "ERROR",
    Warning = "WARN",
    Info = "INFO",
    Debug = "DEBUG",
}

export default class Logger {

    public static log(text: string): void {
        console.log(text);
    }

    public static error(text: string): void {
        Logger._log(LogLevel.Error, text, chalk["bgRed"]);
        console.trace();
    }

    public static warn(text: string): void {
        Logger._log(LogLevel.Warning, text, chalk["bgYellow"]);
    }

    public static info(text: string): void {
        Logger._log(LogLevel.Info, text, chalk["bgBlue"]);
    }

    public static debug(text: string): void {
        Logger._log(LogLevel.Debug, text, chalk["bgMagenta"]);
    }


    private static _log(level: LogLevel, text: string, color: Chalk): void {
        console.log(`${color(level)}: ${text}`);
    }
}

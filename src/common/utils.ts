import fs from "fs";
import { Dictionary } from "./typings";



export default class Utils {

    public static readonly ENERGY_DAILY_VALUE_CALORIES: number = 2000;

    private static readonly DEFAULT_READ_FILE_OPTIONS = "utf8";

    // NOTE: CALCULATIONS

    public static roundToDecimal(value: number, accuracy: number): number {

        const MULTIPLIER_PER_SINGLE_DIGIT = 10;

        const accuracyMultiplier: number = Math.pow(MULTIPLIER_PER_SINGLE_DIGIT, accuracy);

        const getRoundedValue: string = ( Math.round(value * accuracyMultiplier) / accuracyMultiplier ).toFixed(accuracy);

        return Number(getRoundedValue);
    }

    // NOTE: APP-SPECIFIC CALCULATIONS

    public static getDailyValuePercent(currentValue?: number, dailyValue?: number): number | null {

        const PERCENT_MULTIPLIER = 100;
        const ACCURACY = 1;

        const isDailyValueExist = typeof dailyValue === "number";
        const isCurrentValueExist = typeof currentValue === "number";

        return (
            ( isDailyValueExist && isCurrentValueExist )
                ? Utils.roundToDecimal(( currentValue / dailyValue ) * PERCENT_MULTIPLIER, ACCURACY)
                : null
        );
    }

    // NOTE: GENERAL

    public static fileExists(path: string): boolean {
        return fs.existsSync(path);
    }

    public static async readJsonFileAsync<T>(path: string): Promise<T> {
        const rawJsonString = await fs.promises.readFile(path, Utils.DEFAULT_READ_FILE_OPTIONS) as string;
        return JSON.parse(rawJsonString);
    }

    public static getObjectKeys<T>(obj: T | Dictionary<keyof T, unknown>): Array<keyof T> {
        return Object.keys(obj) as Array<keyof T>;
    }
}

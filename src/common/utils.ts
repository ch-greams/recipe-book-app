import { Dictionary } from "./typings";



export default class Utils {

    public static readonly ENERGY_DAILY_VALUE_CALORIES: number = 2000;
    public static readonly MAX_DAILY_VALUE: number = 999;


    // NOTE: CALCULATIONS

    public static roundToDecimal(value: number, accuracy: number): number {

        const MULTIPLIER_PER_SINGLE_DIGIT = 10;

        const accuracyMultiplier: number = Math.pow(MULTIPLIER_PER_SINGLE_DIGIT, accuracy);

        const getRoundedValue: string = ( Math.round(value * accuracyMultiplier) / accuracyMultiplier ).toFixed(accuracy);

        return Number(getRoundedValue);
    }

    public static decimalNormalizer(value: string, previousValue: string): string {

        if (value) {
            const isDouble = /^\d*\.?\d+$/.test(value);
            const isPartialDecimal = /^\d*\.?$/.test(value);

            return ( (isDouble || isPartialDecimal) ? value : (previousValue || "0") );
        }

        return "0";
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

    public static getObjectKeys<T>(obj: T | Dictionary<keyof T, unknown>): Array<keyof T> {
        return Object.keys(obj) as Array<keyof T>;
    }

    // NOTE: OTHER

    public static keepCaretInPlace(window: Window & typeof globalThis, event: React.ChangeEvent<HTMLInputElement>): void {
        const caret = event.target.selectionStart;
        const element = event.target;
        window.requestAnimationFrame(() => {
            element.selectionStart = caret;
            element.selectionEnd = caret;
        });
    }
}

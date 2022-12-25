import { isSome } from "./types";


export enum DecimalPlaces {
    Zero = 0,
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
}

export function roundToDecimal(value: number, accuracy: DecimalPlaces): number {

    const MULTIPLIER_PER_SINGLE_DIGIT = 10;

    const accuracyMultiplier: number = Math.pow(MULTIPLIER_PER_SINGLE_DIGIT, accuracy);
    const getRoundedValue: string = ( Math.round(value * accuracyMultiplier) / accuracyMultiplier ).toFixed(accuracy);

    // NOTE: Double conversion String -> Number -> String, allows you to easily drop trailing zeros
    // IMPROVE: Consider different solution later?
    return Number( getRoundedValue );
}

/**
 * @returns converted `string` or `None` if `value` was `None` in the first place
 */
export function numberToString(value: Option<number>): Option<string> {
    return isSome(value) ? String(value) : null;
}

import { isSome, unwrap, unwrapOr } from "@common/types";
import type { Nutrient } from "@views/shared/rba-nutrition-fact-line";

import type { NutrientDescription } from "./nutrients";
import { NutrientName } from "./nutrients";
import type { Comparer } from "./typings";
import type { CustomUnit, CustomUnitInput } from "./units";


export enum UserMenuItem {
    Journal = "Journal",
    Recipes = "Recipes",
    Foods = "Foods",
}

export enum ProductType {
    Food = "food",
    Recipe = "recipe",
}

export enum DecimalPlaces {
    Zero = 0,
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
}

export enum ComparerResult {
    Negative = -1,
    Zero = 0,
    Positive = 1,
}


export default class Utils {

    public static readonly MAX_DAILY_VALUE: number = 999;

    private static readonly CENTUM: number = 100;

    // NOTE: CALCULATIONS

    public static roundToDecimal(value: number, accuracy: DecimalPlaces): number {

        const MULTIPLIER_PER_SINGLE_DIGIT = 10;

        const accuracyMultiplier: number = Math.pow(MULTIPLIER_PER_SINGLE_DIGIT, accuracy);

        const getRoundedValue: string = ( Math.round(value * accuracyMultiplier) / accuracyMultiplier ).toFixed(accuracy);

        // NOTE: Double conversion String -> Number -> String, allows you to easily drop trailing zeros
        // IMPROVE: Consider different solution later?
        return Number( getRoundedValue );
    }

    public static decimalNormalizer(value: string, previousValue: string): string {

        const DEFAULT_VALUE = "";

        if (value) {
            const isDouble = /^\d*\.?\d+$/.test(value);
            const isPartialDecimal = /^\d*\.?$/.test(value);

            return ( (isDouble || isPartialDecimal) ? value : (previousValue || DEFAULT_VALUE) );
        }

        return DEFAULT_VALUE;
    }

    public static isEmptyString(value: string): boolean {
        return value.trim().length === 0;
    }

    // NOTE: APP-SPECIFIC CALCULATIONS

    public static getDailyValuePercent(currentValue: Option<number>, dailyValue: Option<number>): Option<number> {
        return (
            ( isSome(currentValue) && isSome(dailyValue) )
                ? Utils.roundToDecimal(( currentValue / dailyValue ) * Utils.CENTUM, DecimalPlaces.One)
                : null
        );
    }

    public static getNutrients(
        nutrientTypes: NutrientName[],
        nutrients: Dictionary<NutrientName, number>,
        nutrientInputs: Dictionary<NutrientName, string>,
        nutrientDescriptions: Record<NutrientName, NutrientDescription>,
    ): Nutrient[] {
        return nutrientTypes.reduce<Nutrient[]>(
            (previousNutrients: Nutrient[], currentNutrientType: NutrientName): Nutrient[] => {

                const amount: Option<number> = nutrients[currentNutrientType];
                const inputValue: Option<string> = nutrientInputs[currentNutrientType];
                const nutrientDescription = unwrap(
                    nutrientDescriptions[currentNutrientType],
                    `nutrientDescriptions[${currentNutrientType}]`,
                );

                return [
                    ...previousNutrients,
                    {
                        type: currentNutrientType,
                        amount: amount,
                        inputValue: inputValue || "",
                        unit: nutrientDescription.unit,
                        dailyValue: Utils.getDailyValuePercent(amount, nutrientDescription.dailyValue),
                        isFraction: nutrientDescription.isFraction,
                    },
                ];
            },
            [],
        );
    }

    public static getPercentMultiplier(value: number): number {
        return (value / Utils.CENTUM);
    }

    public static dictionarySum(productNutrients: Dictionary<NutrientName, number>[]): Dictionary<NutrientName, number> {

        return Object.values(NutrientName).reduce((acc: Dictionary<NutrientName, number>, nutrientType) => {

            const nutrientValue = productNutrients.reduce(
                (sum: Option<number>, ingredient) => {
                    const value = ingredient[nutrientType];
                    return ( isSome(value) ? unwrapOr(sum, 0) + value : sum );
                },
                null,
            );

            return {
                ...acc,
                [nutrientType]: (
                    isSome(nutrientValue)
                        ? Utils.roundToDecimal(nutrientValue, DecimalPlaces.Two)
                        : null
                ),
            };
        }, {});
    }

    public static convertNutrients(
        amount: number,
        isFrom: boolean,
        nutrients: Dictionary<NutrientName, number>,
    ): Dictionary<NutrientName, number> {

        const multiplier = isFrom ? ( amount / Utils.CENTUM ) : ( Utils.CENTUM / amount );

        const updatedNutrients: Dictionary<NutrientName, number> = Utils.getObjectKeys(nutrients)
            .reduce((acc, cur) => {
                const nutrient = nutrients[cur];
                return {
                    ...acc,
                    [cur]: (
                        isSome(nutrient)
                            ? Utils.roundToDecimal(nutrient * multiplier, DecimalPlaces.Two)
                            : null
                    ),
                };
            }, {});

        return updatedNutrients;
    }

    // NOTE: OTHER GENERIC THINGS

    public static getObjectKeys<T extends object>(
        obj: T | Dictionary<keyof T, unknown>,
        ensureNumber: boolean = false,
    ): (keyof T)[] {
        return ( ensureNumber ? Object.keys(obj).map(Number) : Object.keys(obj) ) as (keyof T)[];
    }

    public static getObjectValues<T>(obj: Dictionary<ID, T>): T[] {
        return Object.values(obj) as T[];
    }

    /**
     * Calls a defined callback function on each `key-value` pair of a `Record`, and returns a `Record` that contains the results.
     * This "wrapper" function allows you to safely keep using same record type without forced assignment or errors.
     *
     * @param record - Provided initial `Record` value.
     * @param callback - A function that accepts up two arguments. The map method calls the callback function one time for each `key-value` pair of a `Record`.
     */
    public static mapRecord<K extends string | number, V, RV>(record: Record<K, V>, callback: (key: K, value: V) => RV): Record<K, RV> {
        return Utils.getObjectKeys(record).reduce((acc, cur) => ({ ...acc, [cur]: callback(cur, record[cur]) }), {}) as Record<K, RV>;
    }

    /**
     * Calls a defined callback function on each `key-value` pair of a `Record`, and returns a `Record` that contains the results.
     * This "wrapper" function allows you to safely keep using same record type without forced assignment or errors.
     *
     * @param record - Provided initial `Record` value.
     * @param callback - A function that accepts up two arguments. The map method calls the callback function one time for each `key-value` pair of a `Record`.
     */
    public static mapDictionary<K extends string | number, V, RV>(record: Dictionary<K, V>, callback: (key: K, value: V) => RV): Dictionary<K, RV> {
        return Utils.getObjectKeys(record)
            .reduce((acc, cur) => {
                const item: Option<V> = record[cur];
                return { ...acc, [cur]: isSome(item) ? callback(cur, item) : item };
            }, {});
    }

    /**
     * Generates a temporary id, which is a negative locally unique number to distinguish from real ids
     * Used for ingredients in a new recipe, and direction_parts that are not in the db yet
     */
    public static getTemporaryId(): number {
        return -Date.now();
    }

    public static getNumberOfLines(str: string): number {
        const SINGLE_LINE = 1;
        return (str.match(/\n/g) || "").length + SINGLE_LINE;
    }

    public static sortBy<T>(field: keyof T): Comparer<T> {
        return (a: T, b: T) => a[field] > b[field] ? ComparerResult.Positive : ComparerResult.Negative;
    }

    public static arrayIsNotEmpty(array: unknown[]): boolean {
        return (Array.isArray(array) && array.length > 0);
    }

    public static objectIsNotEmpty<T>(obj: T | Dictionary<string | number | symbol, T>): boolean {
        return (!!obj && (typeof obj === "object") && Object.keys(obj).length > 0);
    }

    public static getProductPath(route: ProductType, id: number): string {
        return `/${route}/${id}`;
    }

    public static getNewProductPath(route: ProductType): string {
        return `/${route}/new`;
    }

    public static getUrlParams(obj: object): string {
        return Utils.getObjectKeys(obj).map((key) => `${key}=${obj[key]}`).join("&");
    }

    public static keepCaretInPlace(window: Window & typeof globalThis, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const caret = event.target.selectionStart;
        const element = event.target;
        window.requestAnimationFrame(() => {
            element.selectionStart = caret;
            element.selectionEnd = caret;
        });
    }

    // NOTE: From reducers

    /**
     * @returns converted `string` or `None` if `value` was `None` in the first place
     */
    public static numberToString(value: Option<number>): Option<string> {
        return isSome(value) ? String(value) : null;
    }

    /**
     * @returns converted `number` or `None` if `value` was an empty `string` or `None` in the first place
     */
    public static stringToNumber(value: Option<string>): Option<number> {
        return ( ( isSome(value) && !Utils.isEmptyString(value) ) ? Number(value) : null );
    }

    public static convertNutrientValuesIntoInputs(values: Dictionary<NutrientName, number>): Dictionary<NutrientName, string> {
        return Utils.getObjectKeys(values).reduce<Dictionary<NutrientName, string>>(
            (acc, nfType) => {
                const nfValue = values[nfType];
                const nfInput = (
                    isSome(nfValue)
                        ? Utils.numberToString(Utils.roundToDecimal(nfValue, DecimalPlaces.Two))
                        : null
                );
                return { ...acc, [nfType]: nfInput };
            }, {},
        );
    }

    public static convertNutrientInputsIntoValues(values: Dictionary<NutrientName, string>): Dictionary<NutrientName, number> {
        return Utils.getObjectKeys(values).reduce<Dictionary<NutrientName, number>>(
            (acc, nfType) => ({ ...acc, [nfType]: Utils.stringToNumber(values[nfType]) }), {},
        );
    }

    public static convertCustomUnitsIntoInputs(customUnits: CustomUnit[]): CustomUnitInput[] {
        return customUnits.map((customUnit) => ({ ...customUnit, amountInput: String(customUnit.amount) }));
    }
}

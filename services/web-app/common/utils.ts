import { isSome, unwrapOr } from "@common/types";
import type { Nutrient } from "@views/shared/rba-nutrient-line";

import type { NutrientDescription } from "./nutrients";
import { NutrientName } from "./nutrients";
import { getKeys } from "./object";
import type { CustomUnit, CustomUnitInput } from "./units";


export enum UserMenuItem {
    Settings = "Settings",
    Recipes = "Recipes",
    Foods = "Foods",
}

export enum DecimalPlaces {
    Zero = 0,
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
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
        allFractions: boolean = false,
    ): Nutrient[] {
        return nutrientTypes.reduce<Nutrient[]>(
            (previousNutrients: Nutrient[], currentNutrientType: NutrientName): Nutrient[] => {

                const amount: Option<number> = nutrients[currentNutrientType];
                const inputValue: Option<string> = nutrientInputs[currentNutrientType];
                const nutrientDescription: NutrientDescription = nutrientDescriptions[currentNutrientType];

                return [
                    ...previousNutrients,
                    {
                        type: currentNutrientType,
                        amount: amount,
                        inputValue: inputValue || "",
                        unit: nutrientDescription.unit,
                        dailyValue: Utils.getDailyValuePercent(amount, nutrientDescription.dailyValue),
                        isFraction: allFractions || nutrientDescription.isFraction,
                    },
                ];
            },
            [],
        );
    }

    public static getPercentMultiplier(value: number): number {
        return (value / Utils.CENTUM);
    }

    public static nutrientSum(productNutrients: Dictionary<NutrientName, number>[]): Dictionary<NutrientName, number> {

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

        const updatedNutrients: Dictionary<NutrientName, number> = getKeys(nutrients)
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
        return getKeys(values).reduce<Dictionary<NutrientName, string>>(
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
        return getKeys(values).reduce<Dictionary<NutrientName, number>>(
            (acc, nfType) => ({ ...acc, [nfType]: Utils.stringToNumber(values[nfType]) }), {},
        );
    }

    public static convertCustomUnitsIntoInputs(customUnits: CustomUnit[]): CustomUnitInput[] {
        return customUnits.map((customUnit) => ({ ...customUnit, amountInput: String(customUnit.amount) }));
    }
}

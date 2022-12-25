import { isSome, unwrapOr } from "@common/types";
import type { Nutrient } from "@views/shared/rba-nutrient-line";

import { DecimalPlaces, roundToDecimal } from "./numeric";
import type { NutrientDescription } from "./nutrients";
import { NutrientName } from "./nutrients";
import { getKeys } from "./object";


const CENTUM: number = 100;


function getDailyValuePercent(currentValue: Option<number>, dailyValue: Option<number>): Option<number> {
    return (
        ( isSome(currentValue) && isSome(dailyValue) )
            ? roundToDecimal(( currentValue / dailyValue ) * CENTUM, DecimalPlaces.One)
            : null
    );
}


export function keepCaretInPlace(window: Window & typeof globalThis, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const caret = event.target.selectionStart;
    const element = event.target;
    window.requestAnimationFrame(() => {
        element.selectionStart = caret;
        element.selectionEnd = caret;
    });
}

/**
 * Generates a temporary id, which is a negative locally unique number to distinguish from real ids
 * Used for ingredients in a new recipe, and direction_parts that are not in the db yet
 */
export function getTemporaryId(): number {
    return -Date.now();
}

export function getPercentMultiplier(value: number): number {
    return (value / CENTUM);
}


export function nutrientSum(productNutrients: Dictionary<NutrientName, number>[]): Dictionary<NutrientName, number> {

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
                    ? roundToDecimal(nutrientValue, DecimalPlaces.Two)
                    : null
            ),
        };
    }, {});
}

export function getNutrients(
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
                    dailyValue: getDailyValuePercent(amount, nutrientDescription.dailyValue),
                    isFraction: allFractions || nutrientDescription.isFraction,
                },
            ];
        },
        [],
    );
}

export function convertNutrients(
    amount: number, isFrom: boolean, nutrients: Dictionary<NutrientName, number>,
): Dictionary<NutrientName, number> {

    const multiplier = isFrom ? ( amount / CENTUM ) : ( CENTUM / amount );

    const updatedNutrients: Dictionary<NutrientName, number> = getKeys(nutrients)
        .reduce((acc, cur) => {
            const nutrient = nutrients[cur];
            return {
                ...acc,
                [cur]: (
                    isSome(nutrient)
                        ? roundToDecimal(nutrient * multiplier, DecimalPlaces.Two)
                        : null
                ),
            };
        }, {});

    return updatedNutrients;
}


export function convertNutrientValuesIntoInputs(values: Dictionary<NutrientName, number>): Dictionary<NutrientName, string> {
    return getKeys(values).reduce<Dictionary<NutrientName, string>>(
        (acc, nfType) => {
            const nfValue = values[nfType];
            const nfInput = isSome(nfValue) ? String(roundToDecimal(nfValue, DecimalPlaces.Two)) : null;
            return { ...acc, [nfType]: nfInput };
        }, {},
    );
}

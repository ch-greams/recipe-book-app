import { DecimalPlaces, roundToDecimal } from "@common/numeric";
import type { NutrientName } from "@common/nutrients";
import { getKeys } from "@common/object";
import { isSome } from "@common/types";
import type { CustomUnit, CustomUnitInput } from "@common/units";



export function convertNutrientInputsIntoValues(values: Dictionary<NutrientName, string>): Dictionary<NutrientName, number> {
    return getKeys(values).reduce<Dictionary<NutrientName, number>>(
        (acc, nfType) => ({ ...acc, [nfType]: values[nfType]?.toNumber() || null }), {},
    );
}

export function convertCustomUnitsIntoInputs(customUnits: CustomUnit[]): CustomUnitInput[] {
    return customUnits.map((customUnit) => ({ ...customUnit, amountInput: String(customUnit.amount) }));
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

/**
 * Database stores nutrients per 100g, so to calculate amount of nutrients per serving size this function will calculate a multiplier
 *
 * @param amount amount of food
 * @param from from or to database value
 * @returns multiplier
 */
export function getNutrientMultiplierFromAmount(amount: number, from: boolean = true): number {
    const DEFAULT_MULTIPLIER: number = 100;
    return from ? ( amount / DEFAULT_MULTIPLIER ) : ( DEFAULT_MULTIPLIER / amount );
}

export function convertNutrients(
    amount: number, isFrom: boolean, nutrients: Dictionary<NutrientName, number>,
): Dictionary<NutrientName, number> {
    const multiplier = getNutrientMultiplierFromAmount(amount, isFrom);

    const updatedNutrients: Dictionary<NutrientName, number> = getKeys(nutrients)
        .reduce((acc, cur) => {
            const nutrient = nutrients[cur];
            return {
                ...acc,
                [cur]: ( isSome(nutrient) ? roundToDecimal(nutrient * multiplier, DecimalPlaces.Two) : null ),
            };
        }, {});

    return updatedNutrients;
}

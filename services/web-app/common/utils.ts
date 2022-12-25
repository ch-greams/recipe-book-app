import { isSome } from "@common/types";
import type { Nutrient } from "@views/shared/rba-nutrient-line";

import { DecimalPlaces, roundToDecimal } from "./numeric";
import type { NutrientDescription } from "./nutrients";
import type { NutrientName } from "./nutrients";



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


function getDailyValuePercent(currentValue: Option<number>, dailyValue: Option<number>): Option<number> {
    const CENTUM: number = 100;
    return (
        ( isSome(currentValue) && isSome(dailyValue) )
            ? roundToDecimal(( currentValue / dailyValue ) * CENTUM, DecimalPlaces.One)
            : null
    );
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

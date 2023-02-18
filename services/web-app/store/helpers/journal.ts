import { DecimalPlaces, roundToDecimal } from "@common/numeric";
import type { NutrientName } from "@common/nutrients";
import { mapDictionary } from "@common/object";

import type { JournalStoreEntry } from "../types/journal";

import { getNutrientMultiplierFromAmount } from "./food";
import { nutrientSum } from "./recipe";



/**
 * Calculate nutrient values for a day based on current journal entries
 */
export function getNutrientsFromJournalEntries(journalEntries: JournalStoreEntry[]): Dictionary<NutrientName, number> {

    const foodNutrients: Dictionary<NutrientName, number>[] = journalEntries
        .map((journalEntry) => {
            const { foodNutrients: nutrients, foodAmount: amount } = journalEntry;
            const multiplier = getNutrientMultiplierFromAmount(amount);
            return mapDictionary(nutrients, (_key, value) => roundToDecimal(value * multiplier, DecimalPlaces.Two));
        });

    return nutrientSum(foodNutrients);
}

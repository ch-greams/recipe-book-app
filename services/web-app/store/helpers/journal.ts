import type { NutrientName } from "@common/nutrients";
import Utils, { DecimalPlaces } from "@common/utils";

import type { JournalEntry } from "../types/journal";



/**
 * Calculate nutrient values for a day based on current journal entries
 */
export function getNutrientsFromJournalEntries(journalEntries: JournalEntry[]): Dictionary<NutrientName, number> {

    const foodNutrients: Dictionary<NutrientName, number>[] = journalEntries
        .map((journalEntry) => {
            const { foodNutrients: nutrients, foodAmount: amount } = journalEntry;
            const multiplier = Utils.getPercentMultiplier(amount);
            return Utils.mapDictionary(nutrients, (_key, value) => Utils.roundToDecimal(value * multiplier, DecimalPlaces.Two));
        });

    return Utils.dictionarySum(foodNutrients);
}

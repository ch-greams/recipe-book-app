import type { NutrientName } from "@common/nutrients";
import { mapDictionary } from "@common/object";
import Utils, { DecimalPlaces } from "@common/utils";

import type { JournalStoreEntry } from "../types/journal";



/**
 * Calculate nutrient values for a day based on current journal entries
 */
export function getNutrientsFromJournalEntries(journalEntries: JournalStoreEntry[]): Dictionary<NutrientName, number> {

    const foodNutrients: Dictionary<NutrientName, number>[] = journalEntries
        .map((journalEntry) => {
            const { foodNutrients: nutrients, foodAmount: amount } = journalEntry;
            const multiplier = Utils.getPercentMultiplier(amount);
            return mapDictionary(nutrients, (_key, value) => Utils.roundToDecimal(value * multiplier, DecimalPlaces.Two));
        });

    return Utils.nutrientSum(foodNutrients);
}

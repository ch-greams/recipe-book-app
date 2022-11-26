import type { NutrientName } from "@common/nutrients";
import type { CustomUnit } from "@common/units";



export interface JournalStoreEntry {
    id: number;

    entryDate: string;
    entryTime: string;

    groupIndex: Option<number>;

    foodId: number;
    foodName: string;

    foodAmount: number;
    foodAmountInput: string;

    foodUnit: string;

    foodDensity: number;

    foodNutrients: Dictionary<NutrientName, number>;
    foodCustomUnits: CustomUnit[];
}

export interface JournalStoreGroup {
    uiIndex: number;
    name: string;
}

export interface JournalStore {
    currentDate: string;

    entries: JournalStoreEntry[];
    groups: JournalStoreGroup[];

    nutrients: Dictionary<NutrientName, number>;

    isSaved: boolean;
    isLoaded: boolean;
    errorMessage?: Option<string>;
}

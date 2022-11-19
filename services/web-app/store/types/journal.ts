import type { NutrientName } from "@common/nutrients";
import type { CustomUnit } from "@common/units";



export interface JournalEntry {
    id: number;

    entryDate: string;
    entryTime: string;

    groupOrderNumber: Option<number>;

    foodName: string;

    foodAmount: number;
    foodAmountInput: string;

    foodUnit: string;

    foodDensity: number;

    foodNutrients: Dictionary<NutrientName, number>;
    foodCustomUnits: CustomUnit[];
}

export interface JournalGroup {
    orderNumber: number;
    name: string;
}

export interface JournalStore {
    currentDate: string;

    entries: JournalEntry[];
    groups: JournalGroup[];

    nutrients: Dictionary<NutrientName, number>;

    isLoaded: boolean;
    errorMessage?: Option<string>;
}

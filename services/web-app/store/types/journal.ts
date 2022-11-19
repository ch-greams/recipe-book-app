import type { NutrientName } from "@common/nutrients";



export interface JournalEntry {
    id: number;

    entryDate: string;
    entryTime: string;

    groupOrderNumber: Option<number>;

    foodName: string;
    foodAmount: number;
    foodUnit: string;
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
    nutrientsInputs: Dictionary<NutrientName, string>;

    isLoaded: boolean;
    errorMessage?: Option<string>;
}

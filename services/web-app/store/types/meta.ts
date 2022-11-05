import type { NutrientDescription,NutrientName } from "@common/nutrients";


export interface MetaStore {
    isLoading: boolean;
    errorMessage?: Option<string>;

    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
}

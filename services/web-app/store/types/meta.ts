import type { NutrientDescription,NutrientName } from "@common/nutritionFacts";


export interface MetaStore {
    isLoading: boolean;
    errorMessage?: Option<string>;

    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
}

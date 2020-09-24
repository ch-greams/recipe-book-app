import { NutritionFactType } from "../nutrients";

export type Dictionary<TKey extends string | number | symbol, TValue> = {
    [key in TKey]?: TValue;
}


interface Food {
    id: string;
    name: string;
    brand: string;
    description: string;
    nutritionFactValues: Dictionary<NutritionFactType, number>;
}

import { NutritionFactType } from "../nutritionFacts";
import { CustomUnit } from "../units";

export type Dictionary<TKey extends string | number | symbol, TValue> = {
    [key in TKey]?: TValue;
}

export type InputChangeCallback = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type SelectChangeCallback = (event: React.ChangeEvent<HTMLSelectElement>) => void;

interface Food {
    id: string;
    name: string;
    brand: string;
    subtitle: string;
    nutritionFactValues: Dictionary<NutritionFactType, number>;
    customUnits: CustomUnit[];
}

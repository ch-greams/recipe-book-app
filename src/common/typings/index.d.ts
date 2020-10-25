import { SubDirectionType } from "../../client/store/recipe/types";
import { NutritionFactType } from "../nutritionFacts";
import { CustomUnit, UnitTemperature, UnitTime, UnitVolume, UnitWeight } from "../units";

export type Dictionary<TKey extends string | number | symbol, TValue> = {
    [key in TKey]?: TValue;
};

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

interface IngredientItem {
    id: string;
    name: string;
    nutritionFacts: Dictionary<NutritionFactType, number>;
}

interface Ingredient {
    amount: number;
    unit: UnitWeight | UnitVolume;
    item: IngredientItem;
}

interface IngredientDefault extends Ingredient {
    alternatives: Ingredient[];
}

interface Time {
    count: number;
    unit: UnitTime;
}

interface Temperature {
    count: number;
    unit: UnitTemperature;
}

interface SubDirection {
    type: SubDirectionType;
    label: string;
}

interface SubDirectionIngredient extends SubDirection {
    id: string;
    amount: number;
    unit: UnitWeight | UnitVolume;
}

interface Direction {
    stepNumber: number;
    name: string;
    time?: Time;
    temperature?: Temperature;
    steps: (SubDirection | SubDirectionIngredient)[];
}

interface Recipe {
    id: string;
    name: string;
    brand: string;
    subtitle: string;
    description: string;
    type: string;

    customUnits: CustomUnit[];

    ingredients: IngredientDefault[];
    directions: Direction[];
}

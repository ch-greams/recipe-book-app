import { SubDirectionType } from "../../client/store/recipe/types";
import { NutritionFactType } from "../nutritionFacts";
import { CustomUnit, TemperatureUnit, TimeUnit, VolumeUnit, WeightUnit } from "../units";

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
    nutritionFacts: Dictionary<NutritionFactType, number>;
    customUnits: CustomUnit[];
}

interface IngredientItem {
    id: string;
    name: string;
    nutritionFacts: Dictionary<NutritionFactType, number>;
}

interface Ingredient {
    amount: number;
    unit: WeightUnit | VolumeUnit;
    id: string;
}

interface IngredientDefault extends Ingredient {
    alternatives: Ingredient[];
}

interface Time {
    count: number;
    unit: TimeUnit;
}

interface Temperature {
    count: number;
    unit: TemperatureUnit;
}

interface SubDirection {
    type: SubDirectionType;
    label: string;
}

interface SubDirectionIngredient extends SubDirection {
    id: string;
    amount: number;
    unit: WeightUnit | VolumeUnit;
}

interface Direction {
    stepNumber: number;
    name: string;
    time?: Time;
    temperature?: Temperature;
    steps: (SubDirection | SubDirectionIngredient)[];
}

interface References {
    food: IngredientItem[];
    recipe: IngredientItem[];
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
    references: References;
}

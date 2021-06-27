import type { NutritionFactType } from "@common/nutritionFacts";
import type { CustomUnit, TemperatureUnit, TimeUnit, VolumeUnit, WeightUnit } from "@common/units";
import type { SubDirectionType } from "@store/recipe/types";

export * from "./common";

export interface Food {
    id: string;
    name: string;
    brand: string;
    subtitle: string;
    density: number;
    nutritionFacts: Dictionary<NutritionFactType, number>;
    customUnits: CustomUnit[];
}

export interface IngredientItem {
    id: string;
    name: string;
    nutritionFacts: Dictionary<NutritionFactType, number>;
}

export interface Ingredient {
    amount: number;
    unit: WeightUnit | VolumeUnit;
    id: string;
}

export interface IngredientDefault extends Ingredient {
    alternatives: Ingredient[];
}

export interface Time {
    count: number;
    unit: TimeUnit;
}

export interface Temperature {
    count: number;
    unit: TemperatureUnit;
}

export interface SubDirection {
    type: SubDirectionType;
    label: string;
}

export interface SubDirectionIngredient extends SubDirection {
    id: string;
    amount: number;
    unit: WeightUnit | VolumeUnit;
}

export interface Direction {
    stepNumber: number;
    name: string;
    time?: Option<Time>;
    temperature?: Option<Temperature>;
    steps: (SubDirection | SubDirectionIngredient)[];
}

export interface References {
    food: IngredientItem[];
    recipe: IngredientItem[];
}

export interface Recipe {
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

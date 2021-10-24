import type { NutritionFactType } from "@common/nutritionFacts";
import type { CustomUnit, TemperatureUnit, TimeUnit, VolumeUnit, WeightUnit } from "@common/units";
import type { SubDirectionType } from "@store/recipe/types";

export * from "./common";

export interface Food {
    id: number;
    name: string;
    brand: string;
    subtitle: string;
    density: number;
    nutritionFacts: Dictionary<NutritionFactType, number>;
    customUnits: CustomUnit[];
}

export interface IngredientProduct {
    id: number;
    name: string;
    amount: number;
    unit: WeightUnit | VolumeUnit;
    nutritionFacts: Dictionary<NutritionFactType, number>;
}

export interface Ingredient {
    id: number;
    product_id: number;
    products: Dictionary<number, IngredientProduct>;
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

export interface Recipe {
    id: number;
    name: string;
    brand: string;
    subtitle: string;
    description: string;
    type: string;

    customUnits: CustomUnit[];

    ingredients: Ingredient[];
    directions: Direction[];
}

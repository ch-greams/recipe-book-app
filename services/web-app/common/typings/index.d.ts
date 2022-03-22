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
    nutrition_facts: Dictionary<NutritionFactType, number>;
    custom_units: CustomUnit[];
}

export interface IngredientProduct {
    product_id: number;
    product_type: "food" | "recipe";
    name: string;
    amount: number;
    unit: WeightUnit | VolumeUnit;
    nutrition_facts: Dictionary<NutritionFactType, number>;
}

export interface Ingredient {
    id: number;
    product_id: number;
    products: Dictionary<number, IngredientProduct>;
}

export interface Time {
    value: number;
    unit: TimeUnit;
}

export interface Temperature {
    value: number;
    unit: TemperatureUnit;
}

export interface SubDirection {
    direction_part_type: SubDirectionType;
    label: string;
}

export interface SubDirectionIngredient extends SubDirection {
    product_id: string;
    product_amount: number;
    unit: WeightUnit | VolumeUnit;
}

export interface Direction {
    step_number: number;
    name: string;
    duration?: Option<Time>;
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

    custom_units: CustomUnit[];

    ingredients: Ingredient[];
    directions: Direction[];
}

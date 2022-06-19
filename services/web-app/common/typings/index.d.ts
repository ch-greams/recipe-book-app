import type { NutritionFactType } from "@common/nutritionFacts";
import type { CustomUnit, TemperatureUnit, TimeUnit, Unit, VolumeUnit, WeightUnit } from "@common/units";
import type { ProductType } from "@common/utils";
import type { DirectionPartType } from "@store/recipe/types";

export * from "./common";

export interface Food {
    id: number;
    name: string;
    brand: string;
    subtitle: string;
    description: string;
    density: number;
    serving_size: number;
    nutrition_facts: Dictionary<NutritionFactType, number>;
    custom_units: CustomUnit[];
    is_private: boolean;
}

// TODO: Create an app version of this type (camelCase) and have all necessary fields available
export interface ProductShort {
    id: number;
    product_type: ProductType;
    name: string;
    brand: string;
    subtitle: string;
    // is_private: boolean;
    // created_at: DateTime<Utc>;
    // updated_at: DateTime<Utc>;
}

export interface FoodShort {
    id: number;
    name: string;
    brand: string;
    subtitle: string;
}

export interface IngredientProduct {
    product_id: number;
    product_type: ProductType;
    name: string;
    amount: number;
    unit: Unit;
    nutrition_facts: Dictionary<NutritionFactType, number>;
}

export interface Ingredient {
    id: number;
    product_id: number;
    products: Dictionary<number, IngredientProduct>;
}

export interface DirectionPart {
    step_number: number;
    direction_part_type: DirectionPartType;
    comment_text?: Option<string>;
    ingredient_id?: Option<number>;
    ingredient_amount?: Option<number>;
}

export interface Direction {
    id: number;
    step_number: number;
    name: string;
    duration_value?: Option<number>;
    duration_unit: TimeUnit;
    temperature_value?: Option<number>;
    temperature_unit: TemperatureUnit;
    steps: DirectionPart[];
}

export interface Recipe {
    id: number;
    name: string;
    brand: string;
    subtitle: string;
    description: string;
    type: string;
    density: number;
    serving_size: number;

    custom_units: CustomUnit[];

    ingredients: Ingredient[];
    directions: Direction[];

    is_private: boolean;
}

export interface RecipeShort {
    id: number;
    name: string;
    brand: string;
    subtitle: string;
}

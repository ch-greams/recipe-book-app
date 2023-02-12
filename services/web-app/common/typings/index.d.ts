import type { NutrientName } from "@common/nutrients";
import type { CustomUnit, TemperatureUnit, TimeUnit, Unit } from "@common/units";


export * from "./common";

export interface Food {
    id: number;
    name: string;
    brand: string;
    description: string;
    density: number;
    serving_size: number;
    nutrients: Dictionary<NutrientName, number>;
    custom_units: CustomUnit[];
    is_private: boolean;
}

// TODO: ??? Create an app version of this type (camelCase) and have all necessary fields available
export interface ProductShort {
    id: number;
    is_recipe: boolean;
    name: string;
    brand: string;
    // is_private: boolean;
    // created_at: DateTime<Utc>;
    // updated_at: DateTime<Utc>;
}

export interface FoodShort {
    id: number;
    name: string;
    brand: string;
    is_recipe: boolean;
}

export interface Ingredient {
    id: number;
    slot_number: number;
    product_id: number;
    name: string;
    amount: number;
    unit: Unit;
    density: number;
    is_alternative: boolean;
    is_recipe: boolean;
    nutrients: Dictionary<NutrientName, number>;
}

export interface InstructionIngredient {
    ingredient_slot_number: number;
    ingredient_percentage: number;
}

export interface Instruction {
    id: number;
    step_number: number;
    description: string;
    duration_value?: Option<number>;
    duration_unit: TimeUnit;
    temperature_value?: Option<number>;
    temperature_unit: TemperatureUnit;
    ingredients: InstructionIngredient[];
}

export interface Recipe extends Food {
    type: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
}

export interface NutrientMeta {
    id: number;
    name: string;
    daily_value?: Option<number>;
    unit: string;
    nutrient_group: string;
    parent_name?: Option<string>;
}
export interface UserNutrient {
    user_id: number;
    nutrient_id: number;
    is_featured: boolean;
    daily_target_amount?: Option<number>;
    ui_index: number;
}

export interface UserNutrientDetailed extends UserNutrient {
    nutrient_name: string;
    nutrient_daily_value?: Option<number>;
    nutrient_unit: string;
    nutrient_group: string;
    nutrient_parent_name?: Option<string>;
}

export interface JournalGroup {
    ui_index: number;
    name: string;
    user_id: number;
}

export interface JournalEntry {
    id: number;
    user_id: number;
    entry_date: string;
    entry_time: string;
    product_id: number;
    amount: number;
    unit: string;
    journal_group_ui_index: Option<number>;
}

export interface JournalEntryDetailed extends JournalEntry {
    product_name: string;
    product_density: number;
    nutrients: Dictionary<NutrientName, number>;
    custom_units: CustomUnit[];
}

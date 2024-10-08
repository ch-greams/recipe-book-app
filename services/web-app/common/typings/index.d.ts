import type { NutrientName } from "@common/nutrients";
import type { CustomUnit, TemperatureUnit, TimeUnit, Unit } from "@common/units";


export * from "./common";

export interface Food {
    id: number;
    name: string;
    brand: string;
    description: string;
    type: string;
    density: number;
    serving_size: number;
    nutrients: Dictionary<NutrientName, number>;
    custom_units: CustomUnit[];
    is_private: boolean;
    is_recipe: boolean;
}

export interface FoodShort {
    id: number;
    is_recipe: boolean;
    name: string;
    brand: string;
    // is_private: boolean;
    // created_at: string;
    // updated_at: string;
}

export interface Ingredient {
    id: number;
    slot_number: number;
    food_id: number;
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
}

export interface JournalEntry {
    id: number;
    entry_date: string;
    entry_time: string;
    food_id: number;
    amount: number;
    unit: string;
    journal_group_ui_index: Option<number>;
}

export interface JournalEntryDetailed extends JournalEntry {
    food_name: string;
    food_density: number;
    nutrients: Dictionary<NutrientName, number>;
    custom_units: CustomUnit[];
}

export interface UserInfo {
    journal_groups: JournalGroup[];
    user_nutrients: UserNutrientDetailed[];
    created_foods: FoodShort[];
    favorite_foods: FoodShort[];
}

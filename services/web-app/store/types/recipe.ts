import type { NutrientName } from "@common/nutrients";
import type * as typings from "@common/typings";
import type * as units from "@common/units";


export interface RecipeIngredientProduct extends typings.IngredientProduct {
    amountInput: string;
}

export interface RecipeIngredient extends typings.Ingredient {
    isOpen: boolean;
    isMarked: boolean;
    products: Dictionary<number, RecipeIngredientProduct>;
    alternativeNutrients: Dictionary<NutrientName, number>;
}


export enum DirectionPartType {
    Tip = "tip",
    Note = "note",
    Warning = "warning",
    Ingredient = "ingredient",
}

export interface RecipeDirectionPartComment {
    // NOTE: Used only for component identification, not saved in db
    id: number;
    stepNumber: number;
    type: DirectionPartType;
    commentText: string;
}

export interface RecipeDirectionPartIngredient {
    // NOTE: Used only for component identification, not saved in db
    id: number;
    stepNumber: number;
    type: DirectionPartType;
    isMarked: boolean;
    ingredientId: number;
    ingredientAmount: number;
    ingredientAmountInput: string;
    ingredientName: string;
    ingredientUnit: units.Unit;
    ingredientDensity: number;
}

export interface RecipeDirection {
    id: number;

    stepNumber: number;
    name: string;

    durationValue?: Option<number>;
    durationUnit: units.TimeUnit;
    durationValueInput: string;

    temperatureValue?: Option<number>;
    temperatureUnit: units.TemperatureUnit;
    temperatureValueInput: string;

    isOpen: boolean;
    isMarked: boolean;

    steps: (RecipeDirectionPartComment | RecipeDirectionPartIngredient)[];
}


export interface RecipePageStore {
    isLoading: boolean;
    isLoaded: boolean;
    isLoadedIngredients: boolean;
    errorMessage?: Option<string>;

    editMode: boolean;

    id: number;
    name: string;
    brand: string;
    subtitle: string;
    description: string;
    type: string;

    density: number;
    densityInput: string;
    densityVolumeUnit: units.VolumeUnit;
    densityWeightUnit: units.WeightUnit;

    nutrients: Dictionary<NutrientName, number>;
    customUnits: units.CustomUnitInput[];
    isPrivate: boolean;

    // NOTE: INPUTS
    servingSize: number;
    servingSizeInput: string;
    servingSizeUnit: units.WeightUnit | units.VolumeUnit;

    nutrientsByServing: Dictionary<NutrientName, number>;
    nutrientsByServingInputs: Dictionary<NutrientName, string>;

    ingredients: RecipeIngredient[];

    newDirection: RecipeDirection;
    directions: RecipeDirection[];

    // NOTE: NEW RECIPE
    isCreated: boolean;
}

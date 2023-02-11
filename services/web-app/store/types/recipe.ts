import type { NutrientName } from "@common/nutrients";
import type * as typings from "@common/typings";
import type * as units from "@common/units";


export interface RecipeIngredient extends typings.Ingredient {
    amountInput: string;
    isOpen: boolean;
    isMarked: boolean;
    alternativeNutrients: Dictionary<NutrientName, number>;
}

export interface RecipeInstructionIngredient {
    ingredientSlotNumber: number;
    ingredientAmount: number;
    ingredientAmountInput: string;

    ingredientName: string;
    ingredientUnit: units.Unit;
    ingredientDensity: number;
}

export interface RecipeInstruction {
    id: number;

    stepNumber: number;
    description: string;

    durationValue?: Option<number>;
    durationUnit: units.TimeUnit;
    durationValueInput: string;

    temperatureValue?: Option<number>;
    temperatureUnit: units.TemperatureUnit;
    temperatureValueInput: string;

    isOpen: boolean;
    isMarked: boolean;

    ingredients: RecipeInstructionIngredient[];
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
    instructions: RecipeInstruction[];

    // NOTE: NEW RECIPE
    isCreated: boolean;
}

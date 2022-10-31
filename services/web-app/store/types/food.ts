import type { NutrientName } from "@common/nutritionFacts";
import type { CustomUnitInput, Unit, VolumeUnit, WeightUnit } from "@common/units";


export interface FoodPageStore {

    isLoaded: boolean;
    errorMessage?: Option<string>;

    editMode: boolean;

    id: number;
    name: string;
    brand: string;
    subtitle: string;
    description: string;
    nutritionFacts: Dictionary<NutrientName, number>;
    customUnits: CustomUnitInput[];
    isPrivate: boolean;

    // NOTE: INPUTS

    nutritionFactsByServing: Dictionary<NutrientName, number>;
    nutritionFactsByServingInputs: Dictionary<NutrientName, string>;

    // NOTE: STATIC

    type: string;

    density: number;
    densityInput: string;
    densityVolumeUnit: VolumeUnit;
    densityWeightUnit: WeightUnit;

    servingSize: number;
    servingSizeInput: string;
    servingSizeUnit: Unit | string;
    featuredNutritionFacts: NutrientName[];

    // NOTE: NEW FOOD
    isCreated: boolean;
}

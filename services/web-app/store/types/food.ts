import type { NutritionFactType } from "@common/nutritionFacts";
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
    nutritionFacts: Dictionary<NutritionFactType, number>;
    customUnits: CustomUnitInput[];
    isPrivate: boolean;

    // NOTE: INPUTS

    nutritionFactsByServing: Dictionary<NutritionFactType, number>;
    nutritionFactsByServingInputs: Dictionary<NutritionFactType, string>;

    // NOTE: STATIC

    type: string;

    density: number;
    densityInput: string;
    densityVolumeUnit: VolumeUnit;
    densityWeightUnit: WeightUnit;

    servingSize: number;
    servingSizeInput: string;
    servingSizeUnit: Unit | string;
    featuredNutritionFacts: NutritionFactType[];

    // NOTE: NEW FOOD
    isCreated: boolean;
}

import type { NutrientName } from "@common/nutrients";
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
    nutrients: Dictionary<NutrientName, number>;
    customUnits: CustomUnitInput[];
    isPrivate: boolean;

    // NOTE: INPUTS

    nutrientsByServing: Dictionary<NutrientName, number>;
    nutrientsByServingInputs: Dictionary<NutrientName, string>;

    // NOTE: STATIC

    type: string;

    density: number;
    densityInput: string;
    densityVolumeUnit: VolumeUnit;
    densityWeightUnit: WeightUnit;

    servingSize: number;
    servingSizeInput: string;
    servingSizeUnit: Unit | string;
    featuredNutrients: NutrientName[];

    // NOTE: NEW FOOD
    isCreated: boolean;
}
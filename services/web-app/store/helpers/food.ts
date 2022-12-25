import type { NutrientName } from "@common/nutrients";
import { getKeys } from "@common/object";
import type { Food } from "@common/typings";
import type { CustomUnit, CustomUnitInput } from "@common/units";

import type { FoodPageStore } from "../types/food";



export function convertFoodPageIntoFood(foodPage: FoodPageStore): Food {
    return {
        id: foodPage.id,
        name: foodPage.name,
        brand: foodPage.brand,
        description: foodPage.description,
        density: foodPage.density,
        serving_size: foodPage.servingSize,
        nutrients: foodPage.nutrients,
        custom_units: foodPage.customUnits,
        is_private: foodPage.isPrivate,
    };
}

export function convertNutrientInputsIntoValues(values: Dictionary<NutrientName, string>): Dictionary<NutrientName, number> {
    return getKeys(values).reduce<Dictionary<NutrientName, number>>(
        (acc, nfType) => ({ ...acc, [nfType]: values[nfType]?.toNumber() || null }), {},
    );
}

export function convertCustomUnitsIntoInputs(customUnits: CustomUnit[]): CustomUnitInput[] {
    return customUnits.map((customUnit) => ({ ...customUnit, amountInput: String(customUnit.amount) }));
}

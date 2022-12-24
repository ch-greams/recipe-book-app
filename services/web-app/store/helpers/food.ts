import type { Food } from "@common/typings";

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

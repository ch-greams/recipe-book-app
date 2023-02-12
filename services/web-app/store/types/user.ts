import type { FoodShort } from "@common/typings";


export enum UserMenuItem {
    Settings = "Settings",
    Foods = "Foods",
}

export interface UserStoreNutrient {
    nutrientId: number;
    isFeatured: boolean;
    userDailyTargetAmount?: Option<number>;
    uiIndex: number;
    nutrientName: string;
    nutrientDailyTargetAmount?: Option<number>;
    nutrientUnit: string;
    nutrientGroup: string;
    nutrientParentName?: Option<string>;
}

export interface UserStore {
    isLoggedIn: boolean;

    userId: number;
    userName: string;

    selectedMenuItem: UserMenuItem;

    favoriteFoods: FoodShort[];
    customFoods: FoodShort[];

    nutrients: UserStoreNutrient[];

    isLoaded: boolean;
    errorMessage?: Option<string>;
}

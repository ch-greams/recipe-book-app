import type { FoodShort, RecipeShort } from "@common/typings";
import type { UserMenuItem } from "@common/utils";


export interface UserStore {
    userId: number;
    userName: string;

    selectedMenuItem: UserMenuItem;

    favoriteRecipes: RecipeShort[];
    customRecipes: RecipeShort[];

    favoriteFoods: FoodShort[];
    customFoods: FoodShort[];


    isLoaded: boolean;
    errorMessage?: Option<string>;
}

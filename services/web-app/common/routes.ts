
export const HOME_PATH = "/";
export const RECIPE_PATH = "/recipe";
export const USER_PATH = "/user";
export const JOURNAL_PATH = "/journal";
export const LOGIN_PATH = "/login";
export const SIGNUP_PATH = "/signup";
export const NEW_RECIPE_PATH = "/recipe/new";
export const NEW_FOOD_PATH = "/food/new";


export function getRecipePath(id: number): string {
    return [ RECIPE_PATH, id ].join("/");
}

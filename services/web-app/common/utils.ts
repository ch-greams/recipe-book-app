import { isSome, unwrap, unwrapOr } from "@common/types";
import type { NutritionFact } from "@views/shared/rba-nutrition-fact-line";
import type { FoodPageStore } from "@store/food/types";
import type {
    RecipeDirection, RecipeDirectionPartComment, RecipeDirectionPartIngredient, RecipeIngredient, RecipeIngredientProduct, RecipePageStore,
} from "@store/recipe/types";

import NUTRITION_FACT_DESCRIPTIONS from "./mapping/nutritionFactDescriptions";
import type { NutritionFactDescription } from "./nutritionFacts";
import { NutritionFactType } from "./nutritionFacts";
import type { Comparer, Direction, DirectionPart, Food, Ingredient, IngredientProduct, Recipe } from "./typings";
import type { CustomUnit, CustomUnitInput } from "./units";
import { WeightUnit } from "./units";


export enum UserMenuItem {
    Diary = "Diary",
    Recipes = "Recipes",
    Foods = "Foods",
}

export enum ProductType {
    Food = "food",
    Recipe = "recipe",
}

export enum DecimalPlaces {
    Zero = 0,
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
}

export enum ComparerResult {
    Negative = -1,
    Zero = 0,
    Positive = 1,
}


export default class Utils {

    public static readonly MAX_DAILY_VALUE: number = 999;

    public static readonly ZERO: number = 0;
    private static readonly CENTUM: number = 100;

    // NOTE: CALCULATIONS

    public static roundToDecimal(value: number, accuracy: DecimalPlaces): number {

        const MULTIPLIER_PER_SINGLE_DIGIT = 10;

        const accuracyMultiplier: number = Math.pow(MULTIPLIER_PER_SINGLE_DIGIT, accuracy);

        const getRoundedValue: string = ( Math.round(value * accuracyMultiplier) / accuracyMultiplier ).toFixed(accuracy);

        return Number(getRoundedValue);
    }

    public static decimalNormalizer(value: string, previousValue: string): string {

        const DEFAULT_VALUE = "";

        if (value) {
            const isDouble = /^\d*\.?\d+$/.test(value);
            const isPartialDecimal = /^\d*\.?$/.test(value);

            return ( (isDouble || isPartialDecimal) ? value : (previousValue || DEFAULT_VALUE) );
        }

        return DEFAULT_VALUE;
    }

    public static isEmptyString(value: string): boolean {
        return value.trim().length === Utils.ZERO;
    }

    // NOTE: APP-SPECIFIC CALCULATIONS

    public static getNutritionFacts(
        nutritionFactTypes: NutritionFactType[],
        nutritionFacts: Dictionary<NutritionFactType, number>,
        nutritionFactInputs: Dictionary<NutritionFactType, string>,
    ): NutritionFact[] {

        return nutritionFactTypes.reduce<NutritionFact[]>(
            (previousNutritionFacts: NutritionFact[], currentNutrientType: NutritionFactType): NutritionFact[] => {

                const amount: Option<number> = nutritionFacts[currentNutrientType];
                const inputValue: Option<string> = nutritionFactInputs[currentNutrientType];
                const nutritionFactDescription: NutritionFactDescription = NUTRITION_FACT_DESCRIPTIONS[currentNutrientType];

                return [
                    ...previousNutritionFacts,
                    {
                        type: currentNutrientType,
                        amount: amount,
                        inputValue: inputValue || "",
                        unit: nutritionFactDescription.unit,
                        dailyValue: Utils.getDailyValuePercent(amount, nutritionFactDescription.dailyValue),
                        isFraction: nutritionFactDescription.isFraction,
                    },
                ];
            },
            [],
        );
    }

    public static getPercentMultiplier(value: number): number {

        return (value / Utils.CENTUM);
    }

    public static getDailyValuePercent(currentValue: Option<number>, dailyValue: Option<number>): Option<number> {

        return (
            ( isSome(currentValue) && isSome(dailyValue) )
                ? Utils.roundToDecimal(( currentValue / dailyValue ) * Utils.CENTUM, DecimalPlaces.One)
                : null
        );
    }

    public static dictionarySum(
        ingredients: Dictionary<NutritionFactType, number>[],
    ): Dictionary<NutritionFactType, number> {

        return Object.values(NutritionFactType).reduce((acc: Dictionary<NutritionFactType, number>, nutrientType) => {

            const nutritionFactValue = ingredients.reduce(
                (sum: Option<number>, ingredient) => {
                    const value = ingredient[nutrientType];
                    return ( isSome(value) ? unwrapOr(sum, Utils.ZERO) + value : sum );
                },
                null,
            );

            return {
                ...acc,
                [nutrientType]: (
                    isSome(nutritionFactValue)
                        ? Utils.roundToDecimal(nutritionFactValue, DecimalPlaces.Two)
                        : null
                ),
            };
        }, {});
    }

    public static convertNutritionFacts(
        amount: number,
        isFrom: boolean,
        nutritionFacts: Dictionary<NutritionFactType, number>,
    ): Dictionary<NutritionFactType, number> {

        const multiplier = isFrom ? ( amount / Utils.CENTUM ) : ( Utils.CENTUM / amount );

        const updatedNutritionFacts: Dictionary<NutritionFactType, number> = Utils.getObjectKeys(nutritionFacts)
            .reduce((acc, cur) => {
                const nutritionFact = nutritionFacts[cur];
                return {
                    ...acc,
                    [cur]: (
                        isSome(nutritionFact)
                            ? Utils.roundToDecimal(nutritionFact * multiplier, DecimalPlaces.Two)
                            : null
                    ),
                };
            }, {});

        return updatedNutritionFacts;
    }

    // NOTE: OTHER GENERIC THINGS

    public static getObjectKeys<T>(obj: T | Dictionary<keyof T, unknown>, ensureNumber: boolean = false): (keyof T)[] {
        return ( ensureNumber ? Object.keys(obj).map(Number) : Object.keys(obj) ) as (keyof T)[];
    }

    public static getObjectValues<T>(obj: Dictionary<ID, T>): T[] {
        return Object.values(obj) as T[];
    }

    /**
     * Generates a temporary id, which is a negative locally unique number to distinguish from real ids
     * Used for ingridients in a new recipe
     */
    public static getTemporaryId(): number {
        return -Date.now();
    }

    public static getNumberOfLines(str: string): number {
        const SINGLE_LINE = 1;
        return (str.match(/\n/g) || "").length + SINGLE_LINE;
    }

    public static sortBy<T>(field: keyof T): Comparer<T> {
        return (a: T, b: T) => a[field] > b[field] ? ComparerResult.Positive : ComparerResult.Negative;
    }

    public static arrayIsNotEmpty(array: unknown[]): boolean {
        return (Array.isArray(array) && array.length > Utils.ZERO);
    }

    public static objectIsNotEmpty<T>(obj: T | Dictionary<string | number | symbol, T>): boolean {
        return (!!obj && (typeof obj === "object") && Object.keys(obj).length > Utils.ZERO);
    }

    public static getItemPath(route: ProductType, id: number): string {
        return `/${route}/${id}`;
    }

    public static getNewItemPath(route: ProductType): string {
        return `/${route}/new`;
    }

    public static getUrlParams(obj: object): string {
        return Utils.getObjectKeys(obj).map((key) => `${key}=${obj[key]}`).join("&");
    }

    public static classNames(values: Dictionary<string, boolean>): string {
        return Object.keys(values).filter((key) => values[key]).join(" ");
    }

    public static keepCaretInPlace(window: Window & typeof globalThis, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const caret = event.target.selectionStart;
        const element = event.target;
        window.requestAnimationFrame(() => {
            element.selectionStart = caret;
            element.selectionEnd = caret;
        });
    }

    // NOTE: From reducers

    /**
     * @returns converted `string` or `None` if `value` was `None` in the first place
     */
    public static numberToString(value: Option<number>): Option<string> {
        return isSome(value) ? String(value) : null;
    }

    /**
     * @returns converted `number` or `None` if `value` was an empty `string` or `None` in the first place
     */
    public static stringToNumber(value: Option<string>): Option<number> {
        return ( ( isSome(value) && !Utils.isEmptyString(value) ) ? Number(value) : null );
    }

    public static convertNutritionFactValuesIntoInputs(values: Dictionary<NutritionFactType, number>): Dictionary<NutritionFactType, string> {
        return Utils.getObjectKeys(values).reduce<Dictionary<NutritionFactType, string>>(
            (acc, nfType) => ({ ...acc, [nfType]: Utils.numberToString(values[nfType]) }), {},
        );
    }

    public static convertNutritionFactInputsIntoValues(values: Dictionary<NutritionFactType, string>): Dictionary<NutritionFactType, number> {
        return Utils.getObjectKeys(values).reduce<Dictionary<NutritionFactType, number>>(
            (acc, nfType) => ({ ...acc, [nfType]: Utils.stringToNumber(values[nfType]) }), {},
        );
    }

    public static convertCustomUnitsIntoInputs(customUnits: CustomUnit[]): CustomUnitInput[] {
        return customUnits.map((customUnit) => ({ ...customUnit, amountInput: String(customUnit.amount) }));
    }

    // NOTE: Page conversion

    public static convertFoodPageIntoFood(foodPage: FoodPageStore): Food {
        return {
            id: foodPage.id,
            name: foodPage.name,
            brand: foodPage.brand,
            subtitle: foodPage.subtitle,
            description: foodPage.description,
            density: foodPage.density,
            nutrition_facts: foodPage.nutritionFacts,
            custom_units: foodPage.customUnits,
            is_private: foodPage.isPrivate,
        };
    }

    private static convertRecipeDirectionPartIntoDirectionPart(
        recipeDirectionPart: RecipeDirectionPartComment | RecipeDirectionPartIngredient,
        ingredients: RecipeIngredient[],
    ): DirectionPart {

        const directionPartIngredient = recipeDirectionPart as RecipeDirectionPartIngredient;
        const ingredientId = directionPartIngredient.ingredientId;

        let ingredientAmount;

        if (ingredientId) {
            const ingredient = unwrap(
                ingredients.find((_ingredient) => _ingredient.id === ingredientId),
                "ingredients.find((_ingredient) => _ingredient.id === ingredientId)",
            );

            const ingredientProduct = Utils.getRecipeIngredientProduct(ingredient);

            ingredientAmount = directionPartIngredient.ingredientAmount / ingredientProduct.amount;
        }

        return {
            step_number: recipeDirectionPart.stepNumber,
            direction_part_type: recipeDirectionPart.type,
            comment_text: (recipeDirectionPart as RecipeDirectionPartComment).commentText,
            ingredient_id: ingredientId,
            ingredient_amount: ingredientAmount,
        };
    }

    private static convertRecipeDirectionIntoDirection(recipeDirection: RecipeDirection, ingredients: RecipeIngredient[]): Direction {

        const directionParts = recipeDirection.steps
            .map((directionPart) => Utils.convertRecipeDirectionPartIntoDirectionPart(directionPart, ingredients));

        return {
            id: recipeDirection.id,
            step_number: recipeDirection.stepNumber,
            name: recipeDirection.name,
            duration_value: recipeDirection.durationValue,
            duration_unit: recipeDirection.durationUnit,
            temperature_value: recipeDirection.temperatureValue,
            temperature_unit: recipeDirection.temperatureUnit,
            steps: directionParts,
        };
    }

    public static convertRecipePageIntoRecipe(recipePage: RecipePageStore): Recipe {

        const directions = recipePage.directions
            .map((direction) => Utils.convertRecipeDirectionIntoDirection(direction, recipePage.ingredients));

        return {
            id: recipePage.id,
            name: recipePage.name,
            brand: recipePage.brand,
            subtitle: recipePage.subtitle,
            description: recipePage.description,
            custom_units: recipePage.customUnits,
            type: recipePage.type,
            density: recipePage.density,
            ingredients: recipePage.ingredients,
            directions: directions,
            is_private: recipePage.isPrivate,
        };
    }

    public static convertFoodToIngredientProduct(food: Food): IngredientProduct {
        return {
            product_id: food.id,
            product_type: ProductType.Food,
            name: food.name,
            amount: 100,
            unit: WeightUnit.g,
            nutrition_facts: food.nutrition_facts,
        };
    }

    public static convertRecipeToIngredientProduct(recipe: Recipe): IngredientProduct {
        return {
            product_id: recipe.id,
            product_type: ProductType.Recipe,
            name: recipe.name,
            amount: 100,
            unit: WeightUnit.g,
            nutrition_facts: Utils.getRecipeNutritionFacts(recipe.ingredients),
        };
    }

    /**
     * Calculate nutrition fact for a recipe based on currently selected ingredients
     */
    public static getRecipeNutritionFacts(ingredients: Ingredient[]): Dictionary<NutritionFactType, number> {

        const nutritionFactsById: Dictionary<NutritionFactType, number>[] = ingredients
            .map((ingredient) => {

                const ingredientProduct = Utils.getIngredientProduct(ingredient);

                const nutritionFacts = ingredientProduct.nutrition_facts;
                const multiplier = Utils.getPercentMultiplier(ingredientProduct.amount);

                return Utils.getObjectKeys(nutritionFacts)
                    .reduce((acc: Dictionary<NutritionFactType, number>, nutritionFactType) => {

                        const nutritionFactValue = nutritionFacts[nutritionFactType];

                        return {
                            ...acc,
                            [nutritionFactType]: (
                                isSome(nutritionFactValue)
                                    ? Utils.roundToDecimal(nutritionFactValue * multiplier, DecimalPlaces.Two)
                                    : null
                            ),
                        };
                    }, {});
            });

        return Utils.dictionarySum(nutritionFactsById);
    }

    public static getIngredientProduct(ingredient: Ingredient): IngredientProduct {
        return unwrap(ingredient.products[ingredient.product_id], `ingredient.products["${ingredient.product_id}"]`);
    }
    public static getRecipeIngredientProduct(ingredient: RecipeIngredient): RecipeIngredientProduct {
        return unwrap(ingredient.products[ingredient.product_id], `ingredient.products["${ingredient.product_id}"]`);
    }
}

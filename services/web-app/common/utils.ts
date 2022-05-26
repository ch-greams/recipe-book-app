import type { NutritionFact } from "@views/shared/rba-nutrition-fact-line";
import type { FoodPageStore } from "@store/food/types";
import type {
    RecipeDirection, RecipePageStore, RecipeSubDirectionComment, RecipeSubDirectionIngredient,
} from "@store/recipe/types";

import NUTRITION_FACT_DESCRIPTIONS from "./mapping/nutritionFactDescriptions";
import type { NutritionFactDescription } from "./nutritionFacts";
import { NutritionFactType } from "./nutritionFacts";
import type { Comparer, Direction, Food, Ingredient, IngredientProduct, Recipe, SubDirection } from "./typings";
import type { CustomUnit, CustomUnitInput } from "./units";
import { VolumeUnit, WeightUnit } from "./units";


export enum UserMenuItem {
    Diary = "Diary",
    Recipes = "Recipes",
    Foods = "Foods",
}

export enum RoutePath {
    Home = "",
    Food = "food",
    Recipe = "recipe",
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

    public static readonly CUP_TO_ML: number = 240;
    public static readonly TBSP_TO_ML: number = 14.7868;
    public static readonly TSP_TO_ML: number = 4.92892;
    public static readonly OZ_TO_G: number = 28.3495;


    public static convertDensity(
        value: number,
        weightUnit: WeightUnit,
        volumeUnit: VolumeUnit,
        toMetric: boolean = false,
    ): number {

        const convertedWeight = Utils.convertDensityWeight(value, weightUnit, toMetric);
        const convertedVolume = Utils.convertDensityVolume(convertedWeight, volumeUnit, toMetric);

        return convertedVolume;
    }

    public static convertDensityVolume(value: number, volumeUnit: VolumeUnit, toMetric: boolean = false): number {

        switch (volumeUnit) {

            case VolumeUnit.cup:
                return toMetric ? ( value / Utils.CUP_TO_ML )  : ( value * Utils.CUP_TO_ML );
            case VolumeUnit.tbsp:
                return toMetric ? ( value / Utils.TBSP_TO_ML ) : ( value * Utils.TBSP_TO_ML );
            case VolumeUnit.tsp:
                return toMetric ? ( value / Utils.TSP_TO_ML )  : ( value * Utils.TSP_TO_ML );

            case VolumeUnit.ml:
            default:
                return value;
        }
    }

    public static convertDensityWeight(value: number, weightUnit: WeightUnit, toMetric: boolean = false): number {

        switch (weightUnit) {

            case WeightUnit.oz:
                return toMetric ? ( value * Utils.OZ_TO_G ) : ( value / Utils.OZ_TO_G );

            case WeightUnit.g:
            default:
                return value;
        }
    }

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

    public static unwrapOr<T>(value: Option<T>, defaultValue: T): T {
        return this.isSome(value) ? value : defaultValue;
    }

    public static unwrap<T>(value: Option<T>, name: string): T {
        if (!this.isSome(value)) {
            throw new Error(`Error: Unexpectedly found None while unwrapping an Option value [${name}]`);
        }

        return value;
    }

    public static isSome<T>(value: Option<T>): value is T {
        return (value !== null) && (value !== undefined);
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
            ( Utils.isSome(currentValue) && Utils.isSome(dailyValue) )
                ? Utils.roundToDecimal(( currentValue / dailyValue ) * Utils.CENTUM, DecimalPlaces.One)
                : null
        );
    }

    public static getObjectKeys<T>(obj: T | Dictionary<keyof T, unknown>, ensureNumber: boolean = false): (keyof T)[] {
        return ( ensureNumber ? Object.keys(obj).map(Number) : Object.keys(obj) ) as (keyof T)[];
    }

    public static getObjectValues<T>(obj: Dictionary<ID, T>): T[] {
        return Object.values(obj) as T[];
    }

    public static dictionarySum(
        ingredients: Dictionary<NutritionFactType, number>[],
    ): Dictionary<NutritionFactType, number> {

        return Object.values(NutritionFactType).reduce((acc: Dictionary<NutritionFactType, number>, nutrientType) => {

            const nutritionFactValue = ingredients.reduce(
                (sum: Option<number>, ingredient) => {
                    const value = ingredient[nutrientType];
                    return ( Utils.isSome(value) ? Utils.unwrapOr(sum, Utils.ZERO) + value : sum );
                },
                null,
            );

            return {
                ...acc,
                [nutrientType]: (
                    Utils.isSome(nutritionFactValue)
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
                        Utils.isSome(nutritionFact)
                            ? Utils.roundToDecimal(nutritionFact * multiplier, DecimalPlaces.Two)
                            : null
                    ),
                };
            }, {});

        return updatedNutritionFacts;
    }

    // NOTE: OTHER GENERIC THINGS

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

    public static getItemPath(route: RoutePath | ProductType, id: number): string {
        return `/${route}/${id}`;
    }

    public static getNewItemPath(route: RoutePath | ProductType): string {
        return `/${route}/new?edit=true`;
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
        return Utils.isSome(value) ? String(value) : null;
    }

    /**
     * @returns converted `number` or `None` if `value` was an empty `string` or `None` in the first place
     */
    public static stringToNumber(value: Option<string>): Option<number> {
        return (
            Utils.isSome(value)
                ? ( Utils.isEmptyString(value) ? null : Number(value) )
                : null
        );
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
        return customUnits.map(this.convertCustomUnitIntoInput);
    }

    public static convertCustomUnitIntoInput(customUnit: CustomUnit): CustomUnitInput {
        return { ...customUnit, amount: String(customUnit.amount) };
    }

    public static convertCustomUnitIntoValue(product_id: number, customUnit: CustomUnitInput): CustomUnit {
        return { ...customUnit, product_id, amount: Number(customUnit.amount) };
    }

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

    private static convertRecipeDirectionStepIntoSubDirection(
        recipeDirectionStep: RecipeSubDirectionComment | RecipeSubDirectionIngredient,
    ): SubDirection {
        return {
            step_number: recipeDirectionStep.stepNumber,
            direction_part_type: recipeDirectionStep.type,
            comment_text: (recipeDirectionStep as RecipeSubDirectionComment).commentText,
            ingredient_id: (recipeDirectionStep as RecipeSubDirectionIngredient).ingredientId,
            ingredient_amount: (recipeDirectionStep as RecipeSubDirectionIngredient).ingredientAmount,
        };
    }

    private static convertRecipeDirectionIntoDirection(recipeDirection: RecipeDirection): Direction {
        return {
            step_number: recipeDirection.stepNumber,
            name: recipeDirection.name,
            duration_value: recipeDirection.durationValue,
            duration_unit: recipeDirection.durationUnit,
            temperature_value: recipeDirection.temperatureValue,
            temperature_unit: recipeDirection.temperatureUnit,
            steps: recipeDirection.steps.map(Utils.convertRecipeDirectionStepIntoSubDirection),
        };
    }

    public static convertRecipePageIntoRecipe(recipePage: RecipePageStore): Recipe {
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
            directions: recipePage.directions.map(Utils.convertRecipeDirectionIntoDirection),
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

                const ingredientProduct = Utils.unwrap(
                    ingredient.products[ingredient.product_id],
                    `ingredient.products["${ingredient.product_id}"]`,
                );

                const nutritionFacts = ingredientProduct.nutrition_facts;
                const multiplier = Utils.getPercentMultiplier(ingredientProduct.amount);

                return Utils.getObjectKeys(nutritionFacts)
                    .reduce((acc: Dictionary<NutritionFactType, number>, nutritionFactType) => {

                        const nutritionFactValue = nutritionFacts[nutritionFactType];

                        return {
                            ...acc,
                            [nutritionFactType]: (
                                Utils.isSome(nutritionFactValue)
                                    ? Utils.roundToDecimal(nutritionFactValue * multiplier, DecimalPlaces.Two)
                                    : null
                            ),
                        };
                    }, {});
            });

        return Utils.dictionarySum(nutritionFactsById);
    }
}

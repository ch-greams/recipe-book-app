import { NutritionFact } from "@client/components/NutritionFactsBlock/NutritionFactsBlock";
import { NUTRIENTS, NutritionFactType } from "./nutritionFacts";
import type { Dictionary } from "./typings";
import NUTRITION_FACT_DESCRIPTIONS from "./mapping/nutritionFactDescriptions";
import { RoutePath } from "@client/components/Root";
import { CustomUnit, CustomUnitInput } from "./units";


export enum DecimalPlaces {
    Zero = 0,
    One = 1,
    Two = 2,
}

export default class Utils {

    public static readonly ENERGY_DAILY_VALUE_CALORIES: number = 2000;
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

    // NOTE: APP-SPECIFIC CALCULATIONS

    public static getNutritionFacts(
        nutritionFactTypes: NutritionFactType[],
        nutritionFacts: Dictionary<NutritionFactType, number>,
        nutritionFactInputs: Dictionary<NutritionFactType, string>,
    ): NutritionFact[] {

        return nutritionFactTypes.reduce<NutritionFact[]>(
            (previousNutritionFacts, currentNutrientType) => {

                const amount = nutritionFacts[currentNutrientType];
                const inputValue = nutritionFactInputs[currentNutrientType];
                const nutritionFactDescription = NUTRITION_FACT_DESCRIPTIONS[currentNutrientType];

                return [
                    ...previousNutritionFacts,
                    {
                        type: currentNutrientType,
                        amount: amount,
                        inputValue: inputValue,
                        unit: nutritionFactDescription.unit,
                        dailyValue: Utils.getDailyValuePercent(amount, nutritionFactDescription.dailyValue),
                        isFraction: nutritionFactDescription.isFraction,
                    },
                ];
            },
            []
        );
    }

    public static getPercentMultiplier(value: number): number {

        return (value / Utils.CENTUM);
    }

    public static getDailyValuePercent(currentValue?: number, dailyValue?: number): number | null {

        const isDailyValueExist = typeof dailyValue === "number";
        const isCurrentValueExist = typeof currentValue === "number";

        return (
            ( isDailyValueExist && isCurrentValueExist )
                ? Utils.roundToDecimal(( currentValue / dailyValue ) * Utils.CENTUM, DecimalPlaces.One)
                : null
        );
    }

    public static getObjectKeys<T>(obj: T | Dictionary<keyof T, unknown>): (keyof T)[] {
        return Object.keys(obj) as (keyof T)[];
    }

    public static dictionarySum(
        ingredients: Dictionary<NutritionFactType, number>[],
    ): Dictionary<NutritionFactType, number> {

        return NUTRIENTS.reduce((acc, nutrientType) => {

            const nutritionFactValue = ingredients.reduce(
                (sum: number | null, ingredient) => (
                    typeof ingredient[nutrientType] === "number"
                        ? sum + ingredient[nutrientType]
                        : null
                ),
                null
            );

            return {
                ...acc,
                [nutrientType]: (
                    typeof nutritionFactValue === "number"
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
            .reduce((acc, cur) => ({
                ...acc,
                [cur]: Utils.roundToDecimal(nutritionFacts[cur] * multiplier, DecimalPlaces.Two),
            }), {});

        return updatedNutritionFacts;
    }

    // NOTE: OTHER

    public static arrayIsNotEmpty(array: unknown[]): boolean {
        return (Array.isArray(array) && array.length > Utils.ZERO);
    }

    public static objectIsNotEmpty<T>(obj: T | Dictionary<string | number | symbol, T>): boolean {
        return (!!obj && (typeof obj === "object") && Object.keys(obj).length > Utils.ZERO);
    }

    public static getItemPath(route: RoutePath, id: string): string {
        return `/${route}/${id}`;
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

    public static convertNutritionFactValuesIntoInputs(values: Dictionary<NutritionFactType, number>): Dictionary<NutritionFactType, string> {

        return Utils.getObjectKeys(values).reduce<Dictionary<NutritionFactType, string>>(
            (acc, nfType) => ({ ...acc, [nfType]: typeof values[nfType] === "number" ? String(values[nfType]) : null }), {}
        );
    }
    
    public static convertNutritionFactInputsIntoValues(values: Dictionary<NutritionFactType, string>): Dictionary<NutritionFactType, number> {
    
        return Utils.getObjectKeys(values).reduce<Dictionary<NutritionFactType, number>>(
            (acc, nfType) => ({ ...acc, [nfType]: Number(values[nfType]) }), {}
        );
    }
    
    public static convertCustomUnitsIntoInputs(customUnits: CustomUnit[]): CustomUnitInput[] {
    
        return customUnits.map((customUnit: CustomUnit) => ({ ...customUnit, amount: String(customUnit.amount) }));
    }
    
    public static convertCustomUnitsIntoValues(customUnits: CustomUnitInput[]): CustomUnit[] {
    
        return customUnits.map((customUnit: CustomUnitInput) => ({ ...customUnit, amount: Number(customUnit.amount) }));
    }
}

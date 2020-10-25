import { NutritionFact } from "../client/components/NutritionFactsBlock/NutritionFactsBlock";
import { NutritionFactType } from "./nutritionFacts";
import { Dictionary } from "./typings";
import NUTRITION_FACT_DESCRIPTIONS from "./mapping/nutritionFactDescriptions";
import { RoutePath } from "../client/components/Root";



export default class Utils {

    public static readonly ENERGY_DAILY_VALUE_CALORIES: number = 2000;
    public static readonly MAX_DAILY_VALUE: number = 999;

    public static readonly ZERO: number = 0;


    // NOTE: CALCULATIONS

    public static roundToDecimal(value: number, accuracy: number): number {

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

    public static getDailyValuePercent(currentValue?: number, dailyValue?: number): number | null {

        const PERCENT_MULTIPLIER = 100;
        const ACCURACY = 1;

        const isDailyValueExist = typeof dailyValue === "number";
        const isCurrentValueExist = typeof currentValue === "number";

        return (
            ( isDailyValueExist && isCurrentValueExist )
                ? Utils.roundToDecimal(( currentValue / dailyValue ) * PERCENT_MULTIPLIER, ACCURACY)
                : null
        );
    }

    public static getObjectKeys<T>(obj: T | Dictionary<keyof T, unknown>): (keyof T)[] {
        return Object.keys(obj) as (keyof T)[];
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

    public static keepCaretInPlace(window: Window & typeof globalThis, event: React.ChangeEvent<HTMLInputElement>): void {
        const caret = event.target.selectionStart;
        const element = event.target;
        window.requestAnimationFrame(() => {
            element.selectionStart = caret;
            element.selectionEnd = caret;
        });
    }
}

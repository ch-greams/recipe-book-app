import type { NutritionFact } from "@views/shared/NutritionFactsBlock";

import NUTRITION_FACT_DESCRIPTIONS from "./mapping/nutritionFactDescriptions";
import type { NutritionFactDescription } from "./nutritionFacts";
import { NutritionFactType } from "./nutritionFacts";
import type { CustomUnit, CustomUnitInput } from "./units";
import { VolumeUnit, WeightUnit } from "./units";


export enum RoutePath {
    Home = "",
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

export default class Utils {

    public static readonly MAX_DAILY_VALUE: number = 999;

    public static readonly ZERO: number = 0;
    private static readonly CENTUM: number = 100;

    public static readonly CUP_TO_ML: number = 240;
    public static readonly TBSP_TO_ML: number = 14.7868;
    public static readonly TSP_TO_ML: number = 4.92892;
    public static readonly OZ_TO_G: number = 28.3495;

    public static readonly COLOR_DEFAULT: string = "#00bfa5";
    public static readonly COLOR_DEFAULT_DARK: string = "#008e76";
    public static readonly COLOR_ALTERNATIVE: string = "#ff6e40";
    public static readonly COLOR_WHITE: string = "#fff";

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

    public static unwrap<T>(value: Option<T>, defaultValue: T): T {
        return this.isSome(value) ? value : defaultValue;
    }

    public static unwrapForced<T>(value: Option<T>, name: string): T {
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

    public static getObjectKeys<T>(obj: T | Dictionary<keyof T, unknown>): (keyof T)[] {
        return Object.keys(obj) as (keyof T)[];
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
                    return Utils.isSome(value) ? Utils.unwrap(sum, Utils.ZERO) + value : null;
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
            .reduce((acc, cur) => ({
                ...acc,
                [cur]: Utils.roundToDecimal(Utils.unwrap(nutritionFacts[cur], Utils.ZERO) * multiplier, DecimalPlaces.Two),
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

    public static getItemPath(route: RoutePath, id: number): string {
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
            (acc, nfType) => ({ ...acc, [nfType]: Utils.isSome(values[nfType]) ? String(values[nfType]) : null }), {},
        );
    }
    
    public static convertNutritionFactInputsIntoValues(values: Dictionary<NutritionFactType, string>): Dictionary<NutritionFactType, number> {
        return Utils.getObjectKeys(values).reduce<Dictionary<NutritionFactType, number>>(
            (acc, nfType) => ({ ...acc, [nfType]: Number(values[nfType]) }), {},
        );
    }
    
    public static convertCustomUnitsIntoInputs(customUnits: CustomUnit[]): CustomUnitInput[] {
        return customUnits.map(this.convertCustomUnitIntoInput);
    }
    
    public static convertCustomUnitsIntoValues(customUnits: CustomUnitInput[]): CustomUnit[] {
        return customUnits.map(this.convertCustomUnitIntoValue);
    }

    public static convertCustomUnitIntoInput(customUnit: CustomUnit): CustomUnitInput {
        return { ...customUnit, amount: String(customUnit.amount) };
    }

    public static convertCustomUnitIntoValue(customUnit: CustomUnitInput): CustomUnit {
        return { ...customUnit, amount: Number(customUnit.amount) };
    }
}

import { NutritionFactType } from "./nutritionFacts";
import type { Dictionary, Option } from "./typings";
import { VolumeUnit, WeightUnit } from "./units";


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

    public static isEmptyString(value: string): boolean {
        return value.trim().length === Utils.ZERO;
    }

    public static unwrap<T>(value: Option<T>, defaultValue: T): T {
        return this.isSome(value) ? value : defaultValue;
    }

    public static isSome<T>(value: Option<T>): value is T {
        return (value !== null) && (value !== undefined);
    }

    // NOTE: APP-SPECIFIC CALCULATIONS

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
}

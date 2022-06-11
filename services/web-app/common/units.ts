import { isEnum, isSome } from "@common/types";


export enum NutritionFactUnit {
    g = "g",
    mg = "mg",
    mcg = "mcg",
    IU = "IU",

    kcal = "kcal",
    kj = "kj",
}

export enum WeightUnit {
    g = "g",
    oz = "oz",
}

export enum VolumeUnit {
    ml = "ml",
    cup = "cup",
    tbsp = "tbsp",
    tsp = "tsp",
}

export const Units = { ...WeightUnit, ...VolumeUnit };
export type Units = WeightUnit | VolumeUnit;


export enum TemperatureUnit {
    C = "C",
    F = "F",
}

export enum TimeUnit {
    min = "min",
    h = "h",
}

export interface CustomUnit {
    name: string;
    amount: number;
    unit: Units;
    product_id: number;
}

export interface CustomUnitInput extends CustomUnit {
    amountInput: string;
}

export const DEFAULT_WEIGHT_UNIT: WeightUnit = WeightUnit.g;
export const DEFAULT_VOLUME_UNIT: VolumeUnit = VolumeUnit.ml;
export const DEFAULT_TIME_UNIT: TimeUnit = TimeUnit.min;
export const DEFAULT_TEMPERATURE_UNIT: TemperatureUnit = TemperatureUnit.C;

export const DEFAULT_DENSITY: number = 1;

//------------------------------------------------------------------------------
// Conversion
//------------------------------------------------------------------------------

export const CUP_TO_ML: number = 240;
export const TBSP_TO_ML: number = 14.7868;
export const TSP_TO_ML: number = 4.92892;
export const OZ_TO_G: number = 28.3495;

export function convertDensityFromMetric(value: number, weightUnit: WeightUnit, volumeUnit: VolumeUnit): number {

    const convertedWeight = convertWeightFromMetric(value, weightUnit);
    const convertedVolume = convertVolumeFromMetric(convertedWeight, volumeUnit);

    return convertedVolume;
}

export function convertDensityToMetric(value: number, weightUnit: WeightUnit, volumeUnit: VolumeUnit): number {

    const convertedWeight = convertWeightToMetric(value, weightUnit);
    const convertedVolume = convertVolumeToMetric(convertedWeight, volumeUnit);

    return convertedVolume;
}


export function convertVolumeFromMetric(value: number, volumeUnit: VolumeUnit): number {

    switch (volumeUnit) {

        case VolumeUnit.cup:
            return ( value / CUP_TO_ML );
        case VolumeUnit.tbsp:
            return ( value / TBSP_TO_ML );
        case VolumeUnit.tsp:
            return ( value / TSP_TO_ML );

        case VolumeUnit.ml:
        default:
            return value;
    }
}

export function convertVolumeToMetric(value: number, volumeUnit: VolumeUnit): number {

    switch (volumeUnit) {

        case VolumeUnit.cup:
            return ( value * CUP_TO_ML );
        case VolumeUnit.tbsp:
            return ( value * TBSP_TO_ML );
        case VolumeUnit.tsp:
            return ( value * TSP_TO_ML );

        case VolumeUnit.ml:
        default:
            return value;
    }
}


export function convertWeightFromMetric(value: number, weightUnit: WeightUnit): number {

    switch (weightUnit) {

        case WeightUnit.oz:
            return ( value / OZ_TO_G );

        case WeightUnit.g:
        default:
            return value;
    }
}

export function convertWeightToMetric(value: number, weightUnit: WeightUnit): number {

    switch (weightUnit) {

        case WeightUnit.oz:
            return ( value * OZ_TO_G );

        case WeightUnit.g:
        default:
            return value;
    }
}

export function convertFromMetric(
    value: number,
    unit: WeightUnit | VolumeUnit | string,
    customUnits: CustomUnit[],
    density: number = DEFAULT_DENSITY,
): number {

    if (isEnum<VolumeUnit, typeof VolumeUnit>(VolumeUnit, unit)) {
        return convertVolumeFromMetric(value, unit) / density;
    }
    else if (isEnum<WeightUnit, typeof WeightUnit>(WeightUnit, unit)) {
        return convertWeightFromMetric(value, unit);
    }
    else {
        const customUnit = customUnits.find((cu) => cu.name === unit);
        return isSome(customUnit) ? customUnit.amount / value : value;
    }
}

export function convertToMetric(
    value: number,
    unit: WeightUnit | VolumeUnit | string,
    customUnits: CustomUnit[],
    density: number = DEFAULT_DENSITY,
): number {

    if (isEnum<VolumeUnit, typeof VolumeUnit>(VolumeUnit, unit)) {
        return convertVolumeToMetric(value, unit) * density;
    }
    else if (isEnum<WeightUnit, typeof WeightUnit>(WeightUnit, unit)) {
        return convertWeightToMetric(value, unit);
    }
    else {
        const customUnit = customUnits.find((cu) => cu.name === unit);
        return isSome(customUnit) ? customUnit.amount * value : value;
    }
}

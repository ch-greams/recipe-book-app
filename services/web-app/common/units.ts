import { isEnum, isSome } from "@common/types";


export enum NutrientUnit {
    g = "g",
    mg = "mg",
    mcg = "mcg",

    kcal = "kcal",
    kj = "kj",
}

export enum WeightUnit {
    g = "g",
    oz = "oz",
    lb = "lb",
}

export enum VolumeUnit {
    ml = "ml",
    cup = "cup",
    tbsp = "tbsp",
    tsp = "tsp",
}

export const Unit = { ...WeightUnit, ...VolumeUnit };
export type Unit = WeightUnit | VolumeUnit;


export enum TemperatureUnit {
    C = "C",
    F = "F",
}

export enum TimeUnit {
    s = "s",
    min = "min",
    h = "h",
}

export interface CustomUnit {
    name: string;
    amount: number;
    unit: Unit;
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

export const OZ_TO_G: number = 28.34952;
export const LB_TO_G: number = 453.59237;

export const TIME_MULTIPLIER: number = 60;


// NOTE: Weight and volume conversion

export function convertDensityFromMetric(value: number, weightUnit: WeightUnit, volumeUnit: VolumeUnit): number {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return convertWeightFromMetric(value, weightUnit) / convertVolumeFromMetric(1, volumeUnit);
}

export function convertDensityToMetric(value: number, weightUnit: WeightUnit, volumeUnit: VolumeUnit): number {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return convertWeightToMetric(value, weightUnit) / convertVolumeToMetric(1, volumeUnit);
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

        case WeightUnit.lb:
            return ( value / LB_TO_G );

        case WeightUnit.g:
        default:
            return value;
    }
}

export function convertWeightToMetric(value: number, weightUnit: WeightUnit): number {

    switch (weightUnit) {

        case WeightUnit.oz:
            return ( value * OZ_TO_G );

        case WeightUnit.lb:
            return ( value * LB_TO_G );

        case WeightUnit.g:
        default:
            return value;
    }
}

export function convertFromMetric(
    value: number,
    unit: Unit | string,
    customUnits: CustomUnit[],
    density: number,
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
    unit: Unit | string,
    customUnits: CustomUnit[],
    density: number,
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

// NOTE: Time conversion

export function convertFromSeconds(value: number, timeUnit: TimeUnit): number {

    switch (timeUnit) {
        case TimeUnit.h:
            return value / (TIME_MULTIPLIER * TIME_MULTIPLIER);

        case TimeUnit.min:
            return value / TIME_MULTIPLIER;

        case TimeUnit.s:
        default:
            return value;
    }
}

export function convertToSeconds(value: number, timeUnit: TimeUnit): number {
    switch (timeUnit) {
        case TimeUnit.h:
            return value * TIME_MULTIPLIER * TIME_MULTIPLIER;

        case TimeUnit.min:
            return value * TIME_MULTIPLIER;

        case TimeUnit.s:
        default:
            return value;
    }
}

// NOTE: Temperature conversion

export function convertCelsiusToFahrenheit(value: number): number {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return (value * 1.8) + 32;
}

export function convertFahrenheitToCelsius(value: number): number {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return (value - 32) / 1.8;
}

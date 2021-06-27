

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
    unit: WeightUnit;
}

export interface CustomUnitInput {
    name: string;
    amount: string;
    unit: WeightUnit;
}

export const DEFAULT_WEIGHT_UNIT: WeightUnit = WeightUnit.g;
export const DEFAULT_VOLUME_UNIT: VolumeUnit = VolumeUnit.ml;
export const DEFAULT_TIME_UNIT: TimeUnit = TimeUnit.min;
export const DEFAULT_TEMPERATURE_UNIT: TemperatureUnit = TemperatureUnit.C;

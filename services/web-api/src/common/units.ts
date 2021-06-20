

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
export type Units = typeof Units;


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



export enum UnitWeight {
    g = "g",
    mg = "mg",
    mcg = "mcg",
    IU = "IU",
    oz = "oz",
}

export enum UnitVolume {
    ml = "ml",
    cup = "cup",
    tbsp = "tbsp",
    tsp = "tsp",
}

export const Units = { ...UnitWeight, ...UnitVolume };
export type Units = typeof Units;

export enum UnitEnergy {
    kcal = "kcal",
    kj = "kj",
}

export enum UnitTemperature {
    C = "C",
    F = "F",
}

export enum UnitTime {
    min = "min",
    h = "h",
}

export interface CustomUnit {
    name: string;
    amount: number;
    unit: UnitWeight;
}

export interface CustomUnitInput {
    name: string;
    amount: string;
    unit: UnitWeight;
}

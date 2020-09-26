

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

export enum UnitEnergy {
    kcal = "kcal",
    kj = "kj",
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
